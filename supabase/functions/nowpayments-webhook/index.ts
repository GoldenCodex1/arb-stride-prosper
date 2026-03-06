import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { crypto } from "https://deno.land/std@0.208.0/crypto/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-nowpayments-sig",
};

async function hmacSha512(key: string, data: string): Promise<string> {
  const encoder = new TextEncoder();
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    encoder.encode(key),
    { name: "HMAC", hash: "SHA-512" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", cryptoKey, encoder.encode(data));
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function sortObject(obj: Record<string, unknown>): Record<string, unknown> {
  const sorted: Record<string, unknown> = {};
  for (const key of Object.keys(obj).sort()) {
    const val = obj[key];
    if (val && typeof val === "object" && !Array.isArray(val)) {
      sorted[key] = sortObject(val as Record<string, unknown>);
    } else {
      sorted[key] = val;
    }
  }
  return sorted;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  try {
    const body = await req.json();
    const ipnSecret = Deno.env.get("NOWPAYMENTS_IPN_SECRET");

    // Step 1: Validate signature
    if (ipnSecret) {
      const receivedSig = req.headers.get("x-nowpayments-sig");
      if (!receivedSig) {
        console.error("Missing signature header");
        return new Response(JSON.stringify({ error: "Missing signature" }), {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const sorted = sortObject(body);
      const expectedSig = await hmacSha512(ipnSecret, JSON.stringify(sorted));

      if (receivedSig !== expectedSig) {
        console.error("Signature mismatch");
        await supabase.from("webhook_logs").insert({
          provider: "nowpayments",
          status: "rejected",
          payload_hash: receivedSig?.slice(0, 32) ?? null,
          error_message: "Signature mismatch",
          response_code: 401,
        });
        return new Response(JSON.stringify({ error: "Invalid signature" }), {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    // Log webhook receipt
    await supabase.from("webhook_logs").insert({
      provider: "nowpayments",
      status: "received",
      payload_hash: body.payment_id?.toString() ?? null,
      response_code: 200,
    });

    // Step 2: Only process finished payments
    if (body.payment_status !== "finished") {
      console.log(`Ignoring payment status: ${body.payment_status}`);
      return new Response(JSON.stringify({ ok: true, status: "ignored" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const paymentId = String(body.payment_id);
    const amount = Number(body.actually_paid || body.pay_amount);
    const currency = String(body.pay_currency || "USDT").toUpperCase();
    const orderId = body.order_id; // should contain user_id
    const txHash = body.payin_hash || null;

    if (!paymentId || !orderId || isNaN(amount) || amount <= 0) {
      return new Response(JSON.stringify({ error: "Invalid payload" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Step 3: Amount tolerance check (allow 1% variance for crypto)
    const invoiceAmount = Number(body.price_amount || body.pay_amount);
    if (invoiceAmount > 0 && amount < invoiceAmount * 0.99) {
      console.error(`Amount mismatch: paid=${amount}, expected=${invoiceAmount}`);
      await supabase.from("webhook_logs").insert({
        provider: "nowpayments",
        status: "rejected",
        payload_hash: paymentId,
        error_message: `Amount mismatch: paid=${amount}, expected=${invoiceAmount}`,
        response_code: 400,
      });
      return new Response(JSON.stringify({ error: "Amount mismatch" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Step 4: Idempotency - check if already processed
    const { data: existing } = await supabase
      .from("deposits")
      .select("id")
      .eq("tx_hash", paymentId)
      .eq("method", "nowpayments")
      .maybeSingle();

    if (existing) {
      console.log(`Duplicate payment_id ${paymentId}, skipping`);
      return new Response(JSON.stringify({ ok: true, status: "duplicate" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Step 5: Create deposit record
    const userId = orderId; // order_id should be set to user_id when creating invoice
    const { error: depositError } = await supabase.from("deposits").insert({
      user_id: userId,
      amount,
      currency,
      method: "nowpayments",
      tx_hash: paymentId,
      network: body.pay_currency || null,
      status: "approved",
    });

    if (depositError) {
      console.error("Deposit insert error:", depositError);
      return new Response(JSON.stringify({ error: depositError.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Step 6: Credit user ledger (idempotent check via reference_id)
    const { data: existingTx } = await supabase
      .from("transactions")
      .select("id")
      .eq("reference_id", paymentId)
      .eq("type", "deposit")
      .maybeSingle();

    if (!existingTx) {
      const { error: txError } = await supabase.from("transactions").insert({
        user_id: userId,
        type: "deposit",
        amount,
        description: `NOWPayments deposit (${currency}) - ${txHash || paymentId}`,
        reference_id: null, // payment_id is string, reference_id is uuid
      });

      if (txError) {
        console.error("Transaction insert error:", txError);
      }
    }

    // Update webhook log to success
    await supabase.from("webhook_logs").insert({
      provider: "nowpayments",
      status: "processed",
      payload_hash: paymentId,
      response_code: 200,
    });

    console.log(`Successfully credited ${amount} ${currency} to user ${userId}`);

    return new Response(JSON.stringify({ ok: true, status: "credited" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Webhook processing error:", err);
    await supabase.from("webhook_logs").insert({
      provider: "nowpayments",
      status: "error",
      error_message: String(err),
      response_code: 500,
    });
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
