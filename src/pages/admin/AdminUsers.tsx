import { motion } from "framer-motion";

const users = [
  { name: "John Doe", email: "john@example.com", balance: "$24,580", kyc: "Verified", status: "Active", joined: "Jan 2025" },
  { name: "Alice Martin", email: "alice@example.com", balance: "$12,340", kyc: "Pending", status: "Active", joined: "Jan 2025" },
  { name: "Bob Smith", email: "bob@example.com", balance: "$5,200", kyc: "Verified", status: "Frozen", joined: "Dec 2024" },
  { name: "Eve Wilson", email: "eve@example.com", balance: "$8,900", kyc: "Rejected", status: "Active", joined: "Dec 2024" },
];

export default function AdminUsers() {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <h1 className="font-display font-bold text-2xl">Users</h1>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/30">
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Name</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Email</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Balance</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">KYC</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Status</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u, i) => (
                <tr key={i} className="border-b border-border/10 hover:bg-secondary/30 transition-colors">
                  <td className="px-4 py-3 font-medium">{u.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{u.email}</td>
                  <td className="px-4 py-3 font-display font-semibold">{u.balance}</td>
                  <td className="px-4 py-3">
                    <span className={
                      u.kyc === "Verified" ? "status-badge-success" :
                      u.kyc === "Pending" ? "status-badge-warning" : "status-badge-danger"
                    }>{u.kyc}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={u.status === "Active" ? "status-badge-success" : "status-badge-danger"}>
                      {u.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button className="text-xs text-primary hover:underline">Edit</button>
                      <button className="text-xs text-destructive hover:underline">Freeze</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}
