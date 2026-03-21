import { StyleSheet, Text, View, ScrollView } from 'react-native';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.topbar}>
          <Text style={styles.wordmark}>Clinched</Text>
          <Text style={styles.week}>Week 8</Text>
        </View>
        <View style={styles.hero}>
          <Text style={styles.heroLabel}>My cumulative score</Text>
          <Text style={styles.heroNum}>4,148</Text>
          <Text style={styles.heroSub}>143 behind the lead</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>THIS WEEK</Text>
          <View style={styles.sportRow}>
            <View style={styles.sportLeft}>
              <View style={[styles.dot, {backgroundColor:'#C9A84C'}]} />
              <View>
                <Text style={styles.sportName}>NFL</Text>
                <Text style={styles.sportDetail}>Live · vs Gridiron FC</Text>
              </View>
            </View>
            <View style={styles.sportRight}>
              <Text style={styles.sportPts}>94 – 81</Text>
              <Text style={[styles.sportPtsLabel, {color:'#C9A84C'}]}>Winning</Text>
            </View>
          </View>
          <View style={styles.sportRow}>
            <View style={styles.sportLeft}>
              <View style={[styles.dot, {backgroundColor:'#C9A84C'}]} />
              <View>
                <Text style={styles.sportName}>NBA</Text>
                <Text style={styles.sportDetail}>Live · vs Bench Bros</Text>
              </View>
            </View>
            <View style={styles.sportRight}>
              <Text style={styles.sportPts}>210 – 238</Text>
              <Text style={[styles.sportPtsLabel, {color:'#dc2626'}]}>Trailing</Text>
            </View>
          </View>
          <View style={styles.sportRow}>
            <View style={styles.sportLeft}>
              <View style={[styles.dot, {backgroundColor:'#C9A84C'}]} />
              <View>
                <Text style={styles.sportName}>MLB</Text>
                <Text style={styles.sportDetail}>Season total · Wk 14 of 16</Text>
              </View>
            </View>
            <View style={styles.sportRight}>
              <Text style={styles.sportPts}>1,847</Text>
              <Text style={styles.sportPtsLabel}>2nd place</Text>
            </View>
          </View>
        </View>
        <View style={styles.champBanner}>
          <View>
            <Text style={styles.champLabel}>Grand champion</Text>
            <Text style={styles.champRank}>2nd</Text>
            <Text style={styles.champLabel}>of 8 managers</Text>
          </View>
          <View style={{alignItems:'flex-end'}}>
            <Text style={[styles.champRank, {color:'#dc2626'}]}>–143</Text>
            <Text style={styles.champLabel}>behind Bench Bros</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, backgroundColor:'#0A0A0A' },
  scroll: { flex:1 },
  topbar: { flexDirection:'row', justifyContent:'space-between', alignItems:'center', paddingHorizontal:24, paddingTop:60, paddingBottom:8 },
  wordmark: { fontSize:17, fontWeight:'500', letterSpacing:-0.5, color:'#C9A84C' },
  week: { fontSize:13, color:'#555' },
  hero: { paddingHorizontal:24, paddingTop:28, paddingBottom:24 },
  heroLabel: { fontSize:13, color:'#555', marginBottom:6 },
  heroNum: { fontSize:48, fontWeight:'500', letterSpacing:-2, color:'#fff' },
  heroSub: { fontSize:13, color:'#dc2626', marginTop:6 },
  divider: { height:0.5, backgroundColor:'#222', marginHorizontal:24 },
  section: { paddingHorizontal:24, paddingTop:24 },
  sectionLabel: { fontSize:11, fontWeight:'500', letterSpacing:0.6, color:'#444', marginBottom:16 },
  sportRow: { flexDirection:'row', justifyContent:'space-between', alignItems:'center', paddingVertical:16, borderBottomWidth:0.5, borderBottomColor:'#1a1a1a' },
  sportLeft: { flexDirection:'row', alignItems:'center', gap:14 },
  dot: { width:7, height:7, borderRadius:4 },
  sportName: { fontSize:15, fontWeight:'500', color:'#fff' },
  sportDetail: { fontSize:12, color:'#555', marginTop:2 },
  sportRight: { alignItems:'flex-end' },
  sportPts: { fontSize:15, fontWeight:'500', color:'#fff' },
  sportPtsLabel: { fontSize:11, color:'#555', marginTop:2 },
  champBanner: { margin:24, backgroundColor:'#111', borderRadius:14, padding:20, flexDirection:'row', justifyContent:'space-between', alignItems:'center', borderWidth:0.5, borderColor:'#C9A84C33' },
  champLabel: { fontSize:11, color:'#555', marginBottom:3 },
  champRank: { fontSize:28, fontWeight:'500', letterSpacing:-1, color:'#C9A84C' },
});