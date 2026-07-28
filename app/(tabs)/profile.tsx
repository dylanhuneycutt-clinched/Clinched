import { StyleSheet, Text, View, TouchableOpacity, Image, ScrollView } from 'react-native';
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
      <View style={styles.header}>
        <Text style={[styles.teamName, { color: teamColor }]}>{teamName}</Text>
        <Text style={styles.fullName}>{fullName}</Text>
      </View>

      <ScrollView style={styles.rulesScroll} contentContainerStyle={styles.rulesContent} showsVerticalScrollIndicator={true}>
        <Text style={styles.rulesTitle}>League Rules</Text>

        <Text style={[styles.ruleSectionHeader, styles.ruleSectionHeaderFirst]}>Buy-In</Text>
        <Text style={styles.ruleParagraph}>
          Each manager must pay a $100 buy-in to participate. Full payment is required before the draft. Payment details will be communicated by the commissioner.
        </Text>

        <Text style={styles.ruleSectionHeader}>League Overview</Text>
        <Text style={styles.ruleParagraph}>
          Clinched is a unified multi-sport fantasy league covering NFL, NBA, and MLB. Each manager drafts players from all three sports in a single snake draft and manages three separate teams throughout the year.
        </Text>
        <View style={styles.bulletList}>
          <Text style={styles.ruleBullet}>•  12 managers total</Text>
          <Text style={styles.ruleBullet}>•  Each manager controls one NFL team, one NBA team, and one MLB team</Text>
          <Text style={styles.ruleBullet}>•  All three sports are drafted together in one unified snake draft</Text>
          <Text style={styles.ruleBullet}>•  Draft order is randomly assigned</Text>
        </View>

        <Text style={styles.ruleSectionHeader}>Roster Construction</Text>
        <Text style={styles.ruleParagraph}><Text style={styles.ruleLabel}>NFL — 8 Starters, 3 Bench, 1 IR: </Text>QB, QB, RB, RB, WR, WR, TE, TE</Text>
        <Text style={styles.ruleParagraph}><Text style={styles.ruleLabel}>NBA — 8 Starters, 3 Bench, 1 IR: </Text>G, G, F, F, C, UT, UT, UT</Text>
        <Text style={styles.ruleParagraph}><Text style={styles.ruleLabel}>MLB — 8 Starters, 3 Bench, 1 IR: </Text>C, 1B, 2B, SS, 3B, OF, OF, OF</Text>
        <Text style={styles.ruleParagraph}>
          A player may only be placed on IR if they are officially listed as Out or IR by their team.
        </Text>

        <Text style={styles.ruleSectionHeader}>Scoring</Text>
        <Text style={styles.ruleParagraph}>
          <Text style={styles.ruleLabel}>NFL — Full PPR: </Text>
          Passing Yard: 0.04 pts, Passing TD: +4, INT: -2, Rushing Yard: 0.1, Rushing TD: +6, Reception: +1, Receiving Yard: 0.1, Receiving TD: +6, Fumble Lost: -2, 2-Point Conversion: +2, Kick/Punt Return TD: +6. No defense or kicker scoring.
        </Text>
        <Text style={styles.ruleParagraph}>
          <Text style={styles.ruleLabel}>NBA — Standard: </Text>
          Point: +1, Rebound: +1.25, Assist: +1.5, Steal: +2, Block: +2, Turnover: -1
        </Text>
        <Text style={styles.ruleParagraph}>
          <Text style={styles.ruleLabel}>MLB — Standard: </Text>
          Single: +1, Double: +2, Triple: +3, Home Run: +4, RBI: +1, Run Scored: +1, Walk: +1, HBP: +1, Stolen Base: +2, Strikeout: -1, Caught Stealing: 0. Hitters only, no pitching scoring.
        </Text>

        <Text style={styles.ruleSectionHeader}>Season Format</Text>
        <Text style={styles.ruleParagraph}>
          All three sports use head-to-head weekly matchups. This league covers the 2026-27 NFL and NBA seasons and the 2027 MLB season.
        </Text>
        <Text style={styles.ruleParagraph}>
          <Text style={styles.ruleLabel}>NFL: </Text>
          Regular Season Weeks 1-13, Trade Deadline end of Week 12, Playoffs Week 14 (R1), Week 15 (Semi), Weeks 16-17 (Championship)
        </Text>
        <Text style={styles.ruleParagraph}>
          <Text style={styles.ruleLabel}>NBA: </Text>
          Regular Season Weeks 1-17, Trade Deadline end of Week 16, Playoffs Week 18 (R1), Week 19 (Semi), Weeks 20-21 (Championship)
        </Text>
        <Text style={styles.ruleParagraph}>
          <Text style={styles.ruleLabel}>MLB: </Text>
          Season runs through the All-Star break (2027 schedule TBD). Same 6-team playoff structure. Championship is the two weeks leading up to the All-Star break.
        </Text>
        <Text style={styles.ruleParagraph}>
          Top 6 teams qualify for playoffs. Seeds 1 and 2 receive first round byes. Round 1: Seeds 3v6 and 4v5. Tiebreaker: total points scored during regular season.
        </Text>

        <Text style={styles.ruleSectionHeader}>Waiver Wire & Free Agents</Text>
        <Text style={styles.ruleParagraph}>
          <Text style={styles.ruleLabel}>NFL: </Text>
          Dropped players go to waivers immediately. Waivers process Tuesday night into Wednesday morning. Priority goes to the lowest scoring team from the previous week. After waivers clear, unclaimed players become free agents. Once you use a waiver claim you drop to the bottom of the priority order.
        </Text>
        <Text style={styles.ruleParagraph}>
          <Text style={styles.ruleLabel}>NBA & MLB: </Text>
          Dropped players go to waivers for 24 hours. Any team can claim during that window. After 24 hours unclaimed players become free agents available instantly. Players cannot be added while actively playing in a game.
        </Text>

        <Text style={styles.ruleSectionHeader}>Trades</Text>
        <Text style={styles.ruleParagraph}>
          Trades can be made between any two managers at any time during the regular season. Cross-sport trades are allowed. Trade deadline is 2 weeks before each sport's playoff start. Clinched does not natively have the feature to vote on trades as they occur (yet). If you question the integrity of a trade, bring the concern to the commissioner and a vote will occur.
        </Text>

        <Text style={styles.ruleSectionHeader}>Grand Champion</Text>
        <Text style={styles.ruleParagraph}>
          Determined at end of full season including playoffs. Each manager receives ranking points based on final finishing position in each sport. Lowest combined total wins.
        </Text>
        <Text style={styles.ruleParagraph}>
          <Text style={styles.ruleLabel}>Ranking Points: </Text>
          1st=1, 2nd=3, 3rd=4, 4th=4, 5th=5, 6th=5, 7th=6, 8th=6, 9th=6, 10th=7, 11th=7, 12th=7
        </Text>
        <Text style={[styles.ruleParagraph, styles.ruleLabel]}>Example:</Text>
        <Text style={styles.ruleParagraph}>Manager A: 5th in NFL (5pts) + Last in NBA (7pts) + 2nd in MLB (3pts) = 15 points</Text>
        <Text style={styles.ruleParagraph}>Manager B: 1st in NFL (1pt) + 9th in NBA (6pts) + 4th in MLB (4pts) = 11 points</Text>
        <Text style={styles.ruleParagraph}>Manager B wins. Lower score wins.</Text>
        <Text style={styles.ruleParagraph}>
          Grand Champion standings are live on the Standings tab and update all season long.
        </Text>

        <Text style={styles.ruleSectionHeader}>Prize Structure</Text>
        <Text style={styles.ruleParagraph}>
          Total pot: $1,300 ($100 buy-in x 12 managers, plus $100 penalty from the previous season's last place finisher)
        </Text>
        <Text style={styles.ruleParagraph}>Grand Champion 1st: $350, Grand Champion 2nd: $150, Grand Champion 3rd: $50</Text>
        <Text style={styles.ruleParagraph}>NFL Champion: $250, NBA Champion: $250, MLB Champion: $250</Text>
      </ScrollView>

      <TouchableOpacity style={styles.signOutBtn} onPress={handleSignOut}>
        <Text style={styles.signOutText}>Sign out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, backgroundColor:'#0A0A0A' },
  topbar: { paddingHorizontal:24, paddingTop:20, paddingBottom:4 },
  logoWrap: { flexDirection:'row', alignItems:'center' },
  logo: { width:120, height:120 },
  logoText: { fontSize:26, fontWeight:'500', color:'#C9A84C', marginLeft:8, fontFamily:'Orbitron_700Bold' },
  header: { alignItems:'center', paddingHorizontal:24, paddingTop:12, paddingBottom:16 },
  teamName: { fontSize:28, fontWeight:'700', fontFamily:'Orbitron_700Bold', textAlign:'center' },
  fullName: { fontSize:15, color:'#CCCCCC', marginTop:10, textAlign:'center' },
  rulesScroll: { flex:1 },
  rulesContent: { paddingHorizontal:24, paddingBottom:24 },
  rulesTitle: { fontSize:18, fontWeight:'700', color:'#C9A84C', marginBottom:4, fontFamily:'Orbitron_700Bold' },
  ruleSectionHeader: { fontSize:13, fontWeight:'700', color:'#C9A84C', letterSpacing:1, textTransform:'uppercase', marginTop:20, marginBottom:8 },
  ruleSectionHeaderFirst: { marginTop:12 },
  ruleParagraph: { fontSize:13, color:'#CCCCCC', lineHeight:19, marginBottom:10 },
  ruleLabel: { fontWeight:'700', color:'#fff' },
  bulletList: { marginBottom:10 },
  ruleBullet: { fontSize:13, color:'#CCCCCC', lineHeight:19, marginBottom:4 },
  signOutBtn: { marginHorizontal:24, marginBottom:40, borderRadius:10, borderWidth:0.5, borderColor:'#dc262655', padding:16, alignItems:'center' },
  signOutText: { fontSize:14, fontWeight:'500', color:'#dc2626' },
});
