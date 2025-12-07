// screens/InspirationScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  Alert,
  Share,
} from 'react-native';

import { auth, db } from '../firebaseConfig';
import {
  collection,
  addDoc,
  onSnapshot,
  doc,
  updateDoc,
  query,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';

const GOLD = '#FFD700';
const PURPLE = '#6A0DAD';

const DEFAULT_PRAYERS = [
  {
    title: 'Short Morning Offering',
    text: 'Lord, I offer You this day, all my thoughts, words, actions, joys and sufferings, in union with Your Sacred Heart.',
  },
  {
    title: 'Prayer Before Study',
    text: 'Holy Spirit, guide my mind as I study. Help me to understand, remember, and use this knowledge for Your glory.',
  },
  {
    title: 'Prayer for Patience',
    text: 'Jesus, meek and humble of heart, make my heart like Yours. Give me patience with others and with myself.',
  },
];

export default function InspirationScreen() {
  const [prayers, setPrayers] = useState([]);
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [editingId, setEditingId] = useState(null);

  const uid = auth.currentUser?.uid;
  if (!uid) return null;

  const inspirationsRef = collection(db, 'users', uid, 'inspirations');

  const seedDefaults = async () => {
    for (const item of DEFAULT_PRAYERS) {
      await addDoc(inspirationsRef, {
        title: item.title,
        text: item.text,
        userCreated: false,
        createdAt: serverTimestamp(),
      });
    }
  };

  useEffect(() => {
    const q = query(inspirationsRef, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      if (snapshot.empty) {
        await seedDefaults();
        return;
      }

      const list = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));

      setPrayers(list);
    });

    return unsubscribe;
  }, [uid]);

  const savePrayer = async () => {
    if (!title.trim() || !text.trim()) return;

    if (editingId) {
      const ref = doc(db, 'users', uid, 'inspirations', editingId);
      await updateDoc(ref, {
        title: title.trim(),
        text: text.trim(),
      });
      setEditingId(null);
    } else {
      await addDoc(inspirationsRef, {
        title: title.trim(),
        text: text.trim(),
        userCreated: true,
        createdAt: serverTimestamp(),
      });
    }

    setTitle('');
    setText('');
  };

  const startEdit = (item) => {
    if (!item.userCreated) return;
    setEditingId(item.id);
    setTitle(item.title);
    setText(item.text);
  };

  const sharePrayer = async (item) => {
    const content = `${item.title}\n\n${item.text}`;

    try {
      await Share.share({
        message: content,
        title: item.title,
      });
    } catch (error) {
      console.log('Share error:', error);
      Alert.alert('Could not share', 'Something went wrong while sharing.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Prayer Inspiration</Text>
      <Text style={styles.subHeader}>
        Use these when you don&apos;t know what to pray.
      </Text>

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

      <TouchableOpacity style={styles.saveButton} onPress={savePrayer}>
        <Text style={styles.saveButtonText}>
          {editingId ? 'Save Changes' : 'Add Inspiration Prayer'}
        </Text>
      </TouchableOpacity>

      <FlatList
        data={prayers}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 50 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.titleText}>{item.title}</Text>
            <Text style={styles.contentText}>{item.text}</Text>

            <View style={styles.actionsRow}>
              {item.userCreated && (
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => startEdit(item)}
                >
                  <Text style={styles.actionText}>Edit</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => sharePrayer(item)}
              >
                <Text style={styles.actionText}>Share</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#FFF' },
  header: { fontSize: 26, fontWeight: '700', color: PURPLE, marginBottom: 4 },
  subHeader: { marginBottom: 16, color: '#444' },
  input: {
    borderWidth: 2,
    borderColor: GOLD,
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  textArea: { height: 80, textAlignVertical: 'top' },
  saveButton: {
    backgroundColor: '#FFF',
    borderWidth: 2,
    borderColor: GOLD,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 16,
  },
  saveButtonText: { fontWeight: '600', color: PURPLE },
  card: {
    padding: 14,
    borderWidth: 2,
    borderColor: GOLD,
    borderRadius: 12,
    marginBottom: 12,
    backgroundColor: '#FFF',
  },
  titleText: {
    fontWeight: '700',
    fontSize: 16,
    color: PURPLE,
    marginBottom: 6,
  },
  contentText: { fontSize: 14, marginBottom: 10 },
  actionsRow: { flexDirection: 'row', gap: 10 },
  actionButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderWidth: 2,
    borderColor: GOLD,
    borderRadius: 8,
  },
  actionText: { color: PURPLE, fontWeight: '600' },
});
