import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useFonts, Orbitron_700Bold } from '@expo-google-fonts/orbitron';
import { supabase } from '../../supabase';
import { useProfile } from '../../hooks/use-profile';

const logo = require('../../assets/images/logo1.png');

export default function ProfileScreen() {
  const router = useRouter();
  const { profile } = useProfile();
  const [fontsLoaded] = useFonts({ Orbitron_700Bold });
  if (!fontsLoaded) return <View style={{flex:1, backgroundColor:'#0A0A0A'}} />;

  const teamName = profile?.team_name ?? 'My Team';
  const teamColor = profile?.team_color ?? '#C9A84C';
  const fullName = profile?.full_name ?? '';

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.replace('/(tabs)/login');
  }

  return (
    <View style={styles.container}>
      <View style={styles.topbar}>
        <TouchableOpacity onPress={() => router.replace('/(tabs)')} style={styles.logoWrap}>
          <Image source={logo} style={styles.logo} resizeMode="contain" />
          <Text style={styles.logoText}>Clinched</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.content}>
        <Text style={[styles.teamName, { color: teamColor }]}>{teamName}</Text>
        <Text style={styles.fullName}>{fullName}</Text>
      </View>
      <TouchableOpacity style={styles.signOutBtn} onPress={handleSignOut}>
        <Text style={styles.signOutText}>Sign out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, backgroundColor:'#0A0A0A' },
  topbar: { paddingHorizontal:24, paddingTop:60, paddingBottom:4 },
  logoWrap: { flexDirection:'row', alignItems:'center' },
  logo: { width:120, height:120 },
  logoText: { fontSize:22, fontWeight:'500', color:'#C9A84C', marginLeft:8, fontFamily:'Orbitron_700Bold' },
  content: { flex:1, alignItems:'center', justifyContent:'center', paddingHorizontal:24 },
  teamName: { fontSize:28, fontWeight:'700', fontFamily:'Orbitron_700Bold', textAlign:'center' },
  fullName: { fontSize:15, color:'#CCCCCC', marginTop:10, textAlign:'center' },
  signOutBtn: { marginHorizontal:24, marginBottom:40, borderRadius:10, borderWidth:0.5, borderColor:'#dc262655', padding:16, alignItems:'center' },
  signOutText: { fontSize:14, fontWeight:'500', color:'#dc2626' },
});
