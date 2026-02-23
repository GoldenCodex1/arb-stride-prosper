import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { formatDistanceToNow } from "date-fns";

export default function AdminReferrals() {
  const { data: referrals } = useQuery({
    queryKey: ["admin-referrals"],
    queryFn: async () => {
      const { data } = await supabase.from("referrals").select("*").order("created_at", { ascending: false });
      return data ?? [];
    },
  });

  const totalCommission = referrals?.reduce((s, r) => s + Number(r.total_commission), 0) ?? 0;
  const fmt = (n: number) => "$" + n.toLocaleString("en-US", { minimumFractionDigits: 2 });

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <h1 className="font-display font-bold text-xl sm:text-2xl">Referrals</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="glass-card p-4">
          <p className="text-xs text-muted-foreground">Total Referrals</p>
          <p className="text-2xl font-display font-bold mt-1">{referrals?.length ?? 0}</p>
        </div>
        <div className="glass-card p-4">
          <p className="text-xs text-muted-foreground">Total Commission Paid</p>
          <p className="text-2xl font-display font-bold mt-1">{fmt(totalCommission)}</p>
        </div>
        <div className="glass-card p-4">
          <p className="text-xs text-muted-foreground">Avg Commission %</p>
          <p className="text-2xl font-display font-bold mt-1">{referrals?.length ? (referrals.reduce((s, r) => s + Number(r.commission_percent), 0) / referrals.length).toFixed(2) : "0"}%</p>
        </div>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/30">
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Referrer</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Referred</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Commission %</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Total Earned</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Joined</th>
              </tr>
            </thead>
            <tbody>
              {referrals && referrals.length > 0 ? referrals.map((r) => (
                <tr key={r.id} className="border-b border-border/10 hover:bg-secondary/30 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs">{r.referrer_id.slice(0, 8)}...</td>
                  <td className="px-4 py-3 font-mono text-xs">{r.referred_id.slice(0, 8)}...</td>
                  <td className="px-4 py-3">{Number(r.commission_percent)}%</td>
                  <td className="px-4 py-3 font-semibold text-success">{fmt(Number(r.total_commission))}</td>
                  <td className="px-4 py-3 text-muted-foreground text-xs">{formatDistanceToNow(new Date(r.created_at), { addSuffix: true })}</td>
                </tr>
              )) : (
                <tr><td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">No referrals yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}
