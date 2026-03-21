import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { useState } from 'react';

const waivers: { [key:string]: { pos:string; name:string; meta:string }[] } = {
  NFL: [
    { pos:'WR', name:'Puka Nacua', meta:'LAR · 84% owned · 18.4 pts/wk' },
    { pos:'RB', name:'Gus Edwards', meta:'LAC · 61% owned · 12.1 pts/wk' },
    { pos:'TE', name:'Cole Kmet', meta:'CHI · 42% owned · 9.8 pts/wk' },
    { pos:'QB', name:'Jordan Love', meta:'GB · 38% owned · 22.1 pts/wk' },
  ],
  NBA: [
    { pos:'G', name:'Tyrese Haliburton', meta:'IND · 71% owned · 42.0 pts/wk' },
    { pos:'F', name:'OG Anunoby', meta:'NYK · 55% owned · 31.5 pts/wk' },
    { pos:'C', name:'Brook Lopez', meta:'MIL · 48% owned · 28.0 pts/wk' },
  ],
  MLB: [
    { pos:'OF', name:'Luis Robert Jr.', meta:'CHW · 62% owned · 18.4 pts/wk' },
    { pos:'SS', name:'Elly De La Cruz', meta:'CIN · 54% owned · 21.1 pts/wk' },
    { pos:'1B', name:'Vinnie Pasquantino', meta:'KC · 41% owned · 14.8 pts/wk' },
  ],
};

export default function WaiversScreen() {
  const [sport, setSport] = useState('NFL');
  const players = waivers[sport];

  return (
    <View style={styles.container}>
      <View style={styles.topbar}>
        <Text style={styles.wordmark}>Waivers</Text>
      </View>
      <View style={styles.tabs}>
        {['NFL','NBA','MLB'].map(s => (
          <TouchableOpacity key={s} style={[styles.tab, sport===s && styles.tabOn]} onPress={() => setSport(s)}>
            <Text style={[styles.tabText, sport===s && styles.tabTextOn]}>{s}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          {players.map((p, i) => (
            <View key={i} style={styles.row}>
              <View style={styles.left}>
                <Text style={styles.pos}>{p.pos}</Text>
                <View>
                  <Text style={styles.name}>{p.name}</Text>
                  <Text style={styles.meta}>{p.meta}</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.addBtn}>
                <Text style={styles.addText}>Add</Text>
              </TouchableOpacity>
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
  tabText: { fontSize:13, color:'#444' },
  tabTextOn: { color:'#C9A84C', fontWeight:'500' },
  scroll: { flex:1 },
  section: { paddingHorizontal:24, paddingBottom:40 },
  row: { flexDirection:'row', alignItems:'center', justifyContent:'space-between', paddingVertical:14, borderBottomWidth:0.5, borderBottomColor:'#161616' },
  left: { flexDirection:'row', alignItems:'center', gap:12 },
  pos: { fontSize:10, fontWeight:'500', color:'#444', width:22, textAlign:'center' },
  name: { fontSize:14, fontWeight:'500', color:'#fff' },
  meta: { fontSize:11, color:'#555', marginTop:2 },
  addBtn: { paddingHorizontal:14, paddingVertical:6, borderWidth:0.5, borderColor:'#C9A84C55', borderRadius:20 },
  addText: { fontSize:12, color:'#C9A84C' },
});