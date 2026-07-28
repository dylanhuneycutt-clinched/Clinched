import { useEffect, useState } from 'react';
import { supabase } from '../supabase';

export const COMMISSIONER_EMAIL = 'dylanhuneycutt5@gmail.com';

export function useIsCommissioner() {
  const [state, setState] = useState({ loading: true, isCommissioner: false });

  useEffect(() => {
    let cancelled = false;

    supabase.auth.getUser().then(({ data }: any) => {
      if (!cancelled) setState({ loading: false, isCommissioner: data.user?.email === COMMISSIONER_EMAIL });
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event: any, session: any) => {
      if (!cancelled) setState({ loading: false, isCommissioner: session?.user?.email === COMMISSIONER_EMAIL });
    });

    return () => { cancelled = true; sub.subscription.unsubscribe(); };
  }, []);

  return state;
}
