import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { useFonts, Orbitron_700Bold } from '@expo-google-fonts/orbitron';
import { TEAMS } from '../../constants/teams';
import { hexWithAlpha } from '../../constants/color';
import { useProfile } from '../../hooks/use-profile';
import { useProfiles } from '../../hooks/use-profiles';

const logo = require('../../assets/images/logo1.png');

const TABS = ['overall', 'NFL', 'NBA', 'MLB'] as const;
type Tab = typeof TABS[number];

function ownerLabel(fullName: string) {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '';
  if (parts.length === 1) return parts[0];
  return `${parts[0]} ${parts[parts.length - 1][0]}.`;
}

export default function StandingsScreen() {
  const [tab, setTab] = useState<Tab>('overall');
  const router = useRouter();
  const { profile } = useProfile();
  const { profiles } = useProfiles();
  const [fontsLoaded] = useFonts({ Orbitron_700Bold });
  if (!fontsLoaded) return <View style={{flex:1, backgroundColor:'#0A0A0A'}} />;

  const showRecord = tab === 'NFL' || tab === 'NBA';
  const slots = TEAMS.map(team => ({
    ...team,
    owner: profiles.find(p => p.team_name === team.name) ?? null,
  }));

  return (
    <View style={styles.container}>
      <View style={styles.topbar}>
        <TouchableOpacity onPress={() => router.replace('/(tabs)')} style={styles.logoWrap}>
          <Image source={logo} style={styles.logo} resizeMode="contain" />
          <Text style={styles.logoText}>Clinched</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.tabs}>
        {TABS.map(t => (
          <TouchableOpacity key={t} style={[styles.tab, tab===t && styles.tabOn]} onPress={() => setTab(t)}>
            <Text style={[styles.tabText, tab===t && styles.tabTextOn]}>{t === 'overall' ? 'Overall' : t}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <View style={styles.headerRow}>
            <Text style={styles.headerName}>Team</Text>
            <Text style={styles.headerPts}>{showRecord ? 'Record · Pts' : 'Points'}</Text>
          </View>
          {slots.map(slot => {
            const isMe = profile?.team_name === slot.name;
            return (
              <View key={slot.name} style={[styles.row, { backgroundColor: hexWithAlpha(slot.color, 0.1) }]}>
                <View style={styles.nameWrap}>
                  <View style={styles.nameLine}>
                    <Text style={[styles.name, { color: slot.color }]}>{slot.name}</Text>
                    {isMe && <Text style={styles.you}>you</Text>}
                  </View>
                  <Text style={styles.owner}>{slot.owner ? ownerLabel(slot.owner.full_name) : 'Open'}</Text>
                </View>
                {showRecord ? (
                  <View style={styles.ptsWrap}>
                    <Text style={styles.record}>0-0</Text>
                    <Text style={styles.ptsSub}>0 pts</Text>
                  </View>
                ) : (
                  <Text style={styles.pts}>0</Text>
                )}
              </View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, backgroundColor:'#0A0A0A' },
  topbar: { paddingHorizontal:24, paddingTop:60, paddingBottom:8 },
  logoWrap: { alignItems:'flex-start' },
  logo: { width:120, height:120 },
  logoText: { fontSize:11, fontWeight:'500', color:'#C9A84C', letterSpacing:2, marginTop:2, fontFamily:'Orbitron_700Bold' },
  tabs: { flexDirection:'row', borderBottomWidth:0.5, borderBottomColor:'#222', marginHorizontal:24 },
  tab: { flex:1, paddingVertical:12, alignItems:'center', borderBottomWidth:2, borderBottomColor:'transparent', marginBottom:-0.5 },
  tabOn: { borderBottomColor:'#C9A84C' },
  tabText: { fontSize:12, color:'#444' },
  tabTextOn: { color:'#C9A84C', fontWeight:'500' },
  scroll: { flex:1 },
  section: { paddingHorizontal:24, paddingBottom:40 },
  headerRow: { flexDirection:'row', alignItems:'center', justifyContent:'space-between', paddingVertical:10, borderBottomWidth:0.5, borderBottomColor:'#1a1a1a' },
  headerName: { fontSize:11, color:'#333' },
  headerPts: { fontSize:11, color:'#333' },
  row: { flexDirection:'row', alignItems:'center', justifyContent:'space-between', paddingVertical:14, paddingHorizontal:12, borderRadius:10, marginTop:8 },
  nameWrap: { flex:1 },
  nameLine: { flexDirection:'row', alignItems:'center', gap:8 },
  name: { fontSize:14, fontWeight:'600' },
  you: { fontSize:11, color:'#666' },
  owner: { fontSize:12, color:'#666', marginTop:3 },
  pts: { fontSize:15, fontWeight:'500', color:'#fff' },
  ptsWrap: { alignItems:'flex-end' },
  record: { fontSize:15, fontWeight:'500', color:'#fff' },
  ptsSub: { fontSize:11, color:'#666', marginTop:2 },
});
