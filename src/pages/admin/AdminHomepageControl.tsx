import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Save, Plus, Trash2, GripVertical, Eye, EyeOff, BarChart3, HelpCircle, Type, Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

/* ─── types ─── */
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
  display_order: number;
  is_visible: boolean;
}

interface HeroContent {
  id: string;
  headline: string;
  subheadline: string;
  primary_cta_text: string;
  secondary_cta_text: string;
}

interface SeoMeta {
  id: string;
  meta_title: string;
  meta_description: string;
  og_title: string;
  og_description: string;
  og_image: string;
  keywords: string;
}

export default function AdminHomepageControl() {
  const [stats, setStats] = useState<Stat[]>([]);
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [hero, setHero] = useState<HeroContent | null>(null);
  const [seo, setSeo] = useState<SeoMeta | null>(null);
  const [saving, setSaving] = useState<string | null>(null);

  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    const [statsRes, faqRes, heroRes, seoRes] = await Promise.all([
      supabase.from("platform_stats").select("*"),
      supabase.from("homepage_faq").select("*").order("display_order"),
      supabase.from("homepage_hero").select("*").limit(1).single(),
      supabase.from("homepage_seo").select("*").limit(1).single(),
    ]);
    if (statsRes.data) setStats(statsRes.data);
    if (faqRes.data) setFaqs(faqRes.data);
    if (heroRes.data) setHero(heroRes.data);
    if (seoRes.data) setSeo(seoRes.data);
  };

  /* ── stat helpers ── */
  const saveStat = async (stat: Stat) => {
    setSaving(stat.id);
    const { error } = await supabase
      .from("platform_stats")
      .update({ value: stat.value, auto_calculate: stat.auto_calculate })
      .eq("id", stat.id);
    setSaving(null);
    if (error) toast.error("Failed to save stat");
    else toast.success("Stat updated");
  };

  /* ── FAQ helpers ── */
  const saveFaq = async (faq: Faq) => {
    setSaving(faq.id);
    const { error } = await supabase
      .from("homepage_faq")
      .update({ question: faq.question, answer: faq.answer, display_order: faq.display_order, is_visible: faq.is_visible })
      .eq("id", faq.id);
    setSaving(null);
    if (error) toast.error("Failed to save FAQ");
    else toast.success("FAQ updated");
  };

  const addFaq = async () => {
    const { error } = await supabase
      .from("homepage_faq")
      .insert({ question: "New Question", answer: "Answer here...", display_order: faqs.length + 1 });
    if (!error) loadAll();
  };

  const deleteFaq = async (id: string) => {
    await supabase.from("homepage_faq").delete().eq("id", id);
    loadAll();
  };

  /* ── Hero helpers ── */
  const saveHero = async () => {
    if (!hero) return;
    setSaving("hero");
    const { error } = await supabase
      .from("homepage_hero")
      .update({ headline: hero.headline, subheadline: hero.subheadline, primary_cta_text: hero.primary_cta_text, secondary_cta_text: hero.secondary_cta_text })
      .eq("id", hero.id);
    setSaving(null);
    if (error) toast.error("Failed to save hero content");
    else toast.success("Hero content updated");
  };

  /* ── SEO helpers ── */
  const saveSeo = async () => {
    if (!seo) return;
    setSaving("seo");
    const { error } = await supabase
      .from("homepage_seo")
      .update({ meta_title: seo.meta_title, meta_description: seo.meta_description, og_title: seo.og_title, og_description: seo.og_description, og_image: seo.og_image, keywords: seo.keywords })
      .eq("id", seo.id);
    setSaving(null);
    if (error) toast.error("Failed to save SEO settings");
    else toast.success("SEO settings updated");
  };

  const sectionAnim = { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 } };

  return (
    <motion.div {...sectionAnim} className="space-y-8 max-w-5xl">
      <h2 className="font-display font-bold text-xl sm:text-2xl">Homepage Control</h2>

      {/* ── 1. LIVE PLATFORM STATS ── */}
      <Card className="glass-card border-none">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg font-display">
            <BarChart3 className="w-5 h-5 text-primary" /> Live Platform Stats
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {stats.map((stat) => (
              <div key={stat.id} className="glass-card p-4 space-y-3 rounded-xl">
                <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                <Input
                  value={stat.value}
                  disabled={stat.auto_calculate}
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
                  <Button size="sm" onClick={() => saveStat(stat)} disabled={saving === stat.id}>
                    <Save className="w-3.5 h-3.5 mr-1" /> Save
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* ── 2. FAQ MANAGER ── */}
      <Card className="glass-card border-none">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg font-display">
              <HelpCircle className="w-5 h-5 text-primary" /> FAQ Manager
            </CardTitle>
            <Button size="sm" variant="outline" onClick={addFaq}>
              <Plus className="w-3.5 h-3.5 mr-1" /> Add FAQ
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {faqs.map((faq) => (
            <div key={faq.id} className="glass-card p-4 space-y-3 rounded-xl">
              <div className="flex items-center gap-2">
                <GripVertical className="w-4 h-4 text-muted-foreground shrink-0" />
                <Input
                  value={faq.question}
                  onChange={(e) => setFaqs((f) => f.map((x) => x.id === faq.id ? { ...x, question: e.target.value } : x))}
                  placeholder="Question"
                  className="font-medium"
                />
              </div>
              <Textarea
                value={faq.answer}
                onChange={(e) => setFaqs((f) => f.map((x) => x.id === faq.id ? { ...x, answer: e.target.value } : x))}
                placeholder="Answer"
                rows={3}
              />
              <div className="flex items-center gap-2">
                <Label className="text-xs text-muted-foreground">Order:</Label>
                <Input
                  type="number"
                  value={faq.display_order}
                  onChange={(e) => setFaqs((f) => f.map((x) => x.id === faq.id ? { ...x, display_order: parseInt(e.target.value) || 0 } : x))}
                  className="w-20"
                />
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Switch
                      checked={faq.is_visible}
                      onCheckedChange={(v) => setFaqs((f) => f.map((x) => x.id === faq.id ? { ...x, is_visible: v } : x))}
                    />
                    {faq.is_visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                    Visible
                  </label>
                  <Button size="sm" variant="ghost" className="text-destructive" onClick={() => deleteFaq(faq.id)}>
                    <Trash2 className="w-3.5 h-3.5 mr-1" /> Delete
                  </Button>
                </div>
                <Button size="sm" onClick={() => saveFaq(faq)} disabled={saving === faq.id}>
                  <Save className="w-3.5 h-3.5 mr-1" /> Save
                </Button>
              </div>
            </div>
          ))}
          {faqs.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">No FAQs yet. Click "Add FAQ" to create one.</p>}
        </CardContent>
      </Card>

      {/* ── 3. HERO CONTENT EDITOR ── */}
      {hero && (
        <Card className="glass-card border-none">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg font-display">
              <Type className="w-5 h-5 text-primary" /> Hero Content
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-xs text-muted-foreground mb-1 block">Headline</Label>
              <Input value={hero.headline} onChange={(e) => setHero({ ...hero, headline: e.target.value })} />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground mb-1 block">Subheadline</Label>
              <Textarea value={hero.subheadline} onChange={(e) => setHero({ ...hero, subheadline: e.target.value })} rows={2} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label className="text-xs text-muted-foreground mb-1 block">Primary CTA Text</Label>
                <Input value={hero.primary_cta_text} onChange={(e) => setHero({ ...hero, primary_cta_text: e.target.value })} />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground mb-1 block">Secondary CTA Text</Label>
                <Input value={hero.secondary_cta_text} onChange={(e) => setHero({ ...hero, secondary_cta_text: e.target.value })} />
              </div>
            </div>
            <div className="flex justify-end">
              <Button onClick={saveHero} disabled={saving === "hero"}>
                <Save className="w-4 h-4 mr-2" /> Save Hero
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ── 4. SEO META CONTROL ── */}
      {seo && (
        <Card className="glass-card border-none">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg font-display">
              <Search className="w-5 h-5 text-primary" /> SEO Meta Control
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label className="text-xs text-muted-foreground mb-1 block">Meta Title</Label>
                <Input value={seo.meta_title} onChange={(e) => setSeo({ ...seo, meta_title: e.target.value })} />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground mb-1 block">OG Title</Label>
                <Input value={seo.og_title} onChange={(e) => setSeo({ ...seo, og_title: e.target.value })} />
              </div>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground mb-1 block">Meta Description</Label>
              <Textarea value={seo.meta_description} onChange={(e) => setSeo({ ...seo, meta_description: e.target.value })} rows={2} />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground mb-1 block">OG Description</Label>
              <Textarea value={seo.og_description} onChange={(e) => setSeo({ ...seo, og_description: e.target.value })} rows={2} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label className="text-xs text-muted-foreground mb-1 block">Social Share Image URL</Label>
                <Input value={seo.og_image} onChange={(e) => setSeo({ ...seo, og_image: e.target.value })} placeholder="https://..." />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground mb-1 block">Keywords</Label>
                <Input value={seo.keywords} onChange={(e) => setSeo({ ...seo, keywords: e.target.value })} placeholder="crypto, arbitrage, AI" />
              </div>
            </div>
            <div className="flex justify-end">
              <Button onClick={saveSeo} disabled={saving === "seo"}>
                <Save className="w-4 h-4 mr-2" /> Save SEO
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
}
