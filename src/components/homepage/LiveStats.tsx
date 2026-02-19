import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Users, DollarSign, TrendingUp, CheckCircle } from "lucide-react";

const iconMap: Record<string, React.ElementType> = {
  total_users: Users,
  total_profit_paid: DollarSign,
  active_trades: TrendingUp,
  success_rate: CheckCircle,
};

interface Stat {
  key: string;
  value: string;
  label: string;
}

export default function LiveStats() {
  const [stats, setStats] = useState<Stat[]>([]);

  useEffect(() => {
    supabase
      .from("platform_stats")
      .select("key, value, label")
      .then(({ data }) => {
        if (data) setStats(data);
      });
  }, []);

  return (
    <section className="py-20 md:py-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4">Platform Performance</h2>
          <p className="text-muted-foreground">Real-time stats powered by live data.</p>
        </motion.div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => {
            const Icon = iconMap[stat.key] || TrendingUp;
            return (
              <motion.div
                key={stat.key}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-6 text-center"
              >
                <Icon className="w-6 h-6 text-primary mx-auto mb-3" />
                <p className="font-display text-2xl sm:text-3xl font-bold mb-1">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
