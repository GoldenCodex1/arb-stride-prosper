import { motion } from "framer-motion";
import { Users, ShieldCheck, AlertTriangle, Wallet, ArrowUpFromLine, DollarSign, ArrowDownToLine, Clock } from "lucide-react";
import MetricCard from "@/components/dashboard/MetricCard";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

export default function AdminDashboard() {
  const queryClient = useQueryClient();

  const { data: profileCount } = useQuery({
    queryKey: ["admin-profile-count"],
    queryFn: async () => {
      const { count } = await supabase.from("profiles").select("*", { count: "exact", head: true });
      return count ?? 0;
    },
  });

  const { data: kycPending } = useQuery({
    queryKey: ["admin-kyc-pending"],
    queryFn: async () => {
      const { count } = await supabase.from("kyc").select("*", { count: "exact", head: true }).eq("status", "pending");
      return count ?? 0;
    },
  });

  const { data: pendingDeposits } = useQuery({
    queryKey: ["admin-pending-deposits"],
    queryFn: async () => {
      const { data } = await supabase.from("deposits").select("*").eq("status", "pending").order("created_at", { ascending: false });
      return data ?? [];
    },
  });

  const { data: pendingWithdrawals } = useQuery({
    queryKey: ["admin-pending-withdrawals"],
    queryFn: async () => {
      const { data } = await supabase.from("withdrawals").select("*").eq("status", "pending").order("created_at", { ascending: false });
      return data ?? [];
    },
  });

  const pendingDepositTotal = pendingDeposits?.reduce((s, d) => s + Number(d.amount), 0) ?? 0;
  const pendingWithdrawalTotal = pendingWithdrawals?.reduce((s, w) => s + Number(w.amount), 0) ?? 0;

  const handleDepositAction = async (id: string, action: "approved" | "rejected") => {
    const { error } = await supabase.from("deposits").update({ status: action }).eq("id", id);
    if (error) toast.error(error.message);
    else {
      toast.success(`Deposit ${action}`);
      queryClient.invalidateQueries({ queryKey: ["admin-pending-deposits"] });
    }
  };

  const handleWithdrawalAction = async (id: string, action: "approved" | "rejected") => {
    const { error } = await supabase.from("withdrawals").update({ status: action }).eq("id", id);
    if (error) toast.error(error.message);
    else {
      toast.success(`Withdrawal ${action}`);
      queryClient.invalidateQueries({ queryKey: ["admin-pending-withdrawals"] });
    }
  };

  const fmt = (n: number) => "$" + n.toLocaleString("en-US", { minimumFractionDigits: 2 });

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <h1 className="font-display font-bold text-xl sm:text-2xl">Admin Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <MetricCard label="Total Users" value={String(profileCount ?? 0)} icon={Users} />
        <MetricCard label="KYC Pending" value={String(kycPending ?? 0)} icon={ShieldCheck} />
        <MetricCard label="Deposit Queue" value={String(pendingDeposits?.length ?? 0)} icon={ArrowDownToLine} />
        <MetricCard label="Pending Withdrawals" value={fmt(pendingWithdrawalTotal)} icon={ArrowUpFromLine} />
      </div>

      {/* Deposit Queue */}
      <div>
        <h2 className="font-display font-semibold text-lg mb-3">Manual Deposit Queue</h2>
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/30">
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">User</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Amount</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">TX Hash</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Time</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingDeposits && pendingDeposits.length > 0 ? pendingDeposits.map((d) => (
                  <tr key={d.id} className="border-b border-border/10 hover:bg-secondary/30 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs">{d.user_id.slice(0, 8)}...</td>
                    <td className="px-4 py-3">${Number(d.amount).toLocaleString()}</td>
                    <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{d.tx_hash?.slice(0, 12) ?? "—"}...</td>
                    <td className="px-4 py-3 text-muted-foreground">{formatDistanceToNow(new Date(d.created_at), { addSuffix: true })}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button onClick={() => handleDepositAction(d.id, "approved")} className="px-3 py-1 rounded text-xs font-medium bg-success/15 text-success hover:bg-success/25 transition-colors">Approve</button>
                        <button onClick={() => handleDepositAction(d.id, "rejected")} className="px-3 py-1 rounded text-xs font-medium bg-destructive/15 text-destructive hover:bg-destructive/25 transition-colors">Reject</button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan={5} className="px-4 py-6 text-center text-muted-foreground">No pending deposits.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Withdrawal Queue */}
      <div>
        <h2 className="font-display font-semibold text-lg mb-3">Withdrawal Queue</h2>
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/30">
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">User</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Amount</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Currency</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Wallet</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingWithdrawals && pendingWithdrawals.length > 0 ? pendingWithdrawals.map((w) => (
                  <tr key={w.id} className="border-b border-border/10 hover:bg-secondary/30 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs">{w.user_id.slice(0, 8)}...</td>
                    <td className="px-4 py-3">${Number(w.amount).toLocaleString()}</td>
                    <td className="px-4 py-3">{w.currency}</td>
                    <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{w.wallet_address.slice(0, 12)}...</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button onClick={() => handleWithdrawalAction(w.id, "approved")} className="px-3 py-1 rounded text-xs font-medium bg-success/15 text-success hover:bg-success/25 transition-colors">Approve</button>
                        <button onClick={() => handleWithdrawalAction(w.id, "rejected")} className="px-3 py-1 rounded text-xs font-medium bg-destructive/15 text-destructive hover:bg-destructive/25 transition-colors">Reject</button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan={5} className="px-4 py-6 text-center text-muted-foreground">No pending withdrawals.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
