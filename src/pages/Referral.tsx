import { motion } from "framer-motion";
import { Copy, Check, Users, Gift, TrendingUp } from "lucide-react";
import { useState } from "react";

const referrals = [
  { user: "john_d***", joined: "Jan 15, 2025", deposits: "$2,400", commission: "$24.00" },
  { user: "alice_m***", joined: "Jan 12, 2025", deposits: "$5,000", commission: "$50.00" },
  { user: "bob_s***", joined: "Jan 8, 2025", deposits: "$1,000", commission: "$10.00" },
  { user: "eve_w***", joined: "Dec 28, 2024", deposits: "$3,600", commission: "$36.00" },
];

export default function Referral() {
  const [copied, setCopied] = useState(false);
  const code = "ARBAI-X7K9M2";

  const handleCopy = () => {
    navigator.clipboard.writeText(`https://arbai.com/ref/${code}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <h1 className="font-display font-bold text-2xl">Referral Program</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="metric-card">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Total Referrals</span>
            <Users className="w-4 h-4 text-muted-foreground" />
          </div>
          <span className="text-2xl font-display font-bold">4</span>
        </div>
        <div className="metric-card">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Total Earnings</span>
            <Gift className="w-4 h-4 text-muted-foreground" />
          </div>
          <span className="text-2xl font-display font-bold text-success">$120.00</span>
        </div>
        <div className="metric-card">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Commission Rate</span>
            <TrendingUp className="w-4 h-4 text-muted-foreground" />
          </div>
          <span className="text-2xl font-display font-bold">1%</span>
        </div>
      </div>

      {/* Referral Link */}
      <div className="glass-card p-5 space-y-3">
        <p className="font-display font-semibold text-sm">Your Referral Link</p>
        <div className="flex items-center gap-2">
          <code className="flex-1 bg-secondary/50 px-3 py-2.5 rounded-lg text-sm font-mono text-foreground truncate">
            https://arbai.com/ref/{code}
          </code>
          <button
            onClick={handleCopy}
            className="px-4 py-2.5 rounded-lg text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors flex items-center gap-2"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
      </div>

      {/* Referral Table */}
      <div className="glass-card overflow-hidden">
        <div className="px-4 py-3 border-b border-border/30">
          <h3 className="font-display font-semibold text-sm">Referral History</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/30">
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">User</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Joined</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Deposits</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Commission</th>
              </tr>
            </thead>
            <tbody>
              {referrals.map((r, i) => (
                <tr key={i} className="border-b border-border/10 hover:bg-secondary/30 transition-colors">
                  <td className="px-4 py-3 font-medium">{r.user}</td>
                  <td className="px-4 py-3 text-muted-foreground">{r.joined}</td>
                  <td className="px-4 py-3">{r.deposits}</td>
                  <td className="px-4 py-3 text-success font-semibold">{r.commission}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}
