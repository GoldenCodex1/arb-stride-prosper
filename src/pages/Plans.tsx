import { motion } from "framer-motion";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useUserPlan } from "@/hooks/useUserPlan";
import { toast } from "sonner";
import { Shield, Check, Zap } from "lucide-react";

const container = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

export default function Plans() {
  const { user } = useAuth();
  const { plan: currentPlan } = useUserPlan();
  const queryClient = useQueryClient();

  const { data: plans } = useQuery({
    queryKey: ["available-plans"],
    queryFn: async () => {
      const { data } = await supabase.from("plans").select("*").eq("is_active", true).order("monthly_price", { ascending: true });
      return data ?? [];
    },
  });

  const handleUpgrade = async (planId: string, planName: string) => {
    if (!user) return;
    if (currentPlan?.id === planId) { toast.info("You're already on this plan"); return; }

    // For now, directly assign plan (payment integration placeholder)
    const { error } = await supabase.from("profiles").update({
      plan_id: planId,
      plan_started_at: new Date().toISOString(),
    } as any).eq("user_id", user.id);

    if (error) toast.error(error.message);
    else {
      toast.success(`Upgraded to ${planName}!`);
      queryClient.invalidateQueries({ queryKey: ["user-plan"] });
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    }
  };

  const fmt = (n: number) => Number(n) >= 999999 ? "Unlimited" : Number(n).toLocaleString();

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="max-w-4xl mx-auto space-y-6">
      <motion.div variants={item} className="text-center">
        <h1 className="font-display font-bold text-2xl">Choose Your Plan</h1>
        <p className="text-sm text-muted-foreground mt-1">Unlock higher trading limits and automation power</p>
      </motion.div>

      <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {plans?.map((plan) => {
          const isCurrent = currentPlan?.id === plan.id;
          const price = Number(plan.monthly_price);

          return (
            <div key={plan.id} className={`glass-card p-6 flex flex-col gap-4 relative ${isCurrent ? "ring-2 ring-primary" : ""}`}>
              {isCurrent && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-primary text-primary-foreground">
                  Current Plan
                </div>
              )}

              <div className="text-center">
                <Shield className="w-8 h-8 text-primary mx-auto mb-2" />
                <h3 className="font-display font-bold text-lg">{plan.name}</h3>
                <p className="text-xs text-muted-foreground mt-1">{plan.description}</p>
              </div>

              <p className="text-3xl font-display font-bold text-center">
                {price === 0 ? "Free" : <>${price}<span className="text-sm font-normal text-muted-foreground">/mo</span></>}
              </p>

              <div className="space-y-2 flex-1">
                <Feature text={`${fmt(plan.max_trades_per_day)} trades/day`} />
                <Feature text={`$${fmt(plan.max_trade_amount)} max trade`} />
                <Feature text={`${fmt(plan.max_auto_trade_slots)} auto bot slots`} />
                <Feature text={`$${fmt(plan.daily_withdrawal_limit)} daily withdrawal`} />
              </div>

              <button
                onClick={() => handleUpgrade(plan.id, plan.name)}
                disabled={isCurrent}
                className={`w-full py-2.5 rounded-lg font-semibold text-sm transition-colors ${
                  isCurrent
                    ? "bg-secondary text-muted-foreground cursor-default"
                    : "bg-primary text-primary-foreground hover:bg-primary/90"
                }`}
              >
                {isCurrent ? "Current Plan" : price === 0 ? "Downgrade" : "Upgrade"}
              </button>
            </div>
          );
        })}
      </motion.div>
    </motion.div>
  );
}

function Feature({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <Check className="w-3.5 h-3.5 text-success shrink-0" />
      <span>{text}</span>
    </div>
  );
}
