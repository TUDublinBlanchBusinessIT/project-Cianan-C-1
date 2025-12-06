// screens/ReflectionScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from 'react-native';

const GOLD = '#FFD700';
const PURPLE = '#6A0DAD';

export default function ReflectionScreen() {
  const [entryText, setEntryText] = useState('');
  const [entries, setEntries] = useState([]);

  const addEntry = () => {
    if (!entryText.trim()) return;

    const newEntry = {
      id: Date.now().toString(),
      text: entryText.trim(),
      date: new Date().toLocaleString(),
    };

    setEntries(prev => [newEntry, ...prev]);
    setEntryText('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Daily Reflection</Text>
      <Text style={styles.subHeader}>
        Write your thoughts, struggles, or spiritual wins.
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Write your reflection here..."
        multiline
        value={entryText}
        onChangeText={setEntryText}
      />

      <TouchableOpacity style={styles.addButton} onPress={addEntry}>
        <Text style={styles.addButtonText}>Save Reflection</Text>
      </TouchableOpacity>

      <FlatList
        data={entries}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.entryCard}>
            <Text style={styles.entryDate}>{item.date}</Text>
            <Text style={styles.entryText}>{item.text}</Text>
          </View>
        )}
        style={{ marginTop: 20 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    padding: 20,
  },
  header: {
    fontSize: 26,
    fontWeight: '700',
    color: PURPLE,
  },
  subHeader: {
    marginBottom: 10,
    color: '#444',
  },
  input: {
    height: 120,
    borderWidth: 2,
    borderColor: GOLD,
    borderRadius: 10,
    padding: 10,
    textAlignVertical: 'top',
    backgroundColor: '#FFF',
    marginTop: 10,
  },
  addButton: {
    marginTop: 10,
    backgroundColor: '#FFF',
    borderWidth: 2,
    borderColor: GOLD,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  addButtonText: {
    fontWeight: '600',
    fontSize: 16,
    color: PURPLE
  },
  entryCard: {
    padding: 14,
    borderWidth: 2,
    borderColor: GOLD,
    borderRadius: 10,
    marginBottom: 10,
  },
  entryDate: {
    fontSize: 12,
    color: '#777',
    marginBottom: 6,
  },
  entryText: {
    fontSize: 14,
    lineHeight: 20,
  },
});
