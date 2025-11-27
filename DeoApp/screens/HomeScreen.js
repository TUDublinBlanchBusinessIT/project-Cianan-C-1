// screens/HomeScreen.js
import * as React from 'react';
import { View, Text, Button } from 'react-native';

export default function HomeScreen({ navigation }) {
  return (
    <View style={{ flex: 1, padding: 20, justifyContent: 'center' }}>
      <Text style={{ fontSize: 32, fontWeight: 'bold', marginBottom: 40 }}>
        Deo
      </Text>

      <Button
        title="Prayer List"
        onPress={() => navigation.navigate('PrayerList')}
      />

      <Button
        title="Prayer Checklist"
        onPress={() => navigation.navigate('Checklist')}
      />

      <Button
        title="Reflections"
        onPress={() => navigation.navigate('Reflection')}
      />

      <Button
        title="Prayer Inspiration"
        onPress={() => navigation.navigate('Inspiration')}
      />
    </View>
  );
}
