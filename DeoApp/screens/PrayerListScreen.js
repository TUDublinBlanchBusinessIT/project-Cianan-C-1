import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from 'react-native';

export default function PrayerListScreen() {
  const [prayers, setPrayers] = useState([]);
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');

  const addPrayer = () => {
    if (!title.trim() || !text.trim()) {
      return;
    }

    const newPrayer = {
      id: Date.now().toString(),
      title: title.trim(),
      text: text.trim(),
    };

    setPrayers(prev => [newPrayer, ...prev]);
    setTitle('');
    setText('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Your Prayers</Text>

      <TextInput
        style={styles.input}
        placeholder="Prayer Title"
        value={title}
        onChangeText={setTitle}
      />

      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Prayer Text"
        value={text}
        onChangeText={setText}
        multiline
      />

      <TouchableOpacity style={styles.addButton} onPress={addPrayer}>
        <Text style={styles.addButtonText}>Add Prayer</Text>
      </TouchableOpacity>

      <FlatList
        data={prayers}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.prayerItem}>
            <Text style={styles.prayerTitle}>{item.title}</Text>
            <Text style={styles.prayerText}>{item.text}</Text>
          </View>
        )}
        style={{ marginTop: 20 }}
      />
    </View>
  );
}

const GOLD = '#FFD700';
const PURPLE = '#6A0DAD';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFF',
  },
  header: {
    fontSize: 28,
    fontWeight: '700',
    color: PURPLE,
    marginBottom: 20,
  },
  input: {
    borderWidth: 2,
    borderColor: GOLD,
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  textArea: {
    height: 100,
  },
  addButton: {
    backgroundColor: '#FFF',
    borderWidth: 2,
    borderColor: GOLD,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  addButtonText: {
    color: PURPLE,
    fontWeight: '600',
  },
  prayerItem: {
    borderWidth: 2,
    borderColor: GOLD,
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  prayerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: PURPLE,
    marginBottom: 6,
  },
  prayerText: {
    fontSize: 14,
  },
});
