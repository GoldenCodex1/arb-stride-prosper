import { ArrowDownToLine, ArrowUpFromLine, TrendingUp, Gift } from "lucide-react";

const transactions = [
  { id: 1, type: "Deposit", amount: "+$2,000.00", method: "NowPayments (BTC)", date: "2 mins ago", icon: ArrowDownToLine },
  { id: 2, type: "Trade Profit", amount: "+$84.20", method: "BTC/USDT Spread", date: "15 mins ago", icon: TrendingUp },
  { id: 3, type: "Withdrawal", amount: "-$500.00", method: "USDT (TRC20)", date: "1 hour ago", icon: ArrowUpFromLine },
  { id: 4, type: "Referral", amount: "+$12.00", method: "Commission", date: "3 hours ago", icon: Gift },
  { id: 5, type: "Trade Profit", amount: "+$156.30", method: "ETH Triangle Arb", date: "5 hours ago", icon: TrendingUp },
];

const typeColor: Record<string, string> = {
  Deposit: "text-success",
  "Trade Profit": "text-success",
  Withdrawal: "text-destructive",
  Referral: "text-primary",
};

export default function RecentTransactions() {
  return (
    <div className="glass-card overflow-hidden">
      <div className="divide-y divide-border/10">
        {transactions.map((tx) => (
          <div key={tx.id} className="flex items-center justify-between px-4 py-3 hover:bg-secondary/30 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center">
                <tx.icon className="w-4 h-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium">{tx.type}</p>
                <p className="text-xs text-muted-foreground">{tx.method}</p>
              </div>
            </div>
            <div className="text-right">
              <p className={`text-sm font-semibold font-display ${typeColor[tx.type]}`}>{tx.amount}</p>
              <p className="text-xs text-muted-foreground">{tx.date}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
