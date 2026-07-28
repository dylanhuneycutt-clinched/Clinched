export type Sport = 'NFL' | 'NBA' | 'MLB';

export type RosterSlot = {
  id: string;
  pos: string;
  label: string;
  // Player.position values (from SportsDataIO) that satisfy this slot.
  // null means any position for the sport is eligible (bench, IR, utility).
  eligiblePositions: string[] | null;
};

export const STARTER_SLOTS: Record<Sport, RosterSlot[]> = {
  NFL: [
    { id: 'QB1', pos: 'QB', label: 'Quarterback', eligiblePositions: ['QB'] },
    { id: 'QB2', pos: 'QB', label: 'Quarterback', eligiblePositions: ['QB'] },
    { id: 'RB1', pos: 'RB', label: 'Running Back', eligiblePositions: ['RB'] },
    { id: 'RB2', pos: 'RB', label: 'Running Back', eligiblePositions: ['RB'] },
    { id: 'WR1', pos: 'WR', label: 'Wide Receiver', eligiblePositions: ['WR'] },
    { id: 'WR2', pos: 'WR', label: 'Wide Receiver', eligiblePositions: ['WR'] },
    { id: 'TE1', pos: 'TE', label: 'Tight End', eligiblePositions: ['TE'] },
    { id: 'TE2', pos: 'TE', label: 'Tight End', eligiblePositions: ['TE'] },
  ],
  NBA: [
    { id: 'G1', pos: 'G', label: 'Guard', eligiblePositions: ['PG', 'SG'] },
    { id: 'G2', pos: 'G', label: 'Guard', eligiblePositions: ['PG', 'SG'] },
    { id: 'F1', pos: 'F', label: 'Forward', eligiblePositions: ['SF', 'PF'] },
    { id: 'F2', pos: 'F', label: 'Forward', eligiblePositions: ['SF', 'PF'] },
    { id: 'C1', pos: 'C', label: 'Center', eligiblePositions: ['C'] },
    { id: 'UT1', pos: 'UT', label: 'Utility', eligiblePositions: null },
    { id: 'UT2', pos: 'UT', label: 'Utility', eligiblePositions: null },
    { id: 'UT3', pos: 'UT', label: 'Utility', eligiblePositions: null },
  ],
  MLB: [
    { id: 'C1', pos: 'C', label: 'Catcher', eligiblePositions: ['C'] },
    { id: '1B1', pos: '1B', label: 'First Base', eligiblePositions: ['1B'] },
    { id: '2B1', pos: '2B', label: 'Second Base', eligiblePositions: ['2B'] },
    { id: 'SS1', pos: 'SS', label: 'Shortstop', eligiblePositions: ['SS'] },
    { id: '3B1', pos: '3B', label: 'Third Base', eligiblePositions: ['3B'] },
    { id: 'OF1', pos: 'OF', label: 'Outfielder', eligiblePositions: ['LF', 'CF', 'RF'] },
    { id: 'OF2', pos: 'OF', label: 'Outfielder', eligiblePositions: ['LF', 'CF', 'RF'] },
    { id: 'OF3', pos: 'OF', label: 'Outfielder', eligiblePositions: ['LF', 'CF', 'RF'] },
  ],
};

export const BENCH_SLOTS: RosterSlot[] = [
  { id: 'BN1', pos: 'BN', label: 'Bench Player', eligiblePositions: null },
  { id: 'BN2', pos: 'BN', label: 'Bench Player', eligiblePositions: null },
  { id: 'BN3', pos: 'BN', label: 'Bench Player', eligiblePositions: null },
];

export const IR_SLOTS: RosterSlot[] = [
  { id: 'IR', pos: 'IR', label: 'IR Player', eligiblePositions: null },
];

export function allSlotsForSport(sport: Sport): RosterSlot[] {
  return [...STARTER_SLOTS[sport], ...BENCH_SLOTS, ...IR_SLOTS];
}
