import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { useFonts, Orbitron_700Bold } from '@expo-google-fonts/orbitron';

const logo = require('../../assets/images/logo1.png');

type Player = { pos:string; name:string; meta:string; pts:string; good?:boolean; bad?:boolean; dim?:boolean; bench?:boolean };

const rosters: { [key:string]: Player[] } = {
  NFL: [
    { pos:'QB', name:'Patrick Mahomes', meta:'KC · QB', pts:'32.4', good:true },
    { pos:'RB', name:'Christian McCaffrey', meta:'SF · RB', pts:'28.1', good:true },
    { pos:'RB', name:'Breece Hall', meta:'NYJ · RB', pts:'14.6' },
    { pos:'WR', name:'Justin Jefferson', meta:'MIN · WR', pts:'19.2', good:true },
    { pos:'WR', name:'Stefon Diggs', meta:'HOU · WR · Questionable', pts:'0.0', bad:true },
    { pos:'TE', name:'Travis Kelce', meta:'KC · TE', pts:'16.4', good:true },
    { pos:'FX', name:'Tyreek Hill', meta:'MIA · WR', pts:'11.3' },
    { pos:'FX', name:'Davante Adams', meta:'LV · WR', pts:'9.8' },
    { bench:true, pos:'', name:'', meta:'', pts:'' },
    { pos:'BN', name:'Jonathan Taylor', meta:'IND · RB', pts:'7.4', dim:true },
    { pos:'BN', name:'Garrett Wilson', meta:'NYJ · WR', pts:'12.5', dim:true },
  ],
  NBA: [
    { pos:'G', name:'Stephen Curry', meta:'GSW · PG', pts:'62.0', good:true },
    { pos:'G', name:'Luka Doncic', meta:'DAL · PG', pts:'58.5', good:true },
    { pos:'F', name:'Giannis A.', meta:'MIL · PF', pts:'71.5', good:true },
    { pos:'F', name:'Jayson Tatum', meta:'BOS · SF', pts:'44.0' },
    { pos:'C', name:'Nikola Jokic', meta:'DEN · C · Out tonight', pts:'0.0', bad:true },
    { pos:'UT', name:'Kevin Durant', meta:'PHX · SF', pts:'38.5' },
    { pos:'UT', name:'Devin Booker', meta:'PHX · SG', pts:'35.5' },
    { pos:'UT', name:'Bam Adebayo', meta:'MIA · C', pts:'41.0' },
    { bench:true, pos:'', name:'', meta:'', pts:'' },
    { pos:'BN', name:'Anthony Edwards', meta:'MIN · SG', pts:'39.0', dim:true },
    { pos:'BN', name:'Paul George', meta:'PHI · SF', pts:'27.5', dim:true },
  ],
  MLB: [
    { pos:'C', name:'Sean Murphy', meta:'ATL · C', pts:'198.5' },
    { pos:'1B', name:'Shohei Ohtani', meta:'LAD · 1B', pts:'412.0', good:true },
    { pos:'2B', name:'José Altuve', meta:'HOU · 2B', pts:'223.0' },
    { pos:'SS', name:'Corey Seager', meta:'TEX · SS', pts:'245.5' },
    { pos:'3B', name:'Nolan Arenado', meta:'STL · 3B', pts:'211.0' },
    { pos:'OF', name:'Ronald Acuña Jr.', meta:'ATL · OF', pts:'387.5', good:true },
    { pos:'OF', name:'Mookie Betts', meta:'LAD · OF', pts:'301.0' },
    { pos:'OF', name:'Michael Harris II', meta:'ATL · OF', pts:'268.0' },
    { bench:true, pos:'', name:'', meta:'', pts:'' },
    { pos:'BN', name:'Francisco Lindor', meta:'NYM · SS', pts:'229.0', dim:true },
    { pos:'BN', name:'Trea Turner', meta:'PHI · SS', pts:'198.5', dim:true },
  ],
};

const totals: { [key:string]: string } = { NFL:'131.8', NBA:'351.0', MLB:'2,246.5' };

