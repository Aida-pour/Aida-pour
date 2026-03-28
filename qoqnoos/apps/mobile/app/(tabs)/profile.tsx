import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
export default function ProfileScreen() {
  return (
    <LinearGradient colors={['#1A1040', '#2D1B5E']} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ padding: 20, paddingTop: 60 }}>
        <View style={{ alignItems: 'center', marginBottom: 32 }}>
          <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: '#C6963A', justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ color: '#1A1040', fontSize: 32, fontWeight: 'bold' }}>Q</Text>
          </View>
          <Text style={{ color: 'white', fontSize: 22, fontWeight: 'bold', marginTop: 12 }}>User</Text>
          <Text style={{ color: '#C6963A', fontSize: 14, marginTop: 4 }}>Free Plan</Text>
        </View>
        {['Edit Profile','Subscription','Language','Wellness Profile','Notifications','Help & Support'].map(item => (
          <TouchableOpacity key={item} style={{ backgroundColor: 'rgba(255,255,255,0.06)', padding: 18, borderRadius: 12, marginBottom: 2 }}>
            <Text style={{ color: 'white', fontSize: 16 }}>{item}</Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity style={{ backgroundColor: 'rgba(255,50,50,0.1)', padding: 18, borderRadius: 12, marginTop: 20 }}>
          <Text style={{ color: '#ff6b6b', fontSize: 16 }}>Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
}
