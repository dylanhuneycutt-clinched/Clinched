import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image, TextInput, Alert } from 'react-native';
import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { useFonts, Orbitron_700Bold } from '@expo-google-fonts/orbitron';
import { useProfiles } from '../../hooks/use-profiles';
import { useIsCommissioner } from '../../hooks/use-is-commissioner';
import { supabase } from '../../supabase';
import { hexWithAlpha } from '../../constants/color';
import { TEAMS } from '../../constants/teams';
import { STARTER_SLOTS, BENCH_SLOTS, IR_SLOTS, RosterSlot, Sport } from '../../constants/rosters';

const logo = require('../../assets/images/logo1.png');
const GOLD = '#C9A84C';

type Player = { id: string; name: string; position: string; team: string; sport: Sport; external_id: string };
type RosterRow = { id: string; slot_position: string; player_id: string; players: Player };

export default function CommissionerScreen() {
  const router = useRouter();
  const { loading: authLoading, isCommissioner } = useIsCommissioner();
  const { profiles } = useProfiles();
  const [fontsLoaded] = useFonts({ Orbitron_700Bold });

  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const [sport, setSport] = useState<Sport>('NFL');
  const [rosterRows, setRosterRows] = useState<RosterRow[]>([]);
  const [assignedIds, setAssignedIds] = useState<Set<string>>(new Set());
  const [activeSlotId, setActiveSlotId] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Player[]>([]);
  const [searching, setSearching] = useState(false);
  const [savingSlotId, setSavingSlotId] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !isCommissioner) router.replace('/(tabs)');
  }, [authLoading, isCommissioner, router]);

  const selectedProfile = profiles.find(p => p.team_name === selectedTeam) ?? null;

  const refresh = useCallback(async () => {
    if (selectedProfile) {
      const { data } = await supabase
        .from('roster_players')
        .select('id, slot_position, player_id, players(id,name,position,team,sport,external_id)')
        .eq('profile_id', selectedProfile.id)
        .eq('sport', sport);
      setRosterRows((data ?? []) as unknown as RosterRow[]);
    } else {
      setRosterRows([]);
    }
    const { data: assigned } = await supabase.from('roster_players').select('player_id');
    setAssignedIds(new Set((assigned ?? []).map((r: any) => r.player_id as string)));
  }, [selectedProfile?.id, sport]);

  useEffect(() => { refresh(); }, [refresh]);

  useEffect(() => {
    setActiveSlotId(null);
    setQuery('');
    setResults([]);
  }, [selectedProfile?.id, sport]);

  useEffect(() => {
    if (!activeSlotId || query.trim().length < 1) { setResults([]); return; }
    let cancelled = false;
    setSearching(true);
    const handle = setTimeout(async () => {
      const { data } = await supabase
        .from('players')
        .select('id,name,position,team,sport,external_id')
        .eq('sport', sport)
        .ilike('name', `%${query.trim()}%`)
        .limit(20);
      if (!cancelled) {
        setResults((data ?? []) as Player[]);
        setSearching(false);
      }
    }, 250);
    return () => { cancelled = true; clearTimeout(handle); };
  }, [query, activeSlotId, sport]);

  if (!fontsLoaded || authLoading || !isCommissioner) {
    return <View style={{ flex:1, backgroundColor:'#0A0A0A' }} />;
  }

  async function assignPlayer(slot: RosterSlot, player: Player) {
    if (!selectedProfile || savingSlotId) return;
    setSavingSlotId(slot.id);
    try {
      const { error } = await supabase.from('roster_players').upsert(
        { profile_id: selectedProfile.id, player_id: player.id, sport, slot_position: slot.id },
        { onConflict: 'profile_id,sport,slot_position' }
      );
      if (error) {
        Alert.alert('Could not save player', error.message);
        return;
      }
      await refresh();
      setActiveSlotId(null);
      setQuery('');
      setResults([]);
      Alert.alert('Player saved', `${player.name} was added to ${selectedProfile.team_name} (${slot.pos}).`);
    } catch (err: any) {
      Alert.alert('Could not save player', err?.message ?? 'Unknown error');
    } finally {
      setSavingSlotId(null);
    }
  }

  async function removePlayer(rosterRowId: string) {
    try {
      const { error } = await supabase.from('roster_players').delete().eq('id', rosterRowId);
      if (error) {
        Alert.alert('Could not remove player', error.message);
        return;
      }
      await refresh();
    } catch (err: any) {
      Alert.alert('Could not remove player', err?.message ?? 'Unknown error');
    }
  }

  function filteredResults(slot: RosterSlot) {
    return results.filter(p => {
      if (assignedIds.has(p.id)) return false;
      if (slot.eligiblePositions && !slot.eligiblePositions.includes(p.position)) return false;
      return true;
    });
  }

  function renderManagedSlot(slot: RosterSlot) {
    const row = rosterRows.find(r => r.slot_position === slot.id);
    const isActive = activeSlotId === slot.id;

    if (row) {
      return (
        <View key={slot.id} style={[styles.slotCardFilled, { borderColor: hexWithAlpha(GOLD, 0.3) }]}>
          <View style={[styles.posBadge, { backgroundColor: hexWithAlpha(GOLD, 0.15), borderColor: hexWithAlpha(GOLD, 0.35) }]}>
            <Text style={[styles.posBadgeText, { color: GOLD }]}>{slot.pos}</Text>
          </View>
          <View style={styles.filledInfo}>
            <Text style={styles.filledName}>{row.players.name}</Text>
            <Text style={styles.filledMeta}>{row.players.position} · {row.players.team}</Text>
          </View>
          <TouchableOpacity onPress={() => removePlayer(row.id)} style={styles.removeBtn}>
            <Text style={styles.removeBtnText}>Remove</Text>
          </TouchableOpacity>
        </View>
      );
    }

    const slotResults = isActive ? filteredResults(slot) : [];

    return (
      <View key={slot.id}>
        <TouchableOpacity
          style={[styles.slotCard, isActive && { borderColor: hexWithAlpha(GOLD, 0.5) }]}
          activeOpacity={0.6}
          onPress={() => {
            if (isActive) { setActiveSlotId(null); setQuery(''); }
            else { setActiveSlotId(slot.id); setQuery(''); }
          }}
        >
          <View style={styles.posBadge}>
            <Text style={styles.posBadgeText}>{slot.pos}</Text>
          </View>
          <Text style={styles.slotPrompt}>Add {slot.label}</Text>
        </TouchableOpacity>
        {isActive && (
          <View style={styles.searchBox}>
            <TextInput
              style={styles.searchInput}
              placeholder={`Search ${slot.label}s...`}
              placeholderTextColor="#CCCCCC"
              value={query}
              onChangeText={setQuery}
              autoFocus
            />
            {searching && <Text style={styles.searchHint}>Searching…</Text>}
            {!searching && query.trim().length > 0 && slotResults.length === 0 && (
              <Text style={styles.searchHint}>No matching available players</Text>
            )}
            {savingSlotId === slot.id && <Text style={styles.searchHint}>Saving…</Text>}
            {slotResults.map(p => (
              <TouchableOpacity
                key={p.id}
                style={styles.resultRow}
                disabled={savingSlotId !== null}
                onPress={() => assignPlayer(slot, p)}
              >
                <Text style={styles.resultName}>{p.name}</Text>
                <Text style={styles.resultMeta}>{p.position} · {p.team} · {p.sport}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.topbar}>
        <TouchableOpacity onPress={() => router.replace('/(tabs)')} style={styles.logoWrap}>
          <Image source={logo} style={styles.logo} resizeMode="contain" />
          <Text style={styles.logoText}>Clinched</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.hero}>
        <Text style={[styles.heroLabel, { color: GOLD }]}>Commissioner</Text>
      </View>
      <View style={[styles.divider, { backgroundColor: hexWithAlpha(GOLD, 0.3) }]} />
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.groupLabel}>League Overview</Text>
            <Text style={styles.fillCount}>{profiles.length}/{TEAMS.length} filled</Text>
          </View>
          {TEAMS.map(team => {
            const owner = profiles.find(p => p.team_name === team.name) ?? null;
            const isSelected = selectedTeam === team.name;
            return (
              <TouchableOpacity
                key={team.name}
                style={[
                  styles.teamRow,
                  { backgroundColor: hexWithAlpha(team.color, 0.1) },
                  isSelected && { borderColor: team.color, borderWidth: 1 },
                ]}
                onPress={() => setSelectedTeam(isSelected ? null : team.name)}
              >
                <Text style={[styles.teamName, { color: team.color }]}>{team.name}</Text>
                <Text style={owner ? styles.ownerText : styles.openText}>{owner ? owner.full_name : 'Open'}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.section}>
          <Text style={styles.groupLabel}>Roster Management</Text>
          {!selectedProfile ? (
            <Text style={styles.hintText}>Select a team above to manage its roster.</Text>
          ) : (
            <>
              <Text style={[styles.managingLabel, { color: selectedProfile.team_color }]}>{selectedProfile.team_name}</Text>
              <View style={styles.tabs}>
                {(['NFL', 'NBA', 'MLB'] as const).map(s => (
                  <TouchableOpacity key={s} style={[styles.tab, sport === s && styles.tabOn]} onPress={() => setSport(s)}>
                    <Text style={[styles.tabText, sport === s && styles.tabTextOn]}>{s}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={[styles.groupLabel, styles.groupLabelSpaced]}>Starters</Text>
              {STARTER_SLOTS[sport].map(renderManagedSlot)}

              <Text style={[styles.groupLabel, styles.groupLabelSpaced]}>Bench</Text>
              {BENCH_SLOTS.map(renderManagedSlot)}

              <Text style={[styles.groupLabel, styles.groupLabelSpaced]}>Injured Reserve</Text>
              {IR_SLOTS.map(renderManagedSlot)}
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, backgroundColor:'#0A0A0A' },
  topbar: { paddingHorizontal:24, paddingTop:20, paddingBottom:4 },
  logoWrap: { flexDirection:'row', alignItems:'center' },
  logo: { width:120, height:120 },
  logoText: { fontSize:26, fontWeight:'500', color:'#C9A84C', marginLeft:8, fontFamily:'Orbitron_700Bold' },
  hero: { paddingHorizontal:24, paddingTop:20, paddingBottom:16 },
  heroLabel: { fontSize:15, fontWeight:'600' },
  divider: { height:1, marginHorizontal:24, borderRadius:1 },
  scroll: { flex:1 },
  section: { paddingHorizontal:24, paddingTop:24, paddingBottom:16 },
  sectionHeaderRow: { flexDirection:'row', justifyContent:'space-between', alignItems:'center', marginBottom:10 },
  groupLabel: { fontSize:11, fontWeight:'600', color:'#CCCCCC', letterSpacing:1.5, textTransform:'uppercase' },
  groupLabelSpaced: { marginTop:24, marginBottom:10 },
  fillCount: { fontSize:12, color:'#CCCCCC' },
  teamRow: { flexDirection:'row', alignItems:'center', justifyContent:'space-between', paddingVertical:14, paddingHorizontal:14, borderRadius:10, marginBottom:8, borderWidth:1, borderColor:'transparent' },
  teamName: { fontSize:14, fontWeight:'600' },
  ownerText: { fontSize:13, color:'#fff' },
  openText: { fontSize:13, color:'#CCCCCC' },
  hintText: { fontSize:13, color:'#CCCCCC', marginTop:4 },
  managingLabel: { fontSize:20, fontWeight:'700', fontFamily:'Orbitron_700Bold', marginBottom:16 },
  tabs: { flexDirection:'row', borderBottomWidth:0.5, borderBottomColor:'#222', marginBottom:20 },
  tab: { flex:1, paddingVertical:12, alignItems:'center', borderBottomWidth:2, borderBottomColor:'transparent', marginBottom:-0.5 },
  tabOn: { borderBottomColor:'#C9A84C' },
  tabText: { fontSize:13, color:'#CCCCCC' },
  tabTextOn: { color:'#C9A84C', fontWeight:'500' },
  slotCard: { flexDirection:'row', alignItems:'center', borderWidth:1, borderColor:'rgba(201,168,76,0.18)', borderStyle:'dashed', borderRadius:12, paddingVertical:14, paddingHorizontal:14, marginBottom:10 },
  slotCardFilled: { flexDirection:'row', alignItems:'center', borderWidth:1, borderRadius:12, paddingVertical:14, paddingHorizontal:14, marginBottom:10, backgroundColor:'rgba(201,168,76,0.05)' },
  posBadge: { width:42, paddingVertical:6, borderRadius:8, borderWidth:1, borderColor:'rgba(201,168,76,0.25)', backgroundColor:'rgba(201,168,76,0.1)', alignItems:'center', justifyContent:'center', marginRight:14 },
  posBadgeText: { fontSize:11, fontWeight:'700', letterSpacing:0.5, color:'rgba(201,168,76,0.85)' },
  slotPrompt: { fontSize:14, color:'#CCCCCC', fontWeight:'500' },
  filledInfo: { flex:1 },
  filledName: { fontSize:14, fontWeight:'600', color:'#fff' },
  filledMeta: { fontSize:12, color:'#CCCCCC', marginTop:2 },
  removeBtn: { paddingVertical:6, paddingHorizontal:12, borderRadius:8, borderWidth:0.5, borderColor:'#dc262655' },
  removeBtnText: { fontSize:12, fontWeight:'500', color:'#dc2626' },
  searchBox: { marginTop:-4, marginBottom:14, paddingHorizontal:4 },
  searchInput: { backgroundColor:'#111', borderWidth:0.5, borderColor:'#222', borderRadius:10, padding:12, fontSize:14, color:'#fff', marginBottom:8 },
  searchHint: { fontSize:12, color:'#CCCCCC', paddingVertical:6, textAlign:'center' },
  resultRow: { paddingVertical:10, paddingHorizontal:12, borderRadius:8, backgroundColor:'rgba(201,168,76,0.06)', marginBottom:6 },
  resultName: { fontSize:14, fontWeight:'600', color:'#fff' },
  resultMeta: { fontSize:12, color:'#CCCCCC', marginTop:2 },
});