export default function TeamsScreen() {
  const [sport, setSport] = useState('NFL');
  const players = rosters[sport];
  const router = useRouter();
  const [fontsLoaded] = useFonts({ Orbitron_700Bold });
  if (!fontsLoaded) return <View style={{flex:1, backgroundColor:'#0A0A0A'}} />;

  return (
    <View style={styles.container}>
      <View style={styles.topbar}>
        <TouchableOpacity onPress={() => router.replace('/(tabs)')} style={styles.logoWrap}>
          <Image source={logo} style={styles.logo} resizeMode="contain" />
          <Text style={styles.logoText}>Clinched</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.tabs}>
        {['NFL','NBA','MLB'].map(s => (
          <TouchableOpacity key={s} style={[styles.tab, sport===s && styles.tabOn]} onPress={() => setSport(s)}>
            <Text style={[styles.tabText, sport===s && styles.tabTextOn]}>{s}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.hero}>
        <Text style={styles.heroLabel}>The Dynasty · {sport}</Text>
        <Text style={styles.heroNum}>{totals[sport]}</Text>
        <Text style={styles.heroSub}>pts this week</Text>
      </View>
      <View style={styles.divider} />
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          {players.map((p, i) => {
            if (p.bench) return <Text key={i} style={styles.benchLabel}>Bench</Text>;
            return (
              <View key={i} style={styles.playerRow}>
                <View style={styles.playerLeft}>
                  <Text style={styles.pos}>{p.pos}</Text>
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>{p.name.split(' ').map((w:string)=>w[0]).join('').slice(0,2)}</Text>
                  </View>
                  <View>
                    <Text style={styles.playerName}>{p.name}</Text>
                    <Text style={styles.playerMeta}>{p.meta}</Text>
                  </View>
                </View>
                <Text style={[styles.pts, p.good && styles.ptsGood, p.bad && styles.ptsBad, p.dim && styles.ptsDim]}>{p.pts}</Text>
              </View>
            );
          })}
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Starters total</Text>
            <Text style={styles.totalPts}>{totals[sport]}</Text>
          </View>
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
  tabText: { fontSize:13, color:'#444' },
  tabTextOn: { color:'#C9A84C', fontWeight:'500' },
  hero: { paddingHorizontal:24, paddingTop:20, paddingBottom:16 },
  heroLabel: { fontSize:13, color:'#555', marginBottom:4 },
  heroNum: { fontSize:36, fontWeight:'500', letterSpacing:-1.5, color:'#fff' },
  heroSub: { fontSize:12, color:'#555', marginTop:4 },
  divider: { height:0.5, backgroundColor:'#222', marginHorizontal:24 },
  scroll: { flex:1 },
  section: { paddingHorizontal:24, paddingBottom:40 },
  benchLabel: { fontSize:10, color:'#333', paddingTop:12, paddingBottom:4, letterSpacing:0.4, textTransform:'uppercase' },
  playerRow: { flexDirection:'row', alignItems:'center', justifyContent:'space-between', paddingVertical:13, borderBottomWidth:0.5, borderBottomColor:'#161616' },
  playerLeft: { flexDirection:'row', alignItems:'center', gap:12 },
  pos: { fontSize:10, fontWeight:'500', color:'#444', width:22, textAlign:'center' },
  avatar: { width:34, height:34, borderRadius:17, backgroundColor:'#161616', alignItems:'center', justifyContent:'center' },
  avatarText: { fontSize:11, fontWeight:'500', color:'#555' },
  playerName: { fontSize:14, fontWeight:'500', color:'#fff' },
  playerMeta: { fontSize:11, color:'#555', marginTop:1 },
  pts: { fontSize:14, fontWeight:'500', color:'#fff' },
  ptsGood: { color:'#C9A84C' },
  ptsBad: { color:'#dc2626' },
  ptsDim: { color:'#333' },
  totalRow: { flexDirection:'row', justifyContent:'space-between', alignItems:'baseline', paddingTop:18 },
  totalLabel: { fontSize:12, color:'#555' },
  totalPts: { fontSize:20, fontWeight:'500', letterSpacing:-0.5, color:'#C9A84C' },
});