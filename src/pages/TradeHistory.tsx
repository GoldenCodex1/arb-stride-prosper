import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { format } from "date-fns";

export default function TradeHistory() {
  const { user } = useAuth();

  const { data: entries } = useQuery({
    queryKey: ["trade-history", user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("trade_entries")
        .select("*, trades(*)")
        .eq("user_id", user!.id)
        .order("started_at", { ascending: false });
      return data ?? [];
    },
    enabled: !!user,
  });

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
      <h1 className="font-display font-bold text-2xl">Trade History</h1>
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/30">
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Trade</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Invested</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Profit</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Date</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody>
              {entries && entries.length > 0 ? entries.map((e: any) => {
                const profit = Number(e.profit ?? 0);
                const isLoss = profit < 0;
                return (
                  <tr key={e.id} className="border-b border-border/10 hover:bg-secondary/30 transition-colors">
                    <td className="px-4 py-3 font-medium font-display">{e.trades?.title ?? "—"}</td>
                    <td className="px-4 py-3">${Number(e.amount).toLocaleString()}</td>
                    <td className={`px-4 py-3 font-semibold ${isLoss ? "text-destructive" : "text-success"}`}>
                      {isLoss ? "-" : "+"}${Math.abs(profit).toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{format(new Date(e.started_at), "MMM d, yyyy")}</td>
                    <td className="px-4 py-3">
                      <span className={e.status === "completed" ? "status-badge-success" : e.status === "active" ? "status-badge-info" : "status-badge-pending"}>
                        {e.status}
                      </span>
                    </td>
                  </tr>
                );
              }) : (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">No trade history yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}
