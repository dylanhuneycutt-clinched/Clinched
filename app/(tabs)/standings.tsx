import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { useState } from 'react';

type Row = { rank:number; name:string; pts:string; me:boolean };
type Data = { [key:string]: Row[] };

const data: Data = {
  overall: [
    { rank:1, name:'Bench Bros', pts:'4,291', me:false },
    { rank:2, name:'The Dynasty', pts:'4,148', me:true },
    { rank:3, name:'Waiver Warrior', pts:'3,974', me:false },
    { rank:4, name:'Field Goals', pts:'3,810', me:false },
    { rank:5, name:'Triple Threat', pts:'3,745', me:false },
    { rank:6, name:'Gridiron FC', pts:'3,631', me:false },
    { rank:7, name:'The Studs', pts:'3,542', me:false },
    { rank:8, name:'Snake Charmer', pts:'3,362', me:false },
  ],
  NFL: [
    { rank:1, name:'Bench Bros', pts:'6–1', me:false },
    { rank:2, name:'The Dynasty', pts:'5–2', me:true },
    { rank:3, name:'Waiver Warrior', pts:'5–2', me:false },
    { rank:4, name:'Field Goals', pts:'4–3', me:false },
    { rank:5, name:'Triple Threat', pts:'4–3', me:false },
    { rank:6, name:'Gridiron FC', pts:'3–4', me:false },
    { rank:7, name:'The Studs', pts:'2–5', me:false },
    { rank:8, name:'Snake Charmer', pts:'1–6', me:false },
  ],
  NBA: [
    { rank:1, name:'Bench Bros', pts:'2–1', me:false },
    { rank:2, name:'Waiver Warrior', pts:'2–1', me:false },
    { rank:3, name:'The Dynasty', pts:'1–2', me:true },
    { rank:4, name:'Triple Threat', pts:'1–2', me:false },
    { rank:5, name:'Field Goals', pts:'1–2', me:false },
    { rank:6, name:'Gridiron FC', pts:'1–2', me:false },
    { rank:7, name:'The Studs', pts:'1–2', me:false },
    { rank:8, name:'Snake Charmer', pts:'0–3', me:false },
  ],
  MLB: [
    { rank:1, name:'Bench Bros', pts:'1,891', me:false },
    { rank:2, name:'The Dynasty', pts:'1,847', me:true },
    { rank:3, name:'Waiver Warrior', pts:'1,820', me:false },
    { rank:4, name:'Field Goals', pts:'1,778', me:false },
    { rank:5, name:'Triple Threat', pts:'1,740', me:false },
    { rank:6, name:'Gridiron FC', pts:'1,712', me:false },
    { rank:7, name:'The Studs', pts:'1,680', me:false },
    { rank:8, name:'Snake Charmer', pts:'1,604', me:false },
  ],
};

export default function StandingsScreen() {
  const [tab, setTab] = useState('overall');
  const rows = data[tab];

  return (
    <View style={styles.container}>
      <View style={styles.topbar}>
        <Text style={styles.wordmark}>Standings</Text>
      </View>
      <View style={styles.tabs}>
        {['overall','NFL','NBA','MLB'].map(t => (
          <TouchableOpacity key={t} style={[styles.tab, tab===t && styles.tabOn]} onPress={() => setTab(t)}>
            <Text style={[styles.tabText, tab===t && styles.tabTextOn]}>{t === 'overall' ? 'Overall' : t}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <View style={styles.headerRow}>
            <Text style={styles.headerRank}>#</Text>
            <Text style={styles.headerName}>Team</Text>
            <Text style={styles.headerPts}>{tab === 'NFL' || tab === 'NBA' ? 'Record' : 'Points'}</Text>
          </View>
          {rows.map((r) => (
            <View key={r.rank} style={[styles.row, r.me && styles.rowMe]}>
              <Text style={[styles.rank, r.me && styles.rankMe]}>{r.rank}</Text>
              <View style={styles.nameWrap}>
                <Text style={[styles.name, r.me && styles.nameMe]}>{r.name}</Text>
                {r.me && <Text style={styles.you}>you</Text>}
              </View>
              <Text style={[styles.pts, r.me && styles.ptsMe]}>{r.pts}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, backgroundColor:'#0A0A0A' },
  topbar: { paddingHorizontal:24, paddingTop:60, paddingBottom:16 },
  wordmark: { fontSize:17, fontWeight:'500', letterSpacing:-0.5, color:'#C9A84C' },
  tabs: { flexDirection:'row', borderBottomWidth:0.5, borderBottomColor:'#222', marginHorizontal:24 },
  tab: { flex:1, paddingVertical:12, alignItems:'center', borderBottomWidth:2, borderBottomColor:'transparent', marginBottom:-0.5 },
  tabOn: { borderBottomColor:'#C9A84C' },
  tabText: { fontSize:12, color:'#444' },
  tabTextOn: { color:'#C9A84C', fontWeight:'500' },
  scroll: { flex:1 },
  section: { paddingHorizontal:24, paddingBottom:40 },
  headerRow: { flexDirection:'row', alignItems:'center', paddingVertical:10, borderBottomWidth:0.5, borderBottomColor:'#1a1a1a' },
  headerRank: { fontSize:11, color:'#333', width:24 },
  headerName: { flex:1, fontSize:11, color:'#333' },
  headerPts: { fontSize:11, color:'#333' },
  row: { flexDirection:'row', alignItems:'center', paddingVertical:14, borderBottomWidth:0.5, borderBottomColor:'#161616' },
  rowMe: { backgroundColor:'#111' },
  rank: { fontSize:13, color:'#444', width:24 },
  rankMe: { color:'#C9A84C' },
  nameWrap: { flex:1, flexDirection:'row', alignItems:'center', gap:8 },
  name: { fontSize:14, color:'#888' },
  nameMe: { fontWeight:'500', color:'#fff' },
  you: { fontSize:11, color:'#444' },
  pts: { fontSize:14, color:'#888' },
  ptsMe: { fontWeight:'500', color:'#C9A84C' },
});