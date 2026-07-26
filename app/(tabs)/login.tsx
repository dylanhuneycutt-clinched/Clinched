import { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '../../supabase';
import { TEAMS } from '../../constants/teams';
import { useFonts, Orbitron_700Bold } from '@expo-google-fonts/orbitron';

const logo = require('../../assets/images/logo1.png');

export default function LoginScreen() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fontsLoaded] = useFonts({ Orbitron_700Bold });
  if (!fontsLoaded) return <View style={{flex:1, backgroundColor:'#0A0A0A'}} />;

  async function handleAuth() {
    setLoading(true);
    if (isSignUp) {
      // Team assignment happens atomically in a DB trigger (see
      // supabase/migrations) so it can't race with other signups. This is
      // just an early, friendly check to avoid calling signUp when we
      // already know every slot is taken.
      const { count } = await supabase.from('profiles').select('team_name', { count: 'exact', head: true });
      if ((count ?? 0) >= TEAMS.length) {
        alert('League is full');
        setLoading(false);
        return;
      }

      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName } }
      });
      if (error) {
        alert(error.message.includes('Database error') ? 'League is full' : error.message);
      } else {
        alert('Check your email to confirm your account');
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) alert(error.message);
      else router.replace('/(tabs)');
    }
    setLoading(false);
  }

  return (
    <View style={styles.container}>
      <View style={styles.logoWrap}>
        <Image source={logo} style={styles.logo} resizeMode="contain" />
        <Text style={styles.logoText}>Clinched</Text>
      </View>
      <View style={styles.inner}>
        <Text style={styles.tagline}>{isSignUp ? 'Create your account' : 'Welcome back'}</Text>
        {isSignUp && (
          <TextInput style={styles.input} placeholder="Full name" placeholderTextColor="#444" value={fullName} onChangeText={setFullName} autoCapitalize="words" />
        )}
        <TextInput style={styles.input} placeholder="Email" placeholderTextColor="#444" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
        <TextInput style={styles.input} placeholder="Password" placeholderTextColor="#444" value={password} onChangeText={setPassword} secureTextEntry />
        <TouchableOpacity style={[styles.btn, loading && styles.btnDim]} onPress={handleAuth} disabled={loading}>
          <Text style={styles.btnText}>{loading ? 'Please wait...' : isSignUp ? 'Create account' : 'Sign in'}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setIsSignUp(!isSignUp)} style={styles.switchBtn}>
          <Text style={styles.switchText}>{isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, backgroundColor:'#0A0A0A', justifyContent:'center' },
  logoWrap: { alignItems:'center', marginBottom:32 },
  logo: { width:200, height:200 },
  logoText: { fontSize:16, fontWeight:'500', color:'#C9A84C', letterSpacing:4, marginTop:8, fontFamily:'Orbitron_700Bold' },
  inner: { paddingHorizontal:32 },
  tagline: { fontSize:14, color:'#555', marginBottom:32, textAlign:'center' },
  input: { backgroundColor:'#111', borderWidth:0.5, borderColor:'#222', borderRadius:10, padding:14, fontSize:14, color:'#fff', marginBottom:12 },
  btn: { backgroundColor:'#C9A84C', borderRadius:10, padding:16, alignItems:'center', marginTop:8 },
  btnDim: { opacity:0.5 },
  btnText: { fontSize:14, fontWeight:'500', color:'#0A0A0A' },
  switchBtn: { alignItems:'center', marginTop:20 },
  switchText: { fontSize:13, color:'#555' },
});