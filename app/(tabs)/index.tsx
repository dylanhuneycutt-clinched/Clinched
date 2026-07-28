import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useFonts, Orbitron_400Regular, Orbitron_700Bold } from '@expo-google-fonts/orbitron';
import { View as LoadingView } from 'react-native';
import { useProfile } from '../../hooks/use-profile';
import { hexWithAlpha } from '../../constants/color';

const logo = require('../../assets/images/logo1.png');

export default function HomeScreen() {
  const router = useRouter();
  const { profile } = useProfile();
  const [fontsLoaded] = useFonts({ Orbitron_400Regular, Orbitron_700Bold });
  if (!fontsLoaded) return <LoadingView style={{flex:1, backgroundColor:'#0A0A0A'}} />;

  const teamName = profile?.team_name ?? 'My Team';
  const teamColor = profile?.team_color ?? '#C9A84C';

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.topbar}>
          <TouchableOpacity onPress={() => router.replace('/(tabs)')} style={styles.logoWrap}>
            <Image source={logo} style={styles.logo} resizeMode="contain" />
            <Text style={styles.logoText}>Clinched</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.hero}>
          <Text style={styles.heroLabel}>My team</Text>
          <Text style={[styles.heroNum, { color: teamColor }]}>{teamName}</Text>
          <Text style={styles.heroSub}>Season hasn't started yet</Text>
        </View>
        <View style={[styles.divider, { backgroundColor: hexWithAlpha(teamColor, 0.3) }]} />
        <View style={styles.section}>
          <View style={[styles.emptyCard, { borderColor: hexWithAlpha(teamColor, 0.2) }]}>
            <Text style={styles.emptyTitle}>Season hasn't started yet</Text>
            <Text style={styles.emptyBody}>Matchups, scores, and standings will show up here once the season kicks off.</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, backgroundColor:'#0A0A0A' },
  scroll: { flex:1 },
  topbar: { flexDirection:'row', justifyContent:'space-between', alignItems:'center', paddingHorizontal:24, paddingTop:20, paddingBottom:4 },
  logoWrap: { flexDirection:'row', alignItems:'center' },
  logo: { width:120, height:120 },
  logoText: { fontSize:26, fontWeight:'500', color:'#C9A84C', marginLeft:8, fontFamily:'Orbitron_700Bold' },
  hero: { paddingHorizontal:24, paddingTop:20, paddingBottom:24 },
  heroLabel: { fontSize:13, color:'#CCCCCC', marginBottom:6 },
  heroNum: { fontSize:40, fontWeight:'700', letterSpacing:-1, fontFamily:'Orbitron_700Bold' },
  heroSub: { fontSize:13, color:'#CCCCCC', marginTop:10 },
  divider: { height:1, marginHorizontal:24, borderRadius:1 },
  section: { paddingHorizontal:24, paddingTop:24 },
  emptyCard: { borderWidth:0.5, borderRadius:14, padding:24, alignItems:'center' },
  emptyTitle: { fontSize:15, fontWeight:'600', color:'#fff', marginBottom:8, textAlign:'center' },
  emptyBody: { fontSize:13, color:'#CCCCCC', textAlign:'center', lineHeight:19 },
});
