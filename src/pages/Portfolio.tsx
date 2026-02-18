import { motion } from "framer-motion";
import { Briefcase, TrendingUp, DollarSign, BarChart3 } from "lucide-react";
import MetricCard from "@/components/dashboard/MetricCard";

const holdings = [
  { asset: "BTC", amount: "0.2541 BTC", value: "$10,420.00", change: "+5.2%" },
  { asset: "ETH", amount: "3.125 ETH", value: "$8,260.00", change: "+3.1%" },
  { asset: "USDT", amount: "5,900 USDT", value: "$5,900.00", change: "0%" },
];

export default function Portfolio() {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <h1 className="font-display font-bold text-2xl">Portfolio</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <MetricCard label="Total Value" value="$24,580.00" icon={Briefcase} trend="+12.5%" positive />
        <MetricCard label="Total Invested" value="$18,000.00" icon={DollarSign} />
        <MetricCard label="Total Profit" value="$6,580.00" icon={TrendingUp} trend="+36.5%" positive />
        <MetricCard label="Active Trades" value="5" icon={BarChart3} />
      </div>

      <div className="glass-card overflow-hidden">
        <div className="px-4 py-3 border-b border-border/30">
          <h3 className="font-display font-semibold text-sm">Holdings</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/30">
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Asset</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Amount</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Value</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">24h Change</th>
              </tr>
            </thead>
            <tbody>
              {holdings.map((h, i) => (
                <tr key={i} className="border-b border-border/10 hover:bg-secondary/30 transition-colors">
                  <td className="px-4 py-3 font-display font-semibold">{h.asset}</td>
                  <td className="px-4 py-3 font-mono text-sm">{h.amount}</td>
                  <td className="px-4 py-3">{h.value}</td>
                  <td className={`px-4 py-3 font-semibold ${h.change.startsWith("+") ? "text-success" : "text-muted-foreground"}`}>
                    {h.change}
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
