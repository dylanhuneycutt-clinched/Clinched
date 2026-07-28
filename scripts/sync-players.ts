import 'dotenv/config';
import { syncPlayers } from '../services/sync-players';

syncPlayers()
  .then(({ total, upserted }) => {
    console.log(`Synced ${upserted}/${total} players into Supabase.`);
  })
  .catch(err => {
    console.error('Player sync failed:', err.message);
    process.exitCode = 1;
  });
