import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function JournalScreen() {
  const [entry, setEntry] = useState('');
  return (
    <LinearGradient colors={['#1A1040', '#2D1B5E']} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ padding: 20, paddingTop: 60 }}>
        <Text style={{ color: 'white', fontSize: 28, fontWeight: 'bold' }}>Journal</Text>
        <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14, marginTop: 4, marginBottom: 24 }}>Write freely. Simorgh will reflect with you.</Text>
        <TextInput value={entry} onChangeText={setEntry} placeholder="What's on your mind today?" placeholderTextColor="rgba(255,255,255,0.3)" style={{ backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: 16, padding: 20, color: 'white', fontSize: 16, minHeight: 200, textAlignVertical: 'top' }} multiline />
        <TouchableOpacity onPress={() => setEntry('')} style={{ backgroundColor: '#C6963A', borderRadius: 30, padding: 16, alignItems: 'center', marginTop: 20 }}>
          <Text style={{ color: '#1A1040', fontSize: 16, fontWeight: 'bold' }}>Save & Get AI Reflection</Text>
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
}
