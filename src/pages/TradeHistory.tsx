import { motion } from "framer-motion";

const trades = [
  { title: "BTC/USDT Spread", invested: "$1,000", roi: "+$42.00 (4.2%)", date: "Jan 18, 2025", status: "Completed" },
  { title: "ETH Triangle Arb", invested: "$2,500", roi: "+$170.00 (6.8%)", date: "Jan 17, 2025", status: "Completed" },
  { title: "SOL/BNB Cross-DEX", invested: "$500", roi: "+$15.50 (3.1%)", date: "Jan 16, 2025", status: "Completed" },
  { title: "MATIC Flash Loan", invested: "$3,000", roi: "+$255.00 (8.5%)", date: "Jan 15, 2025", status: "Completed" },
  { title: "AVAX-ETH Bridge", invested: "$800", roi: "+$23.20 (2.9%)", date: "Jan 14, 2025", status: "Completed" },
  { title: "XRP Liquidity Pool", invested: "$1,200", roi: "+$64.80 (5.4%)", date: "Jan 13, 2025", status: "Completed" },
  { title: "DOGE Spread Arb", invested: "$400", roi: "-$8.00 (-2.0%)", date: "Jan 12, 2025", status: "Loss" },
];

export default function TradeHistory() {
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
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">ROI</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Date</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody>
              {trades.map((t, i) => (
                <tr key={i} className="border-b border-border/10 hover:bg-secondary/30 transition-colors">
                  <td className="px-4 py-3 font-medium font-display">{t.title}</td>
                  <td className="px-4 py-3">{t.invested}</td>
                  <td className={`px-4 py-3 font-semibold ${t.status === "Loss" ? "text-destructive" : "text-success"}`}>
                    {t.roi}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{t.date}</td>
                  <td className="px-4 py-3">
                    <span className={t.status === "Loss" ? "status-badge-danger" : "status-badge-success"}>
                      {t.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}
