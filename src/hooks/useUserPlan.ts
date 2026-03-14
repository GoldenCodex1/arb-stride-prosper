import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface UserPlan {
  id: string;
  name: string;
  description: string;
  max_trades_per_day: number;
  max_trade_amount: number;
  max_auto_trade_slots: number;
  daily_withdrawal_limit: number;
  monthly_price: number;
}

export function useUserPlan() {
  const { user } = useAuth();

  const { data: plan, isLoading } = useQuery({
    queryKey: ["user-plan", user?.id],
    queryFn: async () => {
      const { data: profile } = await supabase
        .from("profiles")
        .select("plan_id")
        .eq("user_id", user!.id)
        .maybeSingle();

      if (!profile?.plan_id) return null;

      const { data: planData } = await supabase
        .from("plans")
        .select("*")
        .eq("id", profile.plan_id)
        .maybeSingle();

      return planData as UserPlan | null;
    },
    enabled: !!user,
  });

  const { data: tradesToday } = useQuery({
    queryKey: ["trades-today-count", user?.id],
    queryFn: async () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const { count } = await supabase
        .from("trade_entries")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user!.id)
        .gte("started_at", today.toISOString());
      return count ?? 0;
    },
    enabled: !!user,
  });

  const { data: activeAutoTrades } = useQuery({
    queryKey: ["active-auto-trades", user?.id],
    queryFn: async () => {
      const { count } = await supabase
        .from("trade_entries")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user!.id)
        .eq("status", "active");
      return count ?? 0;
    },
    enabled: !!user,
  });

  return {
    plan,
    isLoading,
    tradesToday: tradesToday ?? 0,
    activeAutoTrades: activeAutoTrades ?? 0,
    canTrade: plan ? (tradesToday ?? 0) < plan.max_trades_per_day : false,
    canAutoTrade: plan ? (activeAutoTrades ?? 0) < plan.max_auto_trade_slots : false,
  };
}
