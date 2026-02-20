import { motion } from "framer-motion";
import { Copy, Check, Users, Gift, TrendingUp } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { formatDistanceToNow } from "date-fns";

export default function Referral() {
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);

  const { data: profile } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      const { data } = await supabase.from("profiles").select("referral_code").eq("user_id", user!.id).maybeSingle();
      return data;
    },
    enabled: !!user,
  });

  const { data: referrals } = useQuery({
    queryKey: ["referrals", user?.id],
    queryFn: async () => {
      const { data } = await supabase.from("referrals").select("*").eq("referrer_id", user!.id).order("created_at", { ascending: false });
      return data ?? [];
    },
    enabled: !!user,
  });

  const code = profile?.referral_code ?? "...";
  const totalEarnings = referrals?.reduce((sum, r) => sum + Number(r.total_commission), 0) ?? 0;
  const commissionRate = referrals?.[0]?.commission_percent ?? 1;

  const handleCopy = () => {
    navigator.clipboard.writeText(`${window.location.origin}/auth?ref=${code}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <h1 className="font-display font-bold text-2xl">Referral Program</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="metric-card">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Total Referrals</span>
            <Users className="w-4 h-4 text-muted-foreground" />
          </div>
          <span className="text-2xl font-display font-bold">{referrals?.length ?? 0}</span>
        </div>
        <div className="metric-card">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Total Earnings</span>
            <Gift className="w-4 h-4 text-muted-foreground" />
          </div>
          <span className="text-2xl font-display font-bold text-success">
            ${totalEarnings.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </span>
        </div>
        <div className="metric-card">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Commission Rate</span>
            <TrendingUp className="w-4 h-4 text-muted-foreground" />
          </div>
          <span className="text-2xl font-display font-bold">{commissionRate}%</span>
        </div>
      </div>

      <div className="glass-card p-5 space-y-3">
        <p className="font-display font-semibold text-sm">Your Referral Link</p>
        <div className="flex items-center gap-2">
          <code className="flex-1 bg-secondary/50 px-3 py-2.5 rounded-lg text-sm font-mono text-foreground truncate">
            {window.location.origin}/auth?ref={code}
          </code>
          <button onClick={handleCopy} className="px-4 py-2.5 rounded-lg text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors flex items-center gap-2">
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
      </div>

      {referrals && referrals.length > 0 && (
        <div className="glass-card overflow-hidden">
          <div className="px-4 py-3 border-b border-border/30">
            <h3 className="font-display font-semibold text-sm">Referral History</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/30">
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Referred User</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Joined</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Commission</th>
                </tr>
              </thead>
              <tbody>
                {referrals.map((r) => (
                  <tr key={r.id} className="border-b border-border/10 hover:bg-secondary/30 transition-colors">
                    <td className="px-4 py-3 font-medium font-mono text-xs">{r.referred_id.slice(0, 8)}...</td>
                    <td className="px-4 py-3 text-muted-foreground">{formatDistanceToNow(new Date(r.created_at), { addSuffix: true })}</td>
                    <td className="px-4 py-3 text-success font-semibold">${Number(r.total_commission).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </motion.div>
  );
}
