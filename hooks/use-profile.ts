import { useEffect, useState } from 'react';
import { supabase } from '../supabase';

export type Profile = {
  id: string;
  full_name: string;
  team_name: string;
  team_color: string;
  created_at: string;
};

export function useProfile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load(userId: string | undefined) {
      if (!userId) {
        if (!cancelled) { setProfile(null); setLoading(false); }
        return;
      }
      const { data } = await supabase.from('profiles').select('*').eq('id', userId).single();
      if (!cancelled) { setProfile(data as Profile | null); setLoading(false); }
    }

    supabase.auth.getUser().then(({ data }: any) => load(data.user?.id));
    const { data: sub } = supabase.auth.onAuthStateChange((_event: any, session: any) => {
      setLoading(true);
      load(session?.user?.id);
    });

    return () => { cancelled = true; sub.subscription.unsubscribe(); };
  }, []);

  return { profile, loading };
}
