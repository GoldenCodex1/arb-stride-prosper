import { motion } from "framer-motion";
import { Plus, Save, Trash2 } from "lucide-react";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export default function AdminApiSettings() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ key: "", value: "" });
  const [editId, setEditId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  const { data: settings } = useQuery({
    queryKey: ["admin-api-settings"],
    queryFn: async () => {
      const { data } = await supabase.from("api_settings").select("*").order("key");
      return data ?? [];
    },
  });

  const handleCreate = async () => {
    if (!form.key) { toast.error("Key is required"); return; }
    const { error } = await supabase.from("api_settings").insert({ key: form.key, value: form.value });
    if (error) toast.error(error.message);
    else {
      toast.success("Setting added");
      setShowForm(false);
      setForm({ key: "", value: "" });
      queryClient.invalidateQueries({ queryKey: ["admin-api-settings"] });
    }
  };

  const handleUpdate = async (id: string) => {
    const { error } = await supabase.from("api_settings").update({ value: editValue }).eq("id", id);
    if (error) toast.error(error.message);
    else {
      toast.success("Setting updated");
      setEditId(null);
      queryClient.invalidateQueries({ queryKey: ["admin-api-settings"] });
    }
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("api_settings").delete().eq("id", id);
    if (error) toast.error(error.message);
    else {
      toast.success("Setting deleted");
      queryClient.invalidateQueries({ queryKey: ["admin-api-settings"] });
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <h1 className="font-display font-bold text-xl sm:text-2xl">API Settings</h1>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
          <Plus className="w-4 h-4" /> Add Setting
        </button>
      </div>

      {showForm && (
        <div className="glass-card p-5 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input placeholder="Key (e.g. NOWPAYMENTS_API_KEY)" value={form.key} onChange={(e) => setForm({ ...form, key: e.target.value })} className="bg-secondary border border-border/30 rounded-lg px-3 py-2 text-sm text-foreground" />
            <input placeholder="Value" value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })} className="bg-secondary border border-border/30 rounded-lg px-3 py-2 text-sm text-foreground" />
          </div>
          <button onClick={handleCreate} className="px-6 py-2 rounded-lg text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">Save</button>
        </div>
      )}

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/30">
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Key</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Value</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Updated</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {settings?.map((s) => (
                <tr key={s.id} className="border-b border-border/10 hover:bg-secondary/30 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs font-medium">{s.key}</td>
                  <td className="px-4 py-3">
                    {editId === s.id ? (
                      <input value={editValue} onChange={(e) => setEditValue(e.target.value)} className="bg-secondary border border-border/30 rounded px-2 py-1 text-xs w-full text-foreground" />
                    ) : (
                      <span className="font-mono text-xs text-muted-foreground">{"•".repeat(Math.min(s.value.length, 20))}</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground text-xs">{new Date(s.updated_at).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      {editId === s.id ? (
                        <button onClick={() => handleUpdate(s.id)} className="text-xs text-success hover:underline flex items-center gap-1"><Save className="w-3 h-3" /> Save</button>
                      ) : (
                        <button onClick={() => { setEditId(s.id); setEditValue(s.value); }} className="text-xs text-primary hover:underline">Edit</button>
                      )}
                      <button onClick={() => handleDelete(s.id)} className="text-xs text-destructive hover:underline flex items-center gap-1"><Trash2 className="w-3 h-3" /> Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
              {(!settings || settings.length === 0) && (
                <tr><td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">No API settings configured.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}
