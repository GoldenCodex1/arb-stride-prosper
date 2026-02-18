import { motion } from "framer-motion";
import { ArrowUpFromLine } from "lucide-react";

export default function Withdraw() {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto space-y-6">
      <h1 className="font-display font-bold text-2xl">Withdraw Funds</h1>
      <p className="text-sm text-muted-foreground">Submit a withdrawal request. Admin approval required.</p>

      <div className="glass-card p-6 space-y-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-lg bg-primary/15 flex items-center justify-center">
            <ArrowUpFromLine className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="font-display font-semibold text-sm">Available Balance</p>
            <p className="text-2xl font-display font-bold text-foreground">$24,580.00</p>
          </div>
        </div>

        <div className="glow-line" />

        <div>
          <label className="text-xs text-muted-foreground mb-1.5 block">Amount</label>
          <input
            type="number"
            placeholder="500.00"
            className="w-full bg-secondary border border-border/30 rounded-lg px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground"
          />
        </div>
        <div>
          <label className="text-xs text-muted-foreground mb-1.5 block">Currency</label>
          <select className="w-full bg-secondary border border-border/30 rounded-lg px-3 py-2 text-sm text-foreground">
            <option>USDT (TRC20)</option>
            <option>BTC</option>
            <option>ETH</option>
            <option>BNB (BEP20)</option>
          </select>
        </div>
        <div>
          <label className="text-xs text-muted-foreground mb-1.5 block">Wallet Address</label>
          <input
            type="text"
            placeholder="Enter your wallet address"
            className="w-full bg-secondary border border-border/30 rounded-lg px-3 py-2.5 text-sm text-foreground font-mono placeholder:text-muted-foreground"
          />
        </div>
        <button className="w-full py-2.5 rounded-lg font-semibold text-sm bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
          Submit Withdrawal Request
        </button>
      </div>

      {/* Recent Withdrawals */}
      <div className="glass-card overflow-hidden">
        <div className="px-4 py-3 border-b border-border/30">
          <h3 className="font-display font-semibold text-sm">Withdrawal History</h3>
        </div>
        <div className="divide-y divide-border/10">
          {[
            { amount: "$500.00", currency: "USDT", date: "Jan 15, 2025", status: "Completed" },
            { amount: "$1,200.00", currency: "BTC", date: "Jan 10, 2025", status: "Pending" },
            { amount: "$300.00", currency: "ETH", date: "Jan 5, 2025", status: "Completed" },
          ].map((w, i) => (
            <div key={i} className="flex items-center justify-between px-4 py-3">
              <div>
                <p className="text-sm font-medium">{w.amount} — {w.currency}</p>
                <p className="text-xs text-muted-foreground">{w.date}</p>
              </div>
              <span className={w.status === "Completed" ? "status-badge-success" : "status-badge-warning"}>
                {w.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
