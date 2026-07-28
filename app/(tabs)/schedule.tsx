import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useCallback, useState } from 'react';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { useFonts, Orbitron_700Bold } from '@expo-google-fonts/orbitron';
import { useProfile } from '../../hooks/use-profile';
import { supabase } from '../../supabase';
import { hexWithAlpha } from '../../constants/color';
import { TEAMS } from '../../constants/teams';
import { Sport } from '../../constants/rosters';

const logo = require('../../assets/images/logo1.png');

type MatchupRow = {
  id: string;
  week: number;
  home_team: string;
  away_team: string;
  home_score: number;
  away_score: number;
  is_complete: boolean;
};

function teamColorFor(name: string): string {
  return TEAMS.find(t => t.name === name)?.color ?? '#C9A84C';
}

export default function ScheduleScreen() {
  const router = useRouter();
  const { profile } = useProfile();
  const [fontsLoaded] = useFonts({ Orbitron_700Bold });
  const [sport, setSport] = useState<Sport>('NFL');
  const [matchups, setMatchups] = useState<MatchupRow[]>([]);

  const loadSchedule = useCallback(async () => {
    if (!profile?.team_name) { setMatchups([]); return; }
    const { data } = await supabase
      .from('matchups')
      .select('id, week, home_team, away_team, home_score, away_score, is_complete')
      .eq('sport', sport)
      .order('week', { ascending: true });
    const mine = (data ?? []).filter(
      (m: any) => m.home_team === profile.team_name || m.away_team === profile.team_name
    );
    setMatchups(mine as MatchupRow[]);
  }, [profile?.team_name, sport]);

  useFocusEffect(useCallback(() => { loadSchedule(); }, [loadSchedule]));

  if (!fontsLoaded) return <View style={{ flex:1, backgroundColor:'#0A0A0A' }} />;

  const teamColor = profile?.team_color ?? '#C9A84C';

  return (
    <View style={styles.container}>
      <View style={styles.topbar}>
        <TouchableOpacity onPress={() => router.replace('/(tabs)')} style={styles.logoWrap}>
          <Image source={logo} style={styles.logo} resizeMode="contain" />
          <Text style={styles.logoText}>Clinched</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.tabs}>
        {(['NFL', 'NBA'] as const).map(s => (
          <TouchableOpacity key={s} style={[styles.tab, sport === s && styles.tabOn]} onPress={() => setSport(s)}>
            <Text style={[styles.tabText, sport === s && styles.tabTextOn]}>{s}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.hero}>
        <Text style={[styles.heroLabel, { color: teamColor }]}>Schedule · {sport}</Text>
      </View>
      <View style={[styles.divider, { backgroundColor: hexWithAlpha(teamColor, 0.3) }]} />
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          {matchups.length === 0 ? (
            <Text style={styles.hintText}>No schedule has been generated yet.</Text>
          ) : (
            matchups.map(m => {
              const isHome = m.home_team === profile?.team_name;
              const opponent = isHome ? m.away_team : m.home_team;
              const myScore = isHome ? m.home_score : m.away_score;
              const oppScore = isHome ? m.away_score : m.home_score;
              return (
                <View key={m.id} style={styles.row}>
                  <Text style={styles.weekLabel}>Week {m.week}</Text>
                  <Text style={[styles.opponentName, { color: teamColorFor(opponent) }]}>{opponent}</Text>
                  <Text style={styles.scoreText}>{m.is_complete ? `${myScore} - ${oppScore}` : '—'}</Text>
                </View>
              );
            })
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
  tabs: { flexDirection:'row', borderBottomWidth:0.5, borderBottomColor:'#222', marginHorizontal:24 },
  tab: { flex:1, paddingVertical:12, alignItems:'center', borderBottomWidth:2, borderBottomColor:'transparent', marginBottom:-0.5 },
  tabOn: { borderBottomColor:'#C9A84C' },
  tabText: { fontSize:13, color:'#CCCCCC' },
  tabTextOn: { color:'#C9A84C', fontWeight:'500' },
  hero: { paddingHorizontal:24, paddingTop:20, paddingBottom:16 },
  heroLabel: { fontSize:15, fontWeight:'600' },
  divider: { height:1, marginHorizontal:24, borderRadius:1 },
  scroll: { flex:1 },
  section: { paddingHorizontal:24, paddingTop:24, paddingBottom:40 },
  hintText: { fontSize:13, color:'#CCCCCC', textAlign:'center', marginTop:20 },
  row: { flexDirection:'row', alignItems:'center', justifyContent:'space-between', paddingVertical:14, paddingHorizontal:14, borderRadius:10, marginBottom:8, backgroundColor:'rgba(255,255,255,0.03)' },
  weekLabel: { fontSize:12, color:'#CCCCCC', width:64 },
  opponentName: { fontSize:14, fontWeight:'600', flex:1 },
  scoreText: { fontSize:14, fontWeight:'600', color:'#fff' },
});
