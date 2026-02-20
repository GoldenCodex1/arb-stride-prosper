import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { User, Mail, Shield, Key, Smartphone } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

export default function Profile() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [fullName, setFullName] = useState("");
  const [saving, setSaving] = useState(false);

  const { data: profile } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      const { data } = await supabase.from("profiles").select("*").eq("user_id", user!.id).maybeSingle();
      return data;
    },
    enabled: !!user,
  });

  const { data: kyc } = useQuery({
    queryKey: ["kyc", user?.id],
    queryFn: async () => {
      const { data } = await supabase.from("kyc").select("*").eq("user_id", user!.id).order("submitted_at", { ascending: false }).limit(1).maybeSingle();
      return data;
    },
    enabled: !!user,
  });

  useEffect(() => {
    if (profile?.full_name) setFullName(profile.full_name);
  }, [profile]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase.from("profiles").update({ full_name: fullName }).eq("user_id", user.id);
    setSaving(false);
    if (error) toast.error(error.message);
    else {
      toast.success("Profile updated");
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    }
  };

  const kycStatus = kyc?.status ?? profile?.kyc_status ?? "pending";
  const kycBadge = kycStatus === "approved" ? "status-badge-success" : kycStatus === "rejected" ? "status-badge-danger" : "status-badge-warning";

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto space-y-6">
      <h1 className="font-display font-bold text-2xl">Profile</h1>

      <div className="glass-card p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-primary/20 border-2 border-primary/30 flex items-center justify-center">
            <User className="w-8 h-8 text-primary" />
          </div>
          <div>
            <p className="font-display font-bold text-lg">{profile?.full_name || "User"}</p>
            <p className="text-sm text-muted-foreground">
              Member {profile ? formatDistanceToNow(new Date(profile.created_at), { addSuffix: false }) : ""}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs text-muted-foreground mb-1.5 block">Full Name</label>
            <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full bg-secondary border border-border/30 rounded-lg px-3 py-2.5 text-sm text-foreground" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1.5 block">Email</label>
            <div className="flex items-center gap-2">
              <input type="email" value={user?.email ?? ""} readOnly className="flex-1 bg-secondary border border-border/30 rounded-lg px-3 py-2.5 text-sm text-foreground opacity-70" />
              <span className="status-badge-success"><Mail className="w-3 h-3" /> Verified</span>
            </div>
          </div>
          <button onClick={handleSave} disabled={saving} className="px-6 py-2.5 rounded-lg font-semibold text-sm bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50">
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      <div className="glass-card p-6 space-y-4">
        <h3 className="font-display font-semibold flex items-center gap-2">
          <Shield className="w-4 h-4 text-primary" /> Security
        </h3>
        <div className="flex items-center justify-between py-3 border-b border-border/10">
          <div className="flex items-center gap-3">
            <Key className="w-4 h-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Password</p>
              <p className="text-xs text-muted-foreground">Managed via email</p>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between py-3">
          <div className="flex items-center gap-3">
            <Smartphone className="w-4 h-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Two-Factor Authentication</p>
              <p className="text-xs text-muted-foreground">{profile?.two_factor_enabled ? "Enabled" : "Not enabled"}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="glass-card p-6">
        <h3 className="font-display font-semibold mb-3">KYC Verification</h3>
        <div className="flex items-center gap-3">
          <span className={kycBadge}>{kycStatus}</span>
          <p className="text-sm text-muted-foreground">
            {kycStatus === "approved" ? "Your identity is verified." : "Submit your documents to increase limits."}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
