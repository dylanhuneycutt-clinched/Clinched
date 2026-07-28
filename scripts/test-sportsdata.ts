import 'dotenv/config';
import { fetchNFLPlayers } from '../services/sportsdata';

fetchNFLPlayers()
  .then(players => {
    console.log(`Fetched ${players.length} active NFL players.`);
    console.log('Sample:');
    for (const p of players.slice(0, 5)) {
      console.log(`  ${p.name} — ${p.position} — ${p.team} (external_id ${p.externalId})`);
    }
  })
  .catch(err => {
    console.error('SportsDataIO test failed:', err.message);
    process.exitCode = 1;
  });
