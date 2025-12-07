// screens/ChecklistScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Switch } from 'react-native';

import { db } from '../firebaseConfig';
import {
  collection,
  onSnapshot,
  addDoc,
  doc,
  updateDoc,
} from 'firebase/firestore';

const GOLD = '#FFD700';
const PURPLE = '#6A0DAD';
const USER_ID = 'demoUser'; // same as HomeScreen

const DEFAULT_ITEMS = [
  { label: 'Morning Prayer' },
  { label: 'Rosary' },
  { label: 'Examination of Conscience' },
  { label: 'Night Prayer' },
];

export default function ChecklistScreen() {
  const [items, setItems] = useState([]);

  const checklistRef = collection(db, 'users', USER_ID, 'checklist');

  // Seed defaults if checklist is empty
  const seedDefaults = async () => {
    for (const item of DEFAULT_ITEMS) {
      await addDoc(checklistRef, {
        label: item.label,
        done: false,
      });
    }
  };

  useEffect(() => {
    const unsubscribe = onSnapshot(checklistRef, async (snapshot) => {
      if (snapshot.empty) {
        // first time: create default items
        await seedDefaults();
        return;
      }

      const list = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));

      setItems(list);
    });

    return unsubscribe;
  }, []);

  const toggleItem = async (id, currentValue) => {
    const itemRef = doc(db, 'users', USER_ID, 'checklist', id);
    await updateDoc(itemRef, { done: !currentValue });
    // no need to manually set state – onSnapshot will fire again
  };

  const completedCount = items.filter((item) => item.done).length;

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Today&apos;s Prayer Checklist</Text>
      <Text style={styles.subHeader}>
        {completedCount} / {items.length} prayers completed
      </Text>

      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        style={{ marginTop: 20 }}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text style={[styles.label, item.done && styles.labelDone]}>
              {item.label}
            </Text>
            <Switch
              value={item.done}
              onValueChange={() => toggleItem(item.id, item.done)}
              trackColor={{ false: '#ccc', true: GOLD }}
              thumbColor={item.done ? PURPLE : '#f4f3f4'}
            />
          </View>
        )}
      />

      <Text style={styles.hint}>
        Use this page like Ella in your scenario: check each prayer after you finish it.
      </Text>
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
    fontSize: 24,
    fontWeight: '700',
    color: PURPLE,
  },
  subHeader: {
    marginTop: 4,
    fontSize: 14,
    color: '#555',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  label: {
    fontSize: 16,
  },
  labelDone: {
    textDecorationLine: 'line-through',
    color: '#888',
  },
  hint: {
    marginTop: 20,
    fontSize: 12,
    color: '#666',
  },
});
