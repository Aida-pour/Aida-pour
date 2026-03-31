import { Tabs } from 'expo-router';
import { Text } from 'react-native';
export default function TabLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false, tabBarStyle: { backgroundColor: '#1A1040', borderTopColor: 'rgba(198,150,58,0.2)', height: 80 }, tabBarActiveTintColor: '#C6963A', tabBarInactiveTintColor: 'rgba(255,255,255,0.4)' }}>
      <Tabs.Screen name="index" options={{ title: 'Home', tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 24 }}>\u{1F3E0}</Text> }} />
      <Tabs.Screen name="companion" options={{ title: 'Simorgh', tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 24 }}>\u{1F985}</Text> }} />
      <Tabs.Screen name="journal" options={{ title: 'Journal', tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 24 }}>\u{1F4DD}</Text> }} />
      <Tabs.Screen name="explore" options={{ title: 'Explore', tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 24 }}>\u{1F50D}</Text> }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile', tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 24 }}>\u{1F464}</Text> }} />
    </Tabs>
  );
}
