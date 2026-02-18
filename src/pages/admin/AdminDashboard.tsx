import { motion } from "framer-motion";
import {
  Users,
  ShieldCheck,
  AlertTriangle,
  Wallet,
  ArrowUpFromLine,
  DollarSign,
  ArrowDownToLine,
  Clock,
} from "lucide-react";
import MetricCard from "@/components/dashboard/MetricCard";

const depositQueue = [
  { user: "john_d***", amount: "$2,000", txHash: "0x8f3a...b2c1", time: "5 mins ago", status: "Pending" },
  { user: "alice_m***", amount: "$5,000", txHash: "TXq7x...4nE6", time: "12 mins ago", status: "Pending" },
  { user: "bob_s***", amount: "$1,000", txHash: "0xc4e2...9f1d", time: "30 mins ago", status: "Verified" },
];

const withdrawalQueue = [
  { user: "eve_w***", amount: "$800", currency: "USDT", time: "10 mins ago", status: "Pending" },
  { user: "john_d***", amount: "$500", currency: "BTC", time: "1 hour ago", status: "Pending" },
];

export default function AdminDashboard() {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <h1 className="font-display font-bold text-2xl">Admin Dashboard</h1>

      {/* Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <MetricCard label="Total Users" value="1,284" icon={Users} trend="+42 this week" positive />
        <MetricCard label="KYC Pending" value="23" icon={ShieldCheck} />
        <MetricCard label="Red Flags" value="3" icon={AlertTriangle} />
        <MetricCard label="Platform Balance" value="$842,500" icon={Wallet} trend="+15.2%" positive />
        <MetricCard label="Pending Withdrawals" value="$12,400" icon={ArrowUpFromLine} />
        <MetricCard label="Profit Distributed" value="$156,300" icon={DollarSign} trend="+8.5%" positive />
        <MetricCard label="Deposit Queue" value="3" icon={ArrowDownToLine} />
        <MetricCard label="Withdrawal Queue" value="2" icon={Clock} />
      </div>

      {/* Manual Deposit Queue */}
      <div>
        <h2 className="font-display font-semibold text-lg mb-3">Manual Deposit Queue</h2>
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/30">
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">User</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Amount</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">TX Hash</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Time</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Status</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {depositQueue.map((d, i) => (
                  <tr key={i} className="border-b border-border/10 hover:bg-secondary/30 transition-colors">
                    <td className="px-4 py-3 font-medium">{d.user}</td>
                    <td className="px-4 py-3">{d.amount}</td>
                    <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{d.txHash}</td>
                    <td className="px-4 py-3 text-muted-foreground">{d.time}</td>
                    <td className="px-4 py-3">
                      <span className={d.status === "Verified" ? "status-badge-success" : "status-badge-warning"}>
                        {d.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button className="px-3 py-1 rounded text-xs font-medium bg-success/15 text-success hover:bg-success/25 transition-colors">
                          Approve
                        </button>
                        <button className="px-3 py-1 rounded text-xs font-medium bg-destructive/15 text-destructive hover:bg-destructive/25 transition-colors">
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Withdrawal Queue */}
      <div>
        <h2 className="font-display font-semibold text-lg mb-3">Withdrawal Queue</h2>
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/30">
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">User</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Amount</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Currency</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Time</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {withdrawalQueue.map((w, i) => (
                  <tr key={i} className="border-b border-border/10 hover:bg-secondary/30 transition-colors">
                    <td className="px-4 py-3 font-medium">{w.user}</td>
                    <td className="px-4 py-3">{w.amount}</td>
                    <td className="px-4 py-3">{w.currency}</td>
                    <td className="px-4 py-3 text-muted-foreground">{w.time}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button className="px-3 py-1 rounded text-xs font-medium bg-success/15 text-success hover:bg-success/25 transition-colors">
                          Approve
                        </button>
                        <button className="px-3 py-1 rounded text-xs font-medium bg-destructive/15 text-destructive hover:bg-destructive/25 transition-colors">
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
