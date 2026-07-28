export type MatchupInput = { week: number; home_team: string; away_team: string };

function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Circle method: produces teams.length - 1 rounds, each a perfect matching
// (every team plays exactly once per round), covering every pair of teams
// exactly once across all rounds. Standard 1-factorization of a complete
// graph with an even number of vertices.
function circleMethodRounds(teams: string[]): [string, string][][] {
  const n = teams.length;
  const arr = teams.slice();
  const rounds: [string, string][][] = [];

  for (let r = 0; r < n - 1; r++) {
    const pairs: [string, string][] = [];
    for (let i = 0; i < n / 2; i++) {
      pairs.push([arr[i], arr[n - 1 - i]]);
    }
    rounds.push(pairs);

    const last = arr[n - 1];
    for (let i = n - 1; i > 1; i--) arr[i] = arr[i - 1];
    arr[1] = last;
  }

  return rounds;
}

// Orders round indices across `totalWeeks` weeks so consecutive weeks never
// reuse the same round. Because each round is a 1-factor (every pair of
// teams appears in exactly one round, never more than once across all
// rounds), any two DIFFERENT rounds share no common pair — so avoiding an
// immediate repeat of the round index is sufficient to guarantee no team
// faces the same opponent in back-to-back weeks, even when a schedule runs
// longer than one full cycle and rounds must repeat.
function buildRoundOrder(totalWeeks: number, numRounds: number): number[] {
  const order: number[] = [];
  while (order.length < totalWeeks) {
    const chunk = shuffle(Array.from({ length: numRounds }, (_, i) => i));
    if (order.length > 0 && chunk.length > 1 && chunk[0] === order[order.length - 1]) {
      const swapIdx = 1 + Math.floor(Math.random() * (chunk.length - 1));
      [chunk[0], chunk[swapIdx]] = [chunk[swapIdx], chunk[0]];
    }
    order.push(...chunk);
  }
  return order.slice(0, totalWeeks);
}

export function generateRoundRobinSchedule(teamNames: string[], totalWeeks: number): MatchupInput[] {
  if (teamNames.length % 2 !== 0) {
    throw new Error('generateRoundRobinSchedule requires an even number of teams');
  }

  const rounds = circleMethodRounds(shuffle(teamNames));
  const roundOrder = buildRoundOrder(totalWeeks, rounds.length);

  const matchups: MatchupInput[] = [];
  roundOrder.forEach((roundIndex, weekIdx) => {
    const week = weekIdx + 1;
    for (const [a, b] of rounds[roundIndex]) {
      const homeFirst = Math.random() < 0.5;
      matchups.push({
        week,
        home_team: homeFirst ? a : b,
        away_team: homeFirst ? b : a,
      });
    }
  });

  return matchups;
}
