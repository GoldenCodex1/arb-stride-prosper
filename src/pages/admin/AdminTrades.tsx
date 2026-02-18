import { motion } from "framer-motion";
import { Plus, TrendingUp } from "lucide-react";
import { useState } from "react";

const trades = [
  { id: 1, title: "BTC/USDT Spread", roi: 4.2, duration: "2h", min: 100, max: 5000, risk: "Low", slots: 12, status: "Active" },
  { id: 2, title: "ETH Triangle Arb", roi: 6.8, duration: "4h", min: 250, max: 10000, risk: "Medium", slots: 5, status: "Active" },
  { id: 3, title: "SOL/BNB Cross-DEX", roi: 3.1, duration: "1h", min: 50, max: 2000, risk: "Low", slots: 20, status: "Draft" },
  { id: 4, title: "MATIC Flash Loan", roi: 8.5, duration: "6h", min: 500, max: 20000, risk: "High", slots: 3, status: "Active" },
];

export default function AdminTrades() {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display font-bold text-2xl">Trade Opportunities</h1>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
          <Plus className="w-4 h-4" /> Create Trade
        </button>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/30">
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Title</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">ROI</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Duration</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Range</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Risk</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Slots</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Status</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {trades.map((t) => (
                <tr key={t.id} className="border-b border-border/10 hover:bg-secondary/30 transition-colors">
                  <td className="px-4 py-3 font-display font-medium">{t.title}</td>
                  <td className="px-4 py-3 text-success font-semibold">{t.roi}%</td>
                  <td className="px-4 py-3">{t.duration}</td>
                  <td className="px-4 py-3 text-muted-foreground">${t.min} – ${t.max.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <span className={t.risk === "Low" ? "status-badge-success" : t.risk === "Medium" ? "status-badge-warning" : "status-badge-danger"}>
                      {t.risk}
                    </span>
                  </td>
                  <td className="px-4 py-3">{t.slots}</td>
                  <td className="px-4 py-3">
                    <span className={t.status === "Active" ? "status-badge-success" : "status-badge-pending"}>
                      {t.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button className="text-xs text-primary hover:underline">Edit</button>
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
