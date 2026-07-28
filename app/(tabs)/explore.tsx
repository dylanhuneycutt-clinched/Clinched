import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { useFonts, Orbitron_700Bold } from '@expo-google-fonts/orbitron';
import { useProfile } from '../../hooks/use-profile';
import { hexWithAlpha } from '../../constants/color';
import { STARTER_SLOTS, BENCH_SLOTS, IR_SLOTS, RosterSlot, Sport } from '../../constants/rosters';

const logo = require('../../assets/images/logo1.png');

export default function TeamsScreen() {
  const [sport, setSport] = useState<Sport>('NFL');
  const router = useRouter();
  const { profile } = useProfile();
  const [fontsLoaded] = useFonts({ Orbitron_700Bold });
  if (!fontsLoaded) return <View style={{flex:1, backgroundColor:'#0A0A0A'}} />;

  const teamName = profile?.team_name ?? 'My Team';
  const teamColor = profile?.team_color ?? '#C9A84C';

  const renderSlot = (slot: RosterSlot) => (
    <TouchableOpacity
      key={slot.id}
      style={[
        styles.slotCard,
        { borderColor: hexWithAlpha(teamColor, 0.18), backgroundColor: hexWithAlpha(teamColor, 0.03) },
      ]}
      activeOpacity={0.6}
    >
      <View style={[styles.posBadge, { backgroundColor: hexWithAlpha(teamColor, 0.1), borderColor: hexWithAlpha(teamColor, 0.25) }]}>
        <Text style={[styles.posBadgeText, { color: hexWithAlpha(teamColor, 0.85) }]}>{slot.pos}</Text>
      </View>
      <Text style={styles.slotPrompt}>Add {slot.label}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.topbar}>
        <TouchableOpacity onPress={() => router.replace('/(tabs)')} style={styles.logoWrap}>
          <Image source={logo} style={styles.logo} resizeMode="contain" />
          <Text style={styles.logoText}>Clinched</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.tabs}>
        {(['NFL','NBA','MLB'] as const).map(s => (
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
          <Text style={styles.groupLabel}>Starters</Text>
          {STARTER_SLOTS[sport].map(renderSlot)}

          <Text style={[styles.groupLabel, styles.groupLabelSpaced]}>Bench</Text>
          {BENCH_SLOTS.map(renderSlot)}

          <Text style={[styles.groupLabel, styles.groupLabelSpaced]}>Injured Reserve</Text>
          {IR_SLOTS.map(renderSlot)}
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
  groupLabel: { fontSize:11, fontWeight:'600', color:'#CCCCCC', letterSpacing:1.5, textTransform:'uppercase', marginBottom:10 },
  groupLabelSpaced: { marginTop:24 },
  slotCard: { flexDirection:'row', alignItems:'center', borderWidth:1, borderStyle:'dashed', borderRadius:12, paddingVertical:14, paddingHorizontal:14, marginBottom:10 },
  posBadge: { width:42, paddingVertical:6, borderRadius:8, borderWidth:1, alignItems:'center', justifyContent:'center', marginRight:14 },
  posBadgeText: { fontSize:11, fontWeight:'700', letterSpacing:0.5 },
  slotPrompt: { fontSize:14, color:'#CCCCCC', fontWeight:'500' },
});
