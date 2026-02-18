import { motion } from "framer-motion";
import {
  Wallet,
  TrendingUp,
  DollarSign,
  Clock,
  Zap,
  Users,
  Bot,
  Power,
  ShieldAlert,
  BarChart3,
  Timer,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import MetricCard from "@/components/dashboard/MetricCard";
import BotControlStrip from "@/components/dashboard/BotControlStrip";
import SuggestedTrades from "@/components/dashboard/SuggestedTrades";
import ActiveTrades from "@/components/dashboard/ActiveTrades";
import RecentTransactions from "@/components/dashboard/RecentTransactions";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};
const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function Dashboard() {
  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      {/* ROW 1 — Portfolio Metrics */}
      <motion.div variants={item}>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          <MetricCard label="Total Balance" value="$24,580.00" icon={Wallet} trend="+12.5%" positive />
          <MetricCard label="Active Trades" value="5" icon={TrendingUp} />
          <MetricCard label="Total Profit" value="$3,240.50" icon={DollarSign} trend="+8.2%" positive />
          <MetricCard label="Pending Withdrawal" value="$500.00" icon={Clock} />
          <MetricCard label="Suggested Trades" value="8" icon={Zap} />
          <MetricCard label="Referral Earnings" value="$120.00" icon={Users} trend="+3 refs" positive />
        </div>
      </motion.div>

      {/* ROW 2 — Auto Bot Control */}
      <motion.div variants={item}>
        <BotControlStrip />
      </motion.div>

      {/* ROW 3 — Suggested Trades */}
      <motion.div variants={item}>
        <h2 className="font-display font-semibold text-lg mb-3">Suggested Trades</h2>
        <SuggestedTrades />
      </motion.div>

      {/* ROW 4 — Active Trades */}
      <motion.div variants={item}>
        <h2 className="font-display font-semibold text-lg mb-3">Active Trades</h2>
        <ActiveTrades />
      </motion.div>

      {/* ROW 5 — Recent Transactions */}
      <motion.div variants={item}>
        <h2 className="font-display font-semibold text-lg mb-3">Recent Transactions</h2>
        <RecentTransactions />
      </motion.div>
    </motion.div>
  );
}
