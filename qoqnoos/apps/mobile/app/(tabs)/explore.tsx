import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
const categories = [{name:'Meditations',icon:'\ud83e\uddd8',count:24},{name:'Breathwork',icon:'\ud83c\udf2c\ufe0f',count:12},{name:'Sound Baths',icon:'\ud83d\udd14',count:8},{name:'Podcasts',icon:'\ud83c\udfa4',count:15},{name:'Books',icon:'\ud83d\udcda',count:20},{name:'Workshops',icon:'\ud83c\udf93',count:6}];
export default function ExploreScreen() {
  return (
    <LinearGradient colors={['#1A1040', '#2D1B5E']} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ padding: 20, paddingTop: 60 }}>
        <Text style={{ color: 'white', fontSize: 28, fontWeight: 'bold' }}>Explore</Text>
        <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14, marginTop: 4, marginBottom: 24 }}>Discover healing content</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
          {categories.map(c => (
            <TouchableOpacity key={c.name} style={{ backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: 16, padding: 20, width: '47%' }}>
              <Text style={{ fontSize: 32, marginBottom: 8 }}>{c.icon}</Text>
              <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>{c.name}</Text>
              <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, marginTop: 4 }}>{c.count} items</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </LinearGradient>
  );
}
