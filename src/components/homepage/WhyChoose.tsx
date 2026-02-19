import { motion } from "framer-motion";
import { Layers, Bot, ShieldCheck, CheckCircle, Zap } from "lucide-react";

const features = [
  { icon: Layers, title: "Hybrid Deposit System", desc: "Support for both cryptocurrency deposits and manual bank transfer approvals." },
  { icon: Bot, title: "Auto Bot Trading Engine", desc: "AI-driven automated trading that works 24/7 without manual intervention." },
  { icon: ShieldCheck, title: "Admin Risk Control Layer", desc: "Multi-level admin oversight ensures platform-wide risk management." },
  { icon: CheckCircle, title: "Secure Verification", desc: "KYC verification and 2FA authentication to protect every account." },
  { icon: Zap, title: "Fast Withdrawals", desc: "Streamlined withdrawal process with admin approval within 24 hours." },
];

export default function WhyChoose() {
  return (
    <section className="py-20 md:py-28 bg-secondary/30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4">Why Choose ArbAI</h2>
          <p className="text-muted-foreground max-w-lg mx-auto">Built for serious investors who value security, automation, and transparency.</p>
        </motion.div>
        <div className="grid md:grid-cols-2 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="glass-card-hover p-6 flex gap-4 items-start"
            >
              <div className="w-10 h-10 shrink-0 rounded-xl bg-primary/10 flex items-center justify-center">
                <f.icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-display font-semibold mb-1">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
