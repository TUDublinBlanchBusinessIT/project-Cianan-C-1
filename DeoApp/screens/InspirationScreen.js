// screens/InspirationScreen.js
import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';

const GOLD = '#FFD700';
const PURPLE = '#6A0DAD';

const INSPIRATIONS = [
  {
    id: '1',
    title: 'Short Morning Offering',
    text: 'Lord, I offer You this day, all my thoughts, words, actions, joys and sufferings, in union with Your Sacred Heart.',
  },
  {
    id: '2',
    title: 'Prayer Before Study',
    text: 'Holy Spirit, guide my mind as I study. Help me to understand, remember, and use this knowledge for Your glory.',
  },
  {
    id: '3',
    title: 'Prayer for Patience',
    text: 'Jesus, meek and humble of heart, make my heart like Yours. Give me patience with others and with myself.',
  },
  {
    id: '4',
    title: 'Prayer in Stress',
    text: 'Lord, You know my worries. I place my work, my studies, and my future in Your hands. Give me peace and trust.',
  },
];

export default function InspirationScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Prayer Inspiration</Text>
      <Text style={styles.subHeader}>
        Use these when you don&apos;t know what to pray.
      </Text>

      <FlatList
        data={INSPIRATIONS}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.text}>{item.text}</Text>
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 20 }}
      />

      <Text style={styles.footerNote}>
        In a future premium version, more prayers could be unlocked here.
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
    fontSize: 26,
    fontWeight: '700',
    color: PURPLE,
  },
  subHeader: {
    marginBottom: 16,
    color: '#444',
  },
  card: {
    borderWidth: 2,
    borderColor: GOLD,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    backgroundColor: '#FFF',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: PURPLE,
    marginBottom: 6,
  },
  text: {
    fontSize: 14,
    lineHeight: 20,
  },
  footerNote: {
    marginTop: 10,
    fontSize: 12,
    color: '#666',
  },
});
