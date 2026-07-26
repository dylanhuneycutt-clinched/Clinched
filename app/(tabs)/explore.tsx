import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { useFonts, Orbitron_700Bold } from '@expo-google-fonts/orbitron';
import { useProfile } from '../../hooks/use-profile';
import { hexWithAlpha } from '../../constants/color';

const logo = require('../../assets/images/logo1.png');

export default function TeamsScreen() {
  const [sport, setSport] = useState('NFL');
  const router = useRouter();
  const { profile } = useProfile();
  const [fontsLoaded] = useFonts({ Orbitron_700Bold });
  if (!fontsLoaded) return <View style={{flex:1, backgroundColor:'#0A0A0A'}} />;

  const teamName = profile?.team_name ?? 'My Team';
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
        {['NFL','NBA','MLB'].map(s => (
          <TouchableOpacity key={s} style={[styles.tab, sport===s && styles.tabOn]} onPress={() => setSport(s)}>
            <Text style={[styles.tabText, sport===s && styles.tabTextOn]}>{s}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.hero}>
        <Text style={[styles.heroLabel, { color: teamColor }]}>{teamName} · {sport}</Text>
      </View>
      <View style={[styles.divider, { backgroundColor: hexWithAlpha(teamColor, 0.3) }]} />
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <View style={[styles.emptyCard, { borderColor: hexWithAlpha(teamColor, 0.2) }]}>
            <Text style={styles.emptyTitle}>Season starting soon</Text>
            <Text style={styles.emptyBody}>Your {sport} roster will appear here once the draft happens and the season begins.</Text>
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
  heroLabel: { fontSize:15, fontWeight:'600' },
  divider: { height:1, marginHorizontal:24, borderRadius:1 },
  scroll: { flex:1 },
  section: { paddingHorizontal:24, paddingTop:24, paddingBottom:40 },
  emptyCard: { borderWidth:0.5, borderRadius:14, padding:24, alignItems:'center' },
  emptyTitle: { fontSize:15, fontWeight:'600', color:'#fff', marginBottom:8, textAlign:'center' },
  emptyBody: { fontSize:13, color:'#666', textAlign:'center', lineHeight:19 },
});
