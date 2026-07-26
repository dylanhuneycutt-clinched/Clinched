import { useEffect, useState } from 'react';
import { supabase } from '../supabase';
import type { Profile } from './use-profile';

export function useProfiles() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    supabase.from('profiles').select('*').then(({ data }: any) => {
      if (!cancelled) { setProfiles((data ?? []) as Profile[]); setLoading(false); }
    });
    return () => { cancelled = true; };
  }, []);

  return { profiles, loading };
}
