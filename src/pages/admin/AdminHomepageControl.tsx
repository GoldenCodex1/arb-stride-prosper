import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Save, Plus, Trash2 } from "lucide-react";

interface Stat {
  id: string;
  key: string;
  value: string;
  label: string;
  auto_calculate: boolean;
}

interface Faq {
  id: string;
  question: string;
  answer: string;
  sort_order: number;
}

export default function AdminHomepageControl() {
  const [stats, setStats] = useState<Stat[]>([]);
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [statsRes, faqRes] = await Promise.all([
      supabase.from("platform_stats").select("*"),
      supabase.from("homepage_faq").select("*").order("sort_order"),
    ]);
    if (statsRes.data) setStats(statsRes.data);
    if (faqRes.data) setFaqs(faqRes.data);
  };

  const saveStat = async (stat: Stat) => {
    setSaving(true);
    const { error } = await supabase
      .from("platform_stats")
      .update({ value: stat.value, auto_calculate: stat.auto_calculate })
      .eq("id", stat.id);
    setSaving(false);
    if (error) toast.error("Failed to save");
    else toast.success("Stat updated");
  };

  const saveFaq = async (faq: Faq) => {
    setSaving(true);
    const { error } = await supabase
      .from("homepage_faq")
      .update({ question: faq.question, answer: faq.answer, sort_order: faq.sort_order })
      .eq("id", faq.id);
    setSaving(false);
    if (error) toast.error("Failed to save");
    else toast.success("FAQ updated");
  };

  const addFaq = async () => {
    const { error } = await supabase
      .from("homepage_faq")
      .insert({ question: "New Question", answer: "Answer here...", sort_order: faqs.length + 1 });
    if (!error) loadData();
  };

  const deleteFaq = async (id: string) => {
    await supabase.from("homepage_faq").delete().eq("id", id);
    loadData();
  };

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      <h2 className="font-display font-bold text-xl sm:text-2xl">Homepage Control</h2>

      {/* Stats */}
      <div>
        <h3 className="font-display font-semibold mb-4">Live Stats</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {stats.map((stat) => (
            <div key={stat.id} className="glass-card p-4 space-y-3">
              <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
              <Input
                value={stat.value}
                onChange={(e) => setStats((s) => s.map((x) => x.id === stat.id ? { ...x, value: e.target.value } : x))}
              />
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Switch
                    checked={stat.auto_calculate}
                    onCheckedChange={(v) => setStats((s) => s.map((x) => x.id === stat.id ? { ...x, auto_calculate: v } : x))}
                  />
                  Auto-calculate
                </label>
                <Button size="sm" onClick={() => saveStat(stat)} disabled={saving}>
                  <Save className="w-3.5 h-3.5 mr-1" /> Save
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FAQs */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display font-semibold">FAQ Items</h3>
          <Button size="sm" variant="outline" onClick={addFaq}>
            <Plus className="w-3.5 h-3.5 mr-1" /> Add FAQ
          </Button>
        </div>
        <div className="space-y-4">
          {faqs.map((faq) => (
            <div key={faq.id} className="glass-card p-4 space-y-3">
              <Input
                value={faq.question}
                onChange={(e) => setFaqs((f) => f.map((x) => x.id === faq.id ? { ...x, question: e.target.value } : x))}
                placeholder="Question"
              />
              <Textarea
                value={faq.answer}
                onChange={(e) => setFaqs((f) => f.map((x) => x.id === faq.id ? { ...x, answer: e.target.value } : x))}
                placeholder="Answer"
                rows={3}
              />
              <div className="flex justify-between">
                <Button size="sm" variant="ghost" className="text-destructive" onClick={() => deleteFaq(faq.id)}>
                  <Trash2 className="w-3.5 h-3.5 mr-1" /> Delete
                </Button>
                <Button size="sm" onClick={() => saveFaq(faq)} disabled={saving}>
                  <Save className="w-3.5 h-3.5 mr-1" /> Save
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
