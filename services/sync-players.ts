// Node-only: this writes to the players table with the Supabase service role
// key, which must never ship in the client bundle. Only import this from
// scripts/, not from anything under app/.
import { createClient } from '@supabase/supabase-js';
import { fetchAllPlayers } from './sportsdata';

const BATCH_SIZE = 500;

function adminClient() {
  const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    throw new Error(
      'EXPO_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must both be set to sync players ' +
      '(the service role key is in Supabase project settings > API, and should NOT use the EXPO_PUBLIC_ prefix).'
    );
  }
  return createClient(url, serviceKey);
}

export async function syncPlayers() {
  const players = await fetchAllPlayers();
  const supabase = adminClient();

  let upserted = 0;
  for (let i = 0; i < players.length; i += BATCH_SIZE) {
    const batch = players.slice(i, i + BATCH_SIZE).map(p => ({
      name: p.name,
      position: p.position,
      team: p.team,
      sport: p.sport,
      external_id: p.externalId,
    }));
    const { error } = await supabase
      .from('players')
      .upsert(batch, { onConflict: 'sport,external_id' });
    if (error) throw new Error(`Upsert failed at offset ${i}: ${error.message}`);
    upserted += batch.length;
  }

  return { total: players.length, upserted };
}
