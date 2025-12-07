// screens/ReflectionScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from 'react-native';

import { auth, db } from '../firebaseConfig';
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';

const GOLD = '#FFD700';
const PURPLE = '#6A0DAD';

export default function ReflectionScreen() {
  const [entryText, setEntryText] = useState('');
  const [entries, setEntries] = useState([]);

  const uid = auth.currentUser?.uid;
  if (!uid) return null;

  useEffect(() => {
    const reflectionsRef = collection(db, 'users', uid, 'reflections');
    const q = query(reflectionsRef, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setEntries(list);
    });

    return unsubscribe;
  }, [uid]);

  const addEntry = async () => {
    if (!entryText.trim()) return;

    const reflectionsRef = collection(db, 'users', uid, 'reflections');

    await addDoc(reflectionsRef, {
      text: entryText.trim(),
      createdAt: serverTimestamp(),
    });

    setEntryText('');
  };

  const renderItem = ({ item }) => {
    let dateString = '';
    if (item.createdAt && item.createdAt.toDate) {
      dateString = item.createdAt.toDate().toLocaleString();
    }

    return (
      <View style={styles.entryCard}>
        <Text style={styles.entryDate}>{dateString}</Text>
        <Text style={styles.entryText}>{item.text}</Text>
      </View>
    );
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
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        style={{ marginTop: 20 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF', padding: 20 },
  header: { fontSize: 26, fontWeight: '700', color: PURPLE },
  subHeader: { marginBottom: 10, color: '#444' },
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
  addButtonText: { fontWeight: '600', fontSize: 16, color: PURPLE },
  entryCard: {
    padding: 14,
    borderWidth: 2,
    borderColor: GOLD,
    borderRadius: 10,
    marginBottom: 10,
  },
  entryDate: { fontSize: 12, color: '#777', marginBottom: 6 },
  entryText: { fontSize: 14, lineHeight: 20 },
});
