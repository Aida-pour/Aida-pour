import React, { useState, useRef } from 'react';
import { View, TextInput, FlatList, KeyboardAvoidingView, Platform, TouchableOpacity, Text, StyleSheet } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

interface Message { id: string; role: 'user' | 'assistant'; content: string; }

export default function CompanionScreen() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const flatListRef = useRef<FlatList>(null);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    try {
      const res = await fetch(`${process.env.EXPO_PUBLIC_AI_URL}/companion/chat`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: 'current', user_id: 'user', message: input, language: 'en', history: messages.slice(-10).map(m => ({ role: m.role, content: m.content })), stream: false }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, { id: (Date.now()+1).toString(), role: 'assistant', content: data.content }]);
    } catch (e) { console.error(e); }
  };

  return (
    <LinearGradient colors={['#1A1040', '#2D1B5E']} style={{ flex: 1 }}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <View style={{ padding: 20, paddingTop: 60, alignItems: 'center' }}>
          <Text style={{ color: '#C6963A', fontSize: 22, fontWeight: 'bold' }}>Simorgh</Text>
          <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>Your AI Companion</Text>
        </View>
        <FlatList ref={flatListRef} data={messages} keyExtractor={item => item.id} contentContainerStyle={{ padding: 16 }}
          renderItem={({ item }) => (
            <Animated.View entering={FadeInDown.duration(300)} style={[{ maxWidth: '80%', borderRadius: 20, padding: 14, marginVertical: 6 }, item.role === 'user' ? { backgroundColor: '#C6963A', alignSelf: 'flex-end' } : { backgroundColor: 'rgba(255,255,255,0.08)', alignSelf: 'flex-start' }]}>
              <Text style={{ color: 'white', fontSize: 16 }}>{item.content}</Text>
            </Animated.View>
          )} />
        <View style={{ flexDirection: 'row', padding: 16, gap: 8, alignItems: 'flex-end' }}>
          <TextInput value={input} onChangeText={setInput} placeholder="Write here..." placeholderTextColor="rgba(255,255,255,0.4)" style={{ flex: 1, backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 24, padding: 14, color: 'white', fontSize: 16 }} multiline />
          <TouchableOpacity onPress={sendMessage} style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: '#C6963A', justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ color: '#1A1040', fontSize: 22, fontWeight: 'bold' }}>\u2192</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}
