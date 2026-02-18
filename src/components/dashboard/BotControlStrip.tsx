import { useState } from "react";
import { Bot, Power, ShieldAlert, TrendingUp, TrendingDown, BarChart3, Timer } from "lucide-react";

export default function BotControlStrip() {
  const [botOn, setBotOn] = useState(false);

  return (
    <div className="glass-card p-4">
      <div className="flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-8">
        {/* Left — Controls */}
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <Bot className="w-5 h-5 text-primary" />
            <span className="font-display font-semibold text-sm">Auto Bot</span>
          </div>

          <button
            onClick={() => setBotOn(!botOn)}
            className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${
              botOn ? "bg-success" : "bg-muted"
            }`}
          >
            <div
              className={`absolute top-0.5 w-5 h-5 rounded-full bg-foreground transition-transform duration-300 ${
                botOn ? "translate-x-6" : "translate-x-0.5"
              }`}
            />
          </button>

          <span className={`status-badge text-xs ${botOn ? "status-badge-success" : "status-badge-pending"}`}>
            <Power className="w-3 h-3" />
            {botOn ? "Active" : "Inactive"}
          </span>

          <span className="status-badge-info text-xs">
            <ShieldAlert className="w-3 h-3" />
            Moderate
          </span>
        </div>

        {/* Right — Stats */}
        <div className="flex items-center gap-6 flex-wrap ml-auto">
          <Stat icon={TrendingUp} label="Today's Profit" value="+$84.20" className="text-success" />
          <Stat icon={TrendingDown} label="Today's Loss" value="-$12.00" className="text-destructive" />
          <Stat icon={BarChart3} label="Trades Today" value="7" />
          <Stat icon={Timer} label="Daily Limit" value="15" />
        </div>
      </div>
    </div>
  );
}

function Stat({ icon: Icon, label, value, className = "" }: { icon: any; label: string; value: string; className?: string }) {
  return (
    <div className="flex items-center gap-2">
      <Icon className="w-4 h-4 text-muted-foreground" />
      <div className="flex flex-col">
        <span className="text-[10px] text-muted-foreground leading-tight">{label}</span>
        <span className={`text-sm font-semibold font-display ${className || "text-foreground"}`}>{value}</span>
      </div>
    </div>
  );
}
