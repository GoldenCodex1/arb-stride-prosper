import { ArrowDownToLine, ArrowUpFromLine, TrendingUp, Gift } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import type { Tables } from "@/integrations/supabase/types";

const iconMap: Record<string, any> = {
  deposit: ArrowDownToLine,
  withdrawal: ArrowUpFromLine,
  profit: TrendingUp,
  trade_profit: TrendingUp,
  referral: Gift,
  commission: Gift,
};

const colorMap: Record<string, string> = {
  deposit: "text-success",
  profit: "text-success",
  trade_profit: "text-success",
  withdrawal: "text-destructive",
  referral: "text-primary",
  commission: "text-primary",
};

interface Props {
  transactions: Tables<"transactions">[];
}

export default function RecentTransactions({ transactions }: Props) {
  if (transactions.length === 0) {
    return (
      <div className="glass-card p-8 text-center">
        <p className="text-sm text-muted-foreground">No transactions yet.</p>
      </div>
    );
  }

  return (
    <div className="glass-card overflow-hidden">
      <div className="divide-y divide-border/10">
        {transactions.map((tx) => {
          const Icon = iconMap[tx.type] || ArrowDownToLine;
          const color = colorMap[tx.type] || "text-foreground";
          const amount = Number(tx.amount);
          const sign = amount >= 0 ? "+" : "";

          return (
            <div key={tx.id} className="flex items-center justify-between px-4 py-3 hover:bg-secondary/30 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center">
                  <Icon className="w-4 h-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm font-medium capitalize">{tx.type.replace("_", " ")}</p>
                  <p className="text-xs text-muted-foreground">{tx.description || "—"}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-sm font-semibold font-display ${color}`}>
                  {sign}${Math.abs(amount).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(tx.created_at), { addSuffix: true })}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
