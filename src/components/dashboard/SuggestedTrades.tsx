import { Clock, TrendingUp, Users, Zap } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import type { Tables } from "@/integrations/supabase/types";

const riskColor: Record<string, string> = {
  Low: "status-badge-success",
  Medium: "status-badge-warning",
  High: "status-badge-danger",
};

interface Props {
  trades: Tables<"trades">[];
}

export default function SuggestedTrades({ trades }: Props) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const joinTrade = async (trade: Tables<"trades">) => {
    if (!user) return;
    const { error } = await supabase.from("trade_entries").insert({
      trade_id: trade.id,
      user_id: user.id,
      amount: Number(trade.min_investment),
    });
    if (error) {
      toast.error(error.message);
    } else {
      toast.success(`Joined ${trade.title}`);
      queryClient.invalidateQueries({ queryKey: ["active-trade-entries"] });
      queryClient.invalidateQueries({ queryKey: ["suggested-trades"] });
    }
  };

  if (trades.length === 0) {
    return (
      <div className="glass-card p-8 text-center">
        <p className="text-sm text-muted-foreground">No active trade opportunities right now.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {trades.map((trade) => {
        const remainingSlots = trade.slot_limit - trade.slots_filled;
        const timeLeft = trade.expires_at
          ? getTimeLeft(trade.expires_at)
          : `${trade.duration_hours}h`;

        return (
          <div key={trade.id} className="glass-card-hover p-5 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-semibold text-sm">{trade.title}</h3>
              <span className={riskColor[trade.risk_level] || "status-badge-info"}>{trade.risk_level}</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <TrendingUp className="w-3.5 h-3.5 text-success" />
                <span>ROI: <span className="text-success font-semibold">{Number(trade.roi_percent)}%</span></span>
              </div>
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Clock className="w-3.5 h-3.5" />
                <span>{trade.duration_hours}h</span>
              </div>
              <div className="text-muted-foreground">
                Min: <span className="text-foreground">${Number(trade.min_investment).toLocaleString()}</span>
              </div>
              <div className="text-muted-foreground">
                Max: <span className="text-foreground">${Number(trade.max_investment).toLocaleString()}</span>
              </div>
            </div>

            <div className="flex items-center justify-between mt-auto pt-3 border-t border-border/30">
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Users className="w-3 h-3" /> {remainingSlots} slots
                </span>
                <span className="flex items-center gap-1">
                  <Zap className="w-3 h-3" /> {timeLeft}
                </span>
              </div>
              <button
                onClick={() => joinTrade(trade)}
                disabled={remainingSlots <= 0}
                className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                Join
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function getTimeLeft(expiresAt: string): string {
  const diff = new Date(expiresAt).getTime() - Date.now();
  if (diff <= 0) return "Expired";
  const hours = Math.floor(diff / 3600000);
  const mins = Math.floor((diff % 3600000) / 60000);
  return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
}
