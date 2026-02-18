import { Clock, TrendingUp, Users, Zap } from "lucide-react";

const trades = [
  { id: 1, title: "BTC/USDT Spread", roi: 4.2, duration: "2h", min: 100, max: 5000, risk: "Low", slots: 12, countdown: "1h 23m" },
  { id: 2, title: "ETH Triangle Arb", roi: 6.8, duration: "4h", min: 250, max: 10000, risk: "Medium", slots: 5, countdown: "2h 45m" },
  { id: 3, title: "SOL/BNB Cross-DEX", roi: 3.1, duration: "1h", min: 50, max: 2000, risk: "Low", slots: 20, countdown: "45m" },
  { id: 4, title: "MATIC Flash Loan", roi: 8.5, duration: "6h", min: 500, max: 20000, risk: "High", slots: 3, countdown: "5h 10m" },
  { id: 5, title: "AVAX-ETH Bridge", roi: 2.9, duration: "1.5h", min: 100, max: 3000, risk: "Low", slots: 18, countdown: "1h 05m" },
  { id: 6, title: "XRP Liquidity Pool", roi: 5.4, duration: "3h", min: 200, max: 8000, risk: "Medium", slots: 8, countdown: "2h 30m" },
];

const riskColor: Record<string, string> = {
  Low: "status-badge-success",
  Medium: "status-badge-warning",
  High: "status-badge-danger",
};

export default function SuggestedTrades() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {trades.map((trade) => (
        <div key={trade.id} className="glass-card-hover p-5 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-semibold text-sm">{trade.title}</h3>
            <span className={riskColor[trade.risk]}>{trade.risk}</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <TrendingUp className="w-3.5 h-3.5 text-success" />
              <span>ROI: <span className="text-success font-semibold">{trade.roi}%</span></span>
            </div>
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Clock className="w-3.5 h-3.5" />
              <span>{trade.duration}</span>
            </div>
            <div className="text-muted-foreground">
              Min: <span className="text-foreground">${trade.min}</span>
            </div>
            <div className="text-muted-foreground">
              Max: <span className="text-foreground">${trade.max.toLocaleString()}</span>
            </div>
          </div>

          <div className="flex items-center justify-between mt-auto pt-3 border-t border-border/30">
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Users className="w-3 h-3" /> {trade.slots} slots
              </span>
              <span className="flex items-center gap-1">
                <Zap className="w-3 h-3" /> {trade.countdown}
              </span>
            </div>
            <button className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
              Join
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
