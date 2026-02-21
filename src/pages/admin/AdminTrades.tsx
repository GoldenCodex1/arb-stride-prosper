import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export default function AdminTrades() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: "", roi_percent: "", duration_hours: "", min_investment: "", max_investment: "",
    risk_level: "Low", slot_limit: "20", status: "draft",
  });

  const { data: trades } = useQuery({
    queryKey: ["admin-trades"],
    queryFn: async () => {
      const { data } = await supabase.from("trades").select("*").order("created_at", { ascending: false });
      return data ?? [];
    },
  });

  const handleCreate = async () => {
    const { error } = await supabase.from("trades").insert({
      title: form.title,
      roi_percent: Number(form.roi_percent),
      duration_hours: Number(form.duration_hours),
      min_investment: Number(form.min_investment),
      max_investment: Number(form.max_investment),
      risk_level: form.risk_level,
      slot_limit: Number(form.slot_limit),
      status: form.status,
    });
    if (error) toast.error(error.message);
    else {
      toast.success("Trade created");
      setShowForm(false);
      setForm({ title: "", roi_percent: "", duration_hours: "", min_investment: "", max_investment: "", risk_level: "Low", slot_limit: "20", status: "draft" });
      queryClient.invalidateQueries({ queryKey: ["admin-trades"] });
    }
  };

  const toggleStatus = async (id: string, current: string) => {
    const next = current === "active" ? "draft" : "active";
    const { error } = await supabase.from("trades").update({ status: next }).eq("id", id);
    if (error) toast.error(error.message);
    else {
      toast.success(`Trade ${next}`);
      queryClient.invalidateQueries({ queryKey: ["admin-trades"] });
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <h1 className="font-display font-bold text-xl sm:text-2xl">Trade Opportunities</h1>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
          <Plus className="w-4 h-4" /> Create Trade
        </button>
      </div>

      {showForm && (
        <div className="glass-card p-5 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="bg-secondary border border-border/30 rounded-lg px-3 py-2 text-sm text-foreground" />
            <input placeholder="ROI %" type="number" value={form.roi_percent} onChange={(e) => setForm({ ...form, roi_percent: e.target.value })} className="bg-secondary border border-border/30 rounded-lg px-3 py-2 text-sm text-foreground" />
            <input placeholder="Duration (hours)" type="number" value={form.duration_hours} onChange={(e) => setForm({ ...form, duration_hours: e.target.value })} className="bg-secondary border border-border/30 rounded-lg px-3 py-2 text-sm text-foreground" />
            <input placeholder="Min Investment" type="number" value={form.min_investment} onChange={(e) => setForm({ ...form, min_investment: e.target.value })} className="bg-secondary border border-border/30 rounded-lg px-3 py-2 text-sm text-foreground" />
            <input placeholder="Max Investment" type="number" value={form.max_investment} onChange={(e) => setForm({ ...form, max_investment: e.target.value })} className="bg-secondary border border-border/30 rounded-lg px-3 py-2 text-sm text-foreground" />
            <select value={form.risk_level} onChange={(e) => setForm({ ...form, risk_level: e.target.value })} className="bg-secondary border border-border/30 rounded-lg px-3 py-2 text-sm text-foreground">
              <option>Low</option><option>Medium</option><option>High</option>
            </select>
            <input placeholder="Slot Limit" type="number" value={form.slot_limit} onChange={(e) => setForm({ ...form, slot_limit: e.target.value })} className="bg-secondary border border-border/30 rounded-lg px-3 py-2 text-sm text-foreground" />
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="bg-secondary border border-border/30 rounded-lg px-3 py-2 text-sm text-foreground">
              <option value="draft">Draft</option><option value="active">Active</option>
            </select>
          </div>
          <button onClick={handleCreate} className="px-6 py-2 rounded-lg text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">Save</button>
        </div>
      )}

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/30">
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Title</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">ROI</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Duration</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Range</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Risk</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Slots</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Status</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {trades?.map((t) => (
                <tr key={t.id} className="border-b border-border/10 hover:bg-secondary/30 transition-colors">
                  <td className="px-4 py-3 font-display font-medium">{t.title}</td>
                  <td className="px-4 py-3 text-success font-semibold">{Number(t.roi_percent)}%</td>
                  <td className="px-4 py-3">{Number(t.duration_hours)}h</td>
                  <td className="px-4 py-3 text-muted-foreground">${Number(t.min_investment)} – ${Number(t.max_investment).toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <span className={t.risk_level === "Low" ? "status-badge-success" : t.risk_level === "Medium" ? "status-badge-warning" : "status-badge-danger"}>{t.risk_level}</span>
                  </td>
                  <td className="px-4 py-3">{t.slots_filled}/{t.slot_limit}</td>
                  <td className="px-4 py-3">
                    <span className={t.status === "active" ? "status-badge-success" : "status-badge-pending"}>{t.status}</span>
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => toggleStatus(t.id, t.status)} className="text-xs text-primary hover:underline">
                      {t.status === "active" ? "Deactivate" : "Activate"}
                    </button>
                  </td>
                </tr>
              ))}
              {(!trades || trades.length === 0) && (
                <tr><td colSpan={8} className="px-4 py-8 text-center text-muted-foreground">No trades yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}
