import { Tabs } from 'expo-router';
import { View } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          borderTopWidth: 0.5,
          borderTopColor: '#1a1a1a',
          height: 80,
          paddingBottom: 16,
          paddingTop: 8,
          backgroundColor: '#0A0A0A',
        },
        tabBarActiveTintColor: '#C9A84C',
        tabBarInactiveTintColor: '#444',
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '500',
        },
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Home', tabBarIcon: ({ focused }) => (<View style={{ width:20, height:18, borderWidth:1.5, borderColor: focused ? '#C9A84C' : '#444', borderRadius:3, marginTop:4 }} />) }} />
      <Tabs.Screen name="explore" options={{ title: 'Teams', tabBarIcon: ({ focused }) => (<View style={{ gap:3, marginTop:4 }}>{[0,1,2].map(i => (<View key={i} style={{ width:16, height:1.5, backgroundColor: focused ? '#C9A84C' : '#444', borderRadius:1 }} />))}</View>) }} />
      <Tabs.Screen name="standings" options={{ title: 'Standings', tabBarIcon: ({ focused }) => (<View style={{ flexDirection:'row', alignItems:'flex-end', gap:2, marginTop:4 }}>{[10,16,12].map((h,i) => (<View key={i} style={{ width:5, height:h, backgroundColor: focused ? '#C9A84C' : '#444', borderRadius:1 }} />))}</View>) }} />
      <Tabs.Screen name="waivers" options={{ title: 'Waivers', tabBarIcon: ({ focused }) => (<View style={{ width:18, height:18, borderRadius:9, borderWidth:1.5, borderColor: focused ? '#C9A84C' : '#444', marginTop:4, alignItems:'center', justifyContent:'center' }}><View style={{ width:1.5, height:6, backgroundColor: focused ? '#C9A84C' : '#444', borderRadius:1, marginBottom:1 }} /><View style={{ width:1.5, height:1.5, backgroundColor: focused ? '#C9A84C' : '#444', borderRadius:1 }} /></View>) }} />
      <Tabs.Screen name="login" options={{ href: null }} />
    </Tabs>
  );
}