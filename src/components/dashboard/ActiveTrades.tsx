const activeTrades = [
  { id: 1, title: "BTC/USDT Spread", invested: "$1,000", roi: "+4.2%", timeLeft: "1h 10m", status: "Running" },
  { id: 2, title: "ETH Triangle Arb", invested: "$2,500", roi: "+6.8%", timeLeft: "3h 20m", status: "Running" },
  { id: 3, title: "SOL/BNB Cross-DEX", invested: "$500", roi: "+3.1%", timeLeft: "25m", status: "Completing" },
  { id: 4, title: "AVAX-ETH Bridge", invested: "$800", roi: "+2.9%", timeLeft: "50m", status: "Running" },
  { id: 5, title: "XRP Liquidity Pool", invested: "$1,200", roi: "+5.4%", timeLeft: "2h 05m", status: "Running" },
];

const statusClass: Record<string, string> = {
  Running: "status-badge-info",
  Completing: "status-badge-warning",
};

export default function ActiveTrades() {
  return (
    <div className="glass-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/30">
              <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Trade</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Invested</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">ROI</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Time Left</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Status</th>
            </tr>
          </thead>
          <tbody>
            {activeTrades.map((trade) => (
              <tr key={trade.id} className="border-b border-border/10 hover:bg-secondary/30 transition-colors">
                <td className="px-4 py-3 font-medium font-display">{trade.title}</td>
                <td className="px-4 py-3">{trade.invested}</td>
                <td className="px-4 py-3 text-success font-semibold">{trade.roi}</td>
                <td className="px-4 py-3 text-muted-foreground">{trade.timeLeft}</td>
                <td className="px-4 py-3">
                  <span className={statusClass[trade.status]}>{trade.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
