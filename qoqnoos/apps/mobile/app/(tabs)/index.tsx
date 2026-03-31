import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';

export default function HomeScreen() {
  return (
    <LinearGradient colors={['#1A1040', '#2D1B5E']} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ padding: 20, paddingTop: 60 }}>
        <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 16 }}>Welcome back</Text>
        <Text style={{ color: '#C6963A', fontSize: 36, fontWeight: 'bold', marginTop: 4, marginBottom: 24 }}>\u0642\u0642\u0646\u0648\u0633</Text>
        <View style={{ backgroundColor: 'rgba(198,150,58,0.1)', borderRadius: 16, padding: 20, borderLeftWidth: 4, borderLeftColor: '#C6963A', marginBottom: 32 }}>
          <Text style={{ color: '#C6963A', fontSize: 18, textAlign: 'right', marginBottom: 8 }}>\u0632\u062e\u0645 \u062c\u0627\u06cc\u06cc \u0627\u0633\u062a \u06a9\u0647 \u0646\u0648\u0631 \u0627\u0632 \u0622\u0646 \u0648\u0627\u0631\u062f \u0645\u06cc\u200c\u0634\u0648\u062f</Text>
          <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14, fontStyle: 'italic' }}>"The wound is where the light enters." \u2014 Rumi</Text>
        </View>
        <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold', marginBottom: 16 }}>Continue Your Journey</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 32 }}>
          {[{t:'Talk to Simorgh',s:'AI Companion',r:'/companion'},{t:'Journal',s:'Write & Reflect',r:'/journal'},{t:'Meditate',s:'Guided Session'},{t:'Library',s:'Books & Podcasts'}].map(a => (
            <TouchableOpacity key={a.t} onPress={() => a.r && router.push(a.r as any)} style={{ backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: 16, padding: 16, width: '47%' }}>
              <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>{a.t}</Text>
              <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, marginTop: 2 }}>{a.s}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </LinearGradient>
  );
}
