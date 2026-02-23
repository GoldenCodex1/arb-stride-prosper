import { motion } from "framer-motion";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { useState } from "react";

export default function AdminWithdrawals() {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<"pending" | "approved" | "rejected" | "all">("pending");
  const [noteId, setNoteId] = useState<string | null>(null);
  const [noteText, setNoteText] = useState("");

  const { data: withdrawals } = useQuery({
    queryKey: ["admin-withdrawals", filter],
    queryFn: async () => {
      let q = supabase.from("withdrawals").select("*").order("created_at", { ascending: false });
      if (filter !== "all") q = q.eq("status", filter);
      const { data } = await q;
      return data ?? [];
    },
  });

  const handleAction = async (id: string, action: "approved" | "rejected") => {
    const updates: Record<string, string> = { status: action };
    if (noteId === id && noteText) updates.admin_note = noteText;
    const { error } = await supabase.from("withdrawals").update(updates).eq("id", id);
    if (error) toast.error(error.message);
    else {
      toast.success(`Withdrawal ${action}`);
      setNoteId(null);
      setNoteText("");
      queryClient.invalidateQueries({ queryKey: ["admin-withdrawals"] });
    }
  };

  const handleSaveNote = async (id: string) => {
    const { error } = await supabase.from("withdrawals").update({ admin_note: noteText }).eq("id", id);
    if (error) toast.error(error.message);
    else {
      toast.success("Note saved");
      setNoteId(null);
      setNoteText("");
      queryClient.invalidateQueries({ queryKey: ["admin-withdrawals"] });
    }
  };

  const fmt = (n: number) => "$" + n.toLocaleString("en-US", { minimumFractionDigits: 2 });

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <h1 className="font-display font-bold text-xl sm:text-2xl">Withdrawals</h1>

      <div className="flex flex-wrap gap-2">
        {(["pending", "approved", "rejected", "all"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${filter === f ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"}`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/30">
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">User</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Amount</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Currency</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Wallet</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Time</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Status</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {withdrawals && withdrawals.length > 0 ? withdrawals.map((w) => (
                <tr key={w.id} className="border-b border-border/10 hover:bg-secondary/30 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs">{w.user_id.slice(0, 8)}...</td>
                  <td className="px-4 py-3 font-semibold">{fmt(Number(w.amount))}</td>
                  <td className="px-4 py-3">{w.currency}</td>
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{w.wallet_address.slice(0, 16)}...</td>
                  <td className="px-4 py-3 text-muted-foreground text-xs">{formatDistanceToNow(new Date(w.created_at), { addSuffix: true })}</td>
                  <td className="px-4 py-3">
                    <span className={w.status === "approved" ? "status-badge-success" : w.status === "rejected" ? "status-badge-danger" : "status-badge-warning"}>{w.status}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col gap-1.5">
                      {w.status === "pending" && (
                        <div className="flex gap-2">
                          <button onClick={() => handleAction(w.id, "approved")} className="px-3 py-1 rounded text-xs font-medium bg-success/15 text-success hover:bg-success/25 transition-colors">Approve</button>
                          <button onClick={() => handleAction(w.id, "rejected")} className="px-3 py-1 rounded text-xs font-medium bg-destructive/15 text-destructive hover:bg-destructive/25 transition-colors">Reject</button>
                        </div>
                      )}
                      <button
                        onClick={() => { setNoteId(noteId === w.id ? null : w.id); setNoteText(w.admin_note ?? ""); }}
                        className="text-xs text-primary hover:underline text-left"
                      >
                        {w.admin_note ? "Edit Note" : "Add Note"}
                      </button>
                      {noteId === w.id && (
                        <div className="flex gap-2 mt-1">
                          <input value={noteText} onChange={(e) => setNoteText(e.target.value)} className="bg-secondary border border-border/30 rounded px-2 py-1 text-xs flex-1 text-foreground" placeholder="Admin note..." />
                          <button onClick={() => handleSaveNote(w.id)} className="px-2 py-1 rounded text-xs bg-primary text-primary-foreground">Save</button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">No withdrawals found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}
