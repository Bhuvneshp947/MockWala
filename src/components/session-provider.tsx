import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import type { Session } from "@supabase/supabase-js";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";

type SessionState = { session: Session | null; loading: boolean };

const SessionContext = createContext<SessionState>({ session: null, loading: true });

export function useSession() {
  return useContext(SessionContext);
}

export function SessionProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<SessionState>({ session: null, loading: true });
  const router = useRouter();
  const queryClient = useQueryClient();

  useEffect(() => {
    let active = true;
    supabase.auth.getSession().then(({ data }) => {
      if (active) setState({ session: data.session, loading: false });
    });

    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      setState({ session, loading: false });
      if (event !== "SIGNED_IN" && event !== "SIGNED_OUT" && event !== "USER_UPDATED") return;
      router.invalidate();
      if (event !== "SIGNED_OUT") queryClient.invalidateQueries();
    });

    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, [router, queryClient]);

  return <SessionContext.Provider value={state}>{children}</SessionContext.Provider>;
}
