import { useState } from "react";
import { motion } from "framer-motion";
import { Zap, Wallet, Copy, Upload, Check, QrCode, ChevronDown, ChevronUp } from "lucide-react";

export default function Deposit() {
  const [expandedMethod, setExpandedMethod] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const toggle = (method: string) => setExpandedMethod(expandedMethod === method ? null : method);

  const handleCopy = () => {
    navigator.clipboard.writeText("TXqR7xKdh8F3bN9v2cYpLwMz5sJg4nE6tU");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto space-y-4">
      <h1 className="font-display font-bold text-2xl">Deposit Funds</h1>
      <p className="text-sm text-muted-foreground">Choose a deposit method below.</p>

      {/* Method 1 — NowPayments */}
      <div className="glass-card overflow-hidden">
        <button
          onClick={() => toggle("auto")}
          className="w-full flex items-center justify-between p-5 hover:bg-secondary/20 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/15 flex items-center justify-center">
              <Zap className="w-5 h-5 text-primary" />
            </div>
            <div className="text-left">
              <p className="font-display font-semibold text-sm">Automatic Deposit</p>
              <p className="text-xs text-muted-foreground">Via NowPayments — instant credit</p>
            </div>
          </div>
          {expandedMethod === "auto" ? <ChevronUp className="w-5 h-5 text-muted-foreground" /> : <ChevronDown className="w-5 h-5 text-muted-foreground" />}
        </button>

        {expandedMethod === "auto" && (
          <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} className="border-t border-border/30 p-5 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-muted-foreground mb-1.5 block">Currency</label>
                <select className="w-full bg-secondary border border-border/30 rounded-lg px-3 py-2 text-sm text-foreground">
                  <option>BTC</option>
                  <option>ETH</option>
                  <option>USDT</option>
                  <option>BNB</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1.5 block">Network</label>
                <select className="w-full bg-secondary border border-border/30 rounded-lg px-3 py-2 text-sm text-foreground">
                  <option>Bitcoin</option>
                  <option>Ethereum</option>
                  <option>TRC20</option>
                  <option>BEP20</option>
                </select>
              </div>
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1.5 block">Amount (USD)</label>
              <input
                type="number"
                placeholder="100.00"
                className="w-full bg-secondary border border-border/30 rounded-lg px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground"
              />
            </div>
            <button className="w-full py-2.5 rounded-lg font-semibold text-sm bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
              Generate Invoice
            </button>
          </motion.div>
        )}
      </div>

      {/* Method 2 — Manual */}
      <div className="glass-card overflow-hidden">
        <button
          onClick={() => toggle("manual")}
          className="w-full flex items-center justify-between p-5 hover:bg-secondary/20 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-accent/15 flex items-center justify-center">
              <Wallet className="w-5 h-5 text-accent" />
            </div>
            <div className="text-left">
              <p className="font-display font-semibold text-sm">Manual Deposit</p>
              <p className="text-xs text-muted-foreground">Send crypto directly — admin verified</p>
            </div>
          </div>
          {expandedMethod === "manual" ? <ChevronUp className="w-5 h-5 text-muted-foreground" /> : <ChevronDown className="w-5 h-5 text-muted-foreground" />}
        </button>

        {expandedMethod === "manual" && (
          <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} className="border-t border-border/30 p-5 space-y-4">
            {/* Wallet Info */}
            <div className="bg-secondary/50 rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">USDT (TRC20)</span>
                <span className="status-badge-info text-[10px]">Active</span>
              </div>
              <div className="flex items-center gap-2">
                <code className="flex-1 text-xs bg-background/50 px-3 py-2 rounded-md font-mono text-foreground truncate">
                  TXqR7xKdh8F3bN9v2cYpLwMz5sJg4nE6tU
                </code>
                <button
                  onClick={handleCopy}
                  className="p-2 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
                >
                  {copied ? <Check className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4 text-muted-foreground" />}
                </button>
              </div>
              <div className="w-24 h-24 mx-auto bg-foreground/10 rounded-lg flex items-center justify-center">
                <QrCode className="w-16 h-16 text-muted-foreground/50" />
              </div>
            </div>

            {/* Submission Form */}
            <div className="space-y-3">
              <div>
                <label className="text-xs text-muted-foreground mb-1.5 block">Amount Sent</label>
                <input
                  type="number"
                  placeholder="500.00"
                  className="w-full bg-secondary border border-border/30 rounded-lg px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1.5 block">Transaction Hash</label>
                <input
                  type="text"
                  placeholder="0x..."
                  className="w-full bg-secondary border border-border/30 rounded-lg px-3 py-2.5 text-sm text-foreground font-mono placeholder:text-muted-foreground"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1.5 block">Screenshot (optional)</label>
                <div className="border-2 border-dashed border-border/30 rounded-lg p-6 text-center cursor-pointer hover:border-primary/30 transition-colors">
                  <Upload className="w-6 h-6 mx-auto text-muted-foreground mb-2" />
                  <p className="text-xs text-muted-foreground">Click or drag to upload</p>
                </div>
              </div>
              <button className="w-full py-2.5 rounded-lg font-semibold text-sm bg-accent text-accent-foreground hover:bg-accent/90 transition-colors">
                Submit for Verification
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
