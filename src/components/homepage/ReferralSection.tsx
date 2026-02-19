import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Gift, Users, Copy, BarChart3 } from "lucide-react";

const benefits = [
  { icon: Gift, title: "Earn Commissions", desc: "Get a percentage of every trade your referrals make." },
  { icon: Users, title: "Passive Bonus Rewards", desc: "Unlock tier bonuses as your network grows." },
  { icon: Copy, title: "Easy Sharing", desc: "Copy your unique referral link and share it anywhere." },
  { icon: BarChart3, title: "Real-Time Tracking", desc: "Monitor your referral earnings live from your dashboard." },
];

export default function ReferralSection() {
  return (
    <section className="py-20 md:py-28 bg-secondary/30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 grid lg:grid-cols-2 gap-16 items-center">
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4">
            Referral <span className="gradient-text">Program</span>
          </h2>
          <p className="text-muted-foreground mb-8">Invite friends and earn passive income. Our multi-tier referral system rewards you for growing the community.</p>
          <div className="grid sm:grid-cols-2 gap-4 mb-8">
            {benefits.map((b) => (
              <div key={b.title} className="flex gap-3 items-start">
                <b.icon className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-display font-semibold text-sm">{b.title}</h3>
                  <p className="text-xs text-muted-foreground">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <Button asChild className="rounded-2xl px-8">
            <Link to="/auth">Start Earning</Link>
          </Button>
        </motion.div>

        {/* Referral tree visual */}
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="hidden lg:flex justify-center">
          <div className="glass-card p-8 w-full max-w-sm space-y-4">
            <p className="text-sm font-medium text-center text-muted-foreground">Your Referral Network</p>
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center text-sm font-bold">You</div>
              <div className="w-px h-6 bg-border" />
              <div className="flex gap-6">
                {["A", "B", "C"].map((l) => (
                  <div key={l} className="flex flex-col items-center gap-2">
                    <div className="w-9 h-9 rounded-full bg-secondary border border-border flex items-center justify-center text-xs font-semibold">{l}</div>
                    <div className="flex gap-2">
                      {[1, 2].map((n) => (
                        <div key={n} className="w-6 h-6 rounded-full bg-muted border border-border/50 flex items-center justify-center text-[9px] text-muted-foreground">{l}{n}</div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <p className="text-xs text-center text-muted-foreground mt-4">Commission earned: <span className="text-success font-semibold">$1,247.50</span></p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
