import { motion } from "framer-motion";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export default function AdminBotSettings() {
  const queryClient = useQueryClient();

  const { data: botActivities } = useQuery({
    queryKey: ["admin-bot-activities"],
    queryFn: async () => {
      const { data } = await supabase.from("bot_activity").select("*").order("created_at", { ascending: false });
      return data ?? [];
    },
  });

  const activeBots = botActivities?.filter((b) => b.bot_enabled).length ?? 0;
  const totalProfit = botActivities?.reduce((s, b) => s + Number(b.profit_today), 0) ?? 0;
  const totalLoss = botActivities?.reduce((s, b) => s + Number(b.loss_today), 0) ?? 0;

  const toggleBot = async (id: string, userId: string, current: boolean) => {
    const { error } = await supabase.from("bot_activity").update({ bot_enabled: !current }).eq("id", id);
    if (error) toast.error(error.message);
    else {
      toast.success(current ? "Bot disabled" : "Bot enabled");
      queryClient.invalidateQueries({ queryKey: ["admin-bot-activities"] });
    }
  };

  const resetDaily = async (id: string) => {
    const { error } = await supabase.from("bot_activity").update({ trades_today: 0, profit_today: 0, loss_today: 0, last_reset_at: new Date().toISOString() }).eq("id", id);
    if (error) toast.error(error.message);
    else {
      toast.success("Daily stats reset");
      queryClient.invalidateQueries({ queryKey: ["admin-bot-activities"] });
    }
  };

  const fmt = (n: number) => "$" + n.toLocaleString("en-US", { minimumFractionDigits: 2 });

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <h1 className="font-display font-bold text-xl sm:text-2xl">Auto Bot Settings</h1>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        <div className="glass-card p-4">
          <p className="text-xs text-muted-foreground">Total Users</p>
          <p className="text-2xl font-display font-bold mt-1">{botActivities?.length ?? 0}</p>
        </div>
        <div className="glass-card p-4">
          <p className="text-xs text-muted-foreground">Active Bots</p>
          <p className="text-2xl font-display font-bold mt-1 text-success">{activeBots}</p>
        </div>
        <div className="glass-card p-4">
          <p className="text-xs text-muted-foreground">Today's Profit</p>
          <p className="text-2xl font-display font-bold mt-1 text-success">{fmt(totalProfit)}</p>
        </div>
        <div className="glass-card p-4">
          <p className="text-xs text-muted-foreground">Today's Loss</p>
          <p className="text-2xl font-display font-bold mt-1 text-destructive">{fmt(totalLoss)}</p>
        </div>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/30">
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">User</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Status</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Risk</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Trades Today</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Profit</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Loss</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Compound</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {botActivities?.map((b) => (
                <tr key={b.id} className="border-b border-border/10 hover:bg-secondary/30 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs">{b.user_id.slice(0, 8)}...</td>
                  <td className="px-4 py-3">
                    <span className={b.bot_enabled ? "status-badge-success" : "status-badge-danger"}>{b.bot_enabled ? "Active" : "Off"}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={b.risk_profile === "conservative" ? "status-badge-success" : b.risk_profile === "moderate" ? "status-badge-warning" : "status-badge-danger"}>{b.risk_profile}</span>
                  </td>
                  <td className="px-4 py-3">{b.trades_today}/{b.daily_trade_limit}</td>
                  <td className="px-4 py-3 text-success">{fmt(Number(b.profit_today))}</td>
                  <td className="px-4 py-3 text-destructive">{fmt(Number(b.loss_today))}</td>
                  <td className="px-4 py-3">{b.compound_profits ? "Yes" : "No"}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => toggleBot(b.id, b.user_id, b.bot_enabled)} className="text-xs text-primary hover:underline">
                        {b.bot_enabled ? "Disable" : "Enable"}
                      </button>
                      <button onClick={() => resetDaily(b.id)} className="text-xs text-muted-foreground hover:text-foreground hover:underline">Reset</button>
                    </div>
                  </td>
                </tr>
              ))}
              {(!botActivities || botActivities.length === 0) && (
                <tr><td colSpan={8} className="px-4 py-8 text-center text-muted-foreground">No bot activity.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}
