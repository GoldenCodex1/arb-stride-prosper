import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Search, Pencil, Trash2, DollarSign, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

type Profile = {
  id: string;
  user_id: string;
  full_name: string | null;
  kyc_status: string;
  is_frozen: boolean;
  avatar_url: string | null;
  referral_code: string | null;
  created_at: string;
};

export default function AdminUsers() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");

  // Edit profile dialog
  const [editUser, setEditUser] = useState<Profile | null>(null);
  const [editName, setEditName] = useState("");
  const [editKyc, setEditKyc] = useState("");
  const [editSaving, setEditSaving] = useState(false);

  // Balance dialog
  const [balanceUser, setBalanceUser] = useState<Profile | null>(null);
  const [balanceAmount, setBalanceAmount] = useState("");
  const [balanceType, setBalanceType] = useState<"credit" | "debit">("credit");
  const [balanceDesc, setBalanceDesc] = useState("");
  const [balanceSaving, setBalanceSaving] = useState(false);

  // Delete dialog
  const [deleteUser, setDeleteUser] = useState<Profile | null>(null);
  const [deleting, setDeleting] = useState(false);

  const { data: profiles } = useQuery({
    queryKey: ["admin-profiles"],
    queryFn: async () => {
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });
      return (data ?? []) as Profile[];
    },
  });

  const filtered = profiles?.filter((p) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      (p.full_name ?? "").toLowerCase().includes(q) ||
      p.user_id.toLowerCase().includes(q) ||
      (p.referral_code ?? "").toLowerCase().includes(q)
    );
  });

  const toggleFreeze = async (userId: string, current: boolean) => {
    const { error } = await supabase
      .from("profiles")
      .update({ is_frozen: !current })
      .eq("user_id", userId);
    if (error) toast.error(error.message);
    else {
      toast.success(current ? "User unfrozen" : "User frozen");
      queryClient.invalidateQueries({ queryKey: ["admin-profiles"] });
    }
  };

  // Edit profile
  const openEdit = (p: Profile) => {
    setEditUser(p);
    setEditName(p.full_name ?? "");
    setEditKyc(p.kyc_status);
  };

  const saveEdit = async () => {
    if (!editUser) return;
    setEditSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({ full_name: editName, kyc_status: editKyc })
      .eq("user_id", editUser.user_id);
    setEditSaving(false);
    if (error) toast.error(error.message);
    else {
      toast.success("Profile updated");
      setEditUser(null);
      queryClient.invalidateQueries({ queryKey: ["admin-profiles"] });
    }
  };

  // Balance adjustment
  const openBalance = (p: Profile) => {
    setBalanceUser(p);
    setBalanceAmount("");
    setBalanceType("credit");
    setBalanceDesc("");
  };

  const saveBalance = async () => {
    if (!balanceUser) return;
    const amt = parseFloat(balanceAmount);
    if (isNaN(amt) || amt <= 0) {
      toast.error("Enter a valid positive amount");
      return;
    }
    setBalanceSaving(true);
    const finalAmount = balanceType === "credit" ? amt : -amt;
    const { error } = await supabase.from("transactions").insert({
      user_id: balanceUser.user_id,
      amount: finalAmount,
      type: balanceType === "credit" ? "admin_credit" : "admin_debit",
      description: balanceDesc || `Admin ${balanceType}`,
    });
    setBalanceSaving(false);
    if (error) toast.error(error.message);
    else {
      toast.success(`Balance ${balanceType === "credit" ? "added" : "removed"} successfully`);
      setBalanceUser(null);
    }
  };

  // Delete user profile
  const confirmDelete = async () => {
    if (!deleteUser) return;
    setDeleting(true);
    // Delete related records first, then profile
    const userId = deleteUser.user_id;
    await supabase.from("notifications").delete().eq("user_id", userId);
    await supabase.from("bot_activity").delete().eq("user_id", userId);
    await supabase.from("trade_entries").delete().eq("user_id", userId);
    await supabase.from("transactions").delete().eq("user_id", userId);
    await supabase.from("deposits").delete().eq("user_id", userId);
    await supabase.from("withdrawals").delete().eq("user_id", userId);
    await supabase.from("kyc").delete().eq("user_id", userId);
    await supabase.from("referrals").delete().eq("referrer_id", userId);
    await supabase.from("referrals").delete().eq("referred_id", userId);
    await supabase.from("totp_secrets").delete().eq("user_id", userId);
    await supabase.from("user_roles").delete().eq("user_id", userId);
    const { error } = await supabase.from("profiles").delete().eq("user_id", userId);
    setDeleting(false);
    if (error) toast.error(error.message);
    else {
      toast.success("User deleted");
      setDeleteUser(null);
      queryClient.invalidateQueries({ queryKey: ["admin-profiles"] });
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="font-display font-bold text-xl sm:text-2xl">Users</h1>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, ID, or referral code…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

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
              {filtered?.map((p) => (
                <tr key={p.id} className="border-b border-border/10 hover:bg-secondary/30 transition-colors">
                  <td className="px-4 py-3 font-medium">{p.full_name || "—"}</td>
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{p.user_id.slice(0, 12)}…</td>
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
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleFreeze(p.user_id, p.is_frozen)}
                        className={`text-xs font-medium hover:underline ${p.is_frozen ? "text-success" : "text-destructive"}`}
                      >
                        {p.is_frozen ? "Unfreeze" : "Freeze"}
                      </button>
                      <button onClick={() => openEdit(p)} className="p-1 rounded hover:bg-secondary/50 text-muted-foreground hover:text-foreground" title="Edit profile">
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button onClick={() => openBalance(p)} className="p-1 rounded hover:bg-secondary/50 text-muted-foreground hover:text-foreground" title="Adjust balance">
                        <DollarSign className="h-3.5 w-3.5" />
                      </button>
                      <button onClick={() => setDeleteUser(p)} className="p-1 rounded hover:bg-destructive/20 text-muted-foreground hover:text-destructive" title="Delete user">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {(!filtered || filtered.length === 0) && (
                <tr><td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">No users found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Profile Dialog */}
      <Dialog open={!!editUser} onOpenChange={(o) => !o && setEditUser(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogDescription>Update user profile information.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input value={editName} onChange={(e) => setEditName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>KYC Status</Label>
              <Select value={editKyc} onValueChange={setEditKyc}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditUser(null)}>Cancel</Button>
            <Button onClick={saveEdit} disabled={editSaving}>{editSaving ? "Saving…" : "Save"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Balance Adjustment Dialog */}
      <Dialog open={!!balanceUser} onOpenChange={(o) => !o && setBalanceUser(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adjust Balance</DialogTitle>
            <DialogDescription>Add or remove balance for {balanceUser?.full_name || "this user"}.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Type</Label>
              <Select value={balanceType} onValueChange={(v) => setBalanceType(v as "credit" | "debit")}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="credit">Credit (Add)</SelectItem>
                  <SelectItem value="debit">Debit (Remove)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Amount (USD)</Label>
              <Input type="number" min="0" step="0.01" value={balanceAmount} onChange={(e) => setBalanceAmount(e.target.value)} placeholder="0.00" />
            </div>
            <div className="space-y-2">
              <Label>Description (optional)</Label>
              <Input value={balanceDesc} onChange={(e) => setBalanceDesc(e.target.value)} placeholder="Reason for adjustment" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBalanceUser(null)}>Cancel</Button>
            <Button onClick={saveBalance} disabled={balanceSaving}>{balanceSaving ? "Processing…" : "Confirm"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete User Dialog */}
      <Dialog open={!!deleteUser} onOpenChange={(o) => !o && setDeleteUser(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>
              This will permanently delete <strong>{deleteUser?.full_name || "this user"}</strong> and all their data. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteUser(null)}>Cancel</Button>
            <Button variant="destructive" onClick={confirmDelete} disabled={deleting}>{deleting ? "Deleting…" : "Delete User"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
