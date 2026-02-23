import { motion } from "framer-motion";
import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export default function AdminWallets() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ currency: "USDT", network: "TRC20", address: "", min_deposit: "10" });

  const { data: wallets } = useQuery({
    queryKey: ["admin-wallets"],
    queryFn: async () => {
      const { data } = await supabase.from("wallets").select("*").order("created_at", { ascending: false });
      return data ?? [];
    },
  });

  const handleCreate = async () => {
    if (!form.address) { toast.error("Address is required"); return; }
    const { error } = await supabase.from("wallets").insert({
      currency: form.currency,
      network: form.network,
      address: form.address,
      min_deposit: Number(form.min_deposit),
    });
    if (error) toast.error(error.message);
    else {
      toast.success("Wallet added");
      setShowForm(false);
      setForm({ currency: "USDT", network: "TRC20", address: "", min_deposit: "10" });
      queryClient.invalidateQueries({ queryKey: ["admin-wallets"] });
    }
  };

  const toggleActive = async (id: string, current: boolean) => {
    const { error } = await supabase.from("wallets").update({ is_active: !current }).eq("id", id);
    if (error) toast.error(error.message);
    else {
      toast.success(current ? "Wallet deactivated" : "Wallet activated");
      queryClient.invalidateQueries({ queryKey: ["admin-wallets"] });
    }
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("wallets").delete().eq("id", id);
    if (error) toast.error(error.message);
    else {
      toast.success("Wallet deleted");
      queryClient.invalidateQueries({ queryKey: ["admin-wallets"] });
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <h1 className="font-display font-bold text-xl sm:text-2xl">Wallet Settings</h1>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
          <Plus className="w-4 h-4" /> Add Wallet
        </button>
      </div>

      {showForm && (
        <div className="glass-card p-5 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <select value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value })} className="bg-secondary border border-border/30 rounded-lg px-3 py-2 text-sm text-foreground">
              <option>USDT</option><option>BTC</option><option>ETH</option><option>BNB</option>
            </select>
            <select value={form.network} onChange={(e) => setForm({ ...form, network: e.target.value })} className="bg-secondary border border-border/30 rounded-lg px-3 py-2 text-sm text-foreground">
              <option>TRC20</option><option>ERC20</option><option>BEP20</option><option>Bitcoin</option><option>Ethereum</option>
            </select>
            <input placeholder="Wallet Address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="bg-secondary border border-border/30 rounded-lg px-3 py-2 text-sm text-foreground sm:col-span-2" />
            <input placeholder="Min Deposit" type="number" value={form.min_deposit} onChange={(e) => setForm({ ...form, min_deposit: e.target.value })} className="bg-secondary border border-border/30 rounded-lg px-3 py-2 text-sm text-foreground" />
          </div>
          <button onClick={handleCreate} className="px-6 py-2 rounded-lg text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">Save</button>
        </div>
      )}

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/30">
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Currency</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Network</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Address</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Min Deposit</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Status</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {wallets?.map((w) => (
                <tr key={w.id} className="border-b border-border/10 hover:bg-secondary/30 transition-colors">
                  <td className="px-4 py-3 font-medium">{w.currency}</td>
                  <td className="px-4 py-3">{w.network}</td>
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{w.address.slice(0, 20)}...</td>
                  <td className="px-4 py-3">${w.min_deposit}</td>
                  <td className="px-4 py-3">
                    <span className={w.is_active ? "status-badge-success" : "status-badge-danger"}>{w.is_active ? "Active" : "Inactive"}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => toggleActive(w.id, w.is_active)} className="text-xs text-primary hover:underline">
                        {w.is_active ? "Deactivate" : "Activate"}
                      </button>
                      <button onClick={() => handleDelete(w.id)} className="text-xs text-destructive hover:underline flex items-center gap-1">
                        <Trash2 className="w-3 h-3" /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {(!wallets || wallets.length === 0) && (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">No wallets configured.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}
