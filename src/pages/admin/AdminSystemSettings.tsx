import { motion } from "framer-motion";
import { Save } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useState, useEffect } from "react";

export default function AdminSystemSettings() {
  const queryClient = useQueryClient();

  const { data: stats } = useQuery({
    queryKey: ["admin-platform-stats"],
    queryFn: async () => {
      const { data } = await supabase.from("platform_stats").select("*").order("key");
      return data ?? [];
    },
  });

  const [editValues, setEditValues] = useState<Record<string, string>>({});

  useEffect(() => {
    if (stats) {
      const values: Record<string, string> = {};
      stats.forEach((s) => { values[s.id] = s.value; });
      setEditValues(values);
    }
  }, [stats]);

  const handleSave = async (id: string) => {
    const { error } = await supabase.from("platform_stats").update({ value: editValues[id] }).eq("id", id);
    if (error) toast.error(error.message);
    else {
      toast.success("Stat updated");
      queryClient.invalidateQueries({ queryKey: ["admin-platform-stats"] });
    }
  };

  const toggleAutoCalc = async (id: string, current: boolean) => {
    const { error } = await supabase.from("platform_stats").update({ auto_calculate: !current }).eq("id", id);
    if (error) toast.error(error.message);
    else {
      toast.success(current ? "Manual mode" : "Auto-calculate enabled");
      queryClient.invalidateQueries({ queryKey: ["admin-platform-stats"] });
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <h1 className="font-display font-bold text-xl sm:text-2xl">System Settings</h1>

      <div className="space-y-4">
        <h2 className="font-display font-semibold text-lg">Platform Statistics</h2>
        <p className="text-sm text-muted-foreground">These values are displayed on the homepage. Toggle auto-calculate to pull live data or set manually.</p>

        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/30">
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Key</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Label</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Value</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Auto</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {stats?.map((s) => (
                  <tr key={s.id} className="border-b border-border/10 hover:bg-secondary/30 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs">{s.key}</td>
                    <td className="px-4 py-3 font-medium">{s.label}</td>
                    <td className="px-4 py-3">
                      <input
                        value={editValues[s.id] ?? s.value}
                        onChange={(e) => setEditValues({ ...editValues, [s.id]: e.target.value })}
                        disabled={s.auto_calculate}
                        className="bg-secondary border border-border/30 rounded px-2 py-1 text-xs w-32 text-foreground disabled:opacity-50"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => toggleAutoCalc(s.id, s.auto_calculate)}
                        className={`px-2 py-1 rounded text-xs font-medium transition-colors ${s.auto_calculate ? "bg-success/15 text-success" : "bg-secondary text-muted-foreground"}`}
                      >
                        {s.auto_calculate ? "Auto" : "Manual"}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      {!s.auto_calculate && (
                        <button onClick={() => handleSave(s.id)} className="text-xs text-primary hover:underline flex items-center gap-1">
                          <Save className="w-3 h-3" /> Save
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {(!stats || stats.length === 0) && (
                  <tr><td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">No platform stats configured.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
