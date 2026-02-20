import { motion } from "framer-motion";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export default function AdminUsers() {
  const queryClient = useQueryClient();

  const { data: profiles } = useQuery({
    queryKey: ["admin-profiles"],
    queryFn: async () => {
      const { data } = await supabase.from("profiles").select("*").order("created_at", { ascending: false });
      return data ?? [];
    },
  });

  const toggleFreeze = async (userId: string, current: boolean) => {
    const { error } = await supabase.from("profiles").update({ is_frozen: !current }).eq("user_id", userId);
    if (error) toast.error(error.message);
    else {
      toast.success(current ? "User unfrozen" : "User frozen");
      queryClient.invalidateQueries({ queryKey: ["admin-profiles"] });
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <h1 className="font-display font-bold text-2xl">Users</h1>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/30">
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Name</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">User ID</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">KYC</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Status</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {profiles?.map((p) => (
                <tr key={p.id} className="border-b border-border/10 hover:bg-secondary/30 transition-colors">
                  <td className="px-4 py-3 font-medium">{p.full_name || "—"}</td>
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{p.user_id.slice(0, 12)}...</td>
                  <td className="px-4 py-3">
                    <span className={
                      p.kyc_status === "approved" ? "status-badge-success" :
                      p.kyc_status === "pending" ? "status-badge-warning" : "status-badge-danger"
                    }>{p.kyc_status}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={p.is_frozen ? "status-badge-danger" : "status-badge-success"}>
                      {p.is_frozen ? "Frozen" : "Active"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => toggleFreeze(p.user_id, p.is_frozen)}
                      className={`text-xs font-medium hover:underline ${p.is_frozen ? "text-success" : "text-destructive"}`}
                    >
                      {p.is_frozen ? "Unfreeze" : "Freeze"}
                    </button>
                  </td>
                </tr>
              ))}
              {(!profiles || profiles.length === 0) && (
                <tr><td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">No users found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}
