import { motion } from "framer-motion";
import { User, Mail, Shield, Key, Smartphone } from "lucide-react";

export default function Profile() {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto space-y-6">
      <h1 className="font-display font-bold text-2xl">Profile</h1>

      {/* Profile Card */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-primary/20 border-2 border-primary/30 flex items-center justify-center">
            <User className="w-8 h-8 text-primary" />
          </div>
          <div>
            <p className="font-display font-bold text-lg">John Doe</p>
            <p className="text-sm text-muted-foreground">Member since Jan 2025</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs text-muted-foreground mb-1.5 block">Full Name</label>
            <input
              type="text"
              defaultValue="John Doe"
              className="w-full bg-secondary border border-border/30 rounded-lg px-3 py-2.5 text-sm text-foreground"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1.5 block">Email</label>
            <div className="flex items-center gap-2">
              <input
                type="email"
                defaultValue="john@example.com"
                className="flex-1 bg-secondary border border-border/30 rounded-lg px-3 py-2.5 text-sm text-foreground"
              />
              <span className="status-badge-success"><Mail className="w-3 h-3" /> Verified</span>
            </div>
          </div>
          <button className="px-6 py-2.5 rounded-lg font-semibold text-sm bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
            Save Changes
          </button>
        </div>
      </div>

      {/* Security */}
      <div className="glass-card p-6 space-y-4">
        <h3 className="font-display font-semibold flex items-center gap-2">
          <Shield className="w-4 h-4 text-primary" /> Security
        </h3>
        <div className="flex items-center justify-between py-3 border-b border-border/10">
          <div className="flex items-center gap-3">
            <Key className="w-4 h-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Password</p>
              <p className="text-xs text-muted-foreground">Last changed 30 days ago</p>
            </div>
          </div>
          <button className="text-xs font-medium text-primary hover:underline">Change</button>
        </div>
        <div className="flex items-center justify-between py-3">
          <div className="flex items-center gap-3">
            <Smartphone className="w-4 h-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Two-Factor Authentication</p>
              <p className="text-xs text-muted-foreground">Not enabled</p>
            </div>
          </div>
          <button className="text-xs font-medium text-primary hover:underline">Enable</button>
        </div>
      </div>

      {/* KYC */}
      <div className="glass-card p-6">
        <h3 className="font-display font-semibold mb-3">KYC Verification</h3>
        <div className="flex items-center gap-3">
          <span className="status-badge-warning">Pending</span>
          <p className="text-sm text-muted-foreground">Submit your documents to increase limits.</p>
        </div>
        <button className="mt-4 px-6 py-2.5 rounded-lg font-semibold text-sm bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors">
          Start Verification
        </button>
      </div>
    </motion.div>
  );
}
