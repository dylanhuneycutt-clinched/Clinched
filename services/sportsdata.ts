export type Sport = 'NFL' | 'NBA' | 'MLB';

export type SportsDataPlayer = {
  externalId: string;
  name: string;
  position: string;
  team: string;
  sport: Sport;
};

type RawPlayer = {
  PlayerID: number;
  Name?: string;
  FirstName?: string;
  LastName?: string;
  Position: string;
  Team: string | null;
  Status: string;
};

const SPORT_PATHS: Record<Sport, string> = {
  NFL: 'nfl',
  NBA: 'nba',
  MLB: 'mlb',
};

function apiKey(): string {
  const key = process.env.EXPO_PUBLIC_SPORTSDATA_KEY;
  if (!key) throw new Error('EXPO_PUBLIC_SPORTSDATA_KEY is not set');
  return key;
}

// SportsDataIO's "Players" endpoint returns every player it has ever tracked
// (thousands of rows per sport), each tagged with a Status. Filtering to
// Status === 'Active' (all of which carry a Team) is what gives us the
// current active rosters.
async function fetchPlayers(sport: Sport): Promise<SportsDataPlayer[]> {
  const url = `https://api.sportsdata.io/v3/${SPORT_PATHS[sport]}/scores/json/Players?key=${apiKey()}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`SportsDataIO ${sport} players request failed: ${res.status} ${res.statusText}`);
  }
  const raw = (await res.json()) as RawPlayer[];
  return raw
    .filter(p => p.Status === 'Active' && p.Team)
    .map(p => ({
      externalId: String(p.PlayerID),
      name: p.Name ?? `${p.FirstName ?? ''} ${p.LastName ?? ''}`.trim(),
      position: p.Position,
      team: p.Team as string,
      sport,
    }));
}

export const fetchNFLPlayers = () => fetchPlayers('NFL');
export const fetchNBAPlayers = () => fetchPlayers('NBA');
export const fetchMLBPlayers = () => fetchPlayers('MLB');

export async function fetchAllPlayers(): Promise<SportsDataPlayer[]> {
  const [nfl, nba, mlb] = await Promise.all([
    fetchNFLPlayers(),
    fetchNBAPlayers(),
    fetchMLBPlayers(),
  ]);
  return [...nfl, ...nba, ...mlb];
}
