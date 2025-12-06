
import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Switch } from 'react-native';

const GOLD = '#FFD700';
const PURPLE = '#6A0DAD';

export default function ChecklistScreen() {
  const [items, setItems] = useState([
    { id: '1', label: 'Morning Prayer', done: false },
    { id: '2', label: 'Rosary', done: false },
    { id: '3', label: 'Examination of Conscience', done: false },
    { id: '4', label: 'Night Prayer', done: false },
  ]);

  const toggleItem = (id) => {
    setItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, done: !item.done } : item
      )
    );
  };

  const completedCount = items.filter(item => item.done).length;

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Today&apos;s Prayer Checklist</Text>
      <Text style={styles.subHeader}>
        {completedCount} / {items.length} prayers completed
      </Text>

      <FlatList
        data={items}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text style={[styles.label, item.done && styles.labelDone]}>
              {item.label}
            </Text>
            <Switch
              value={item.done}
              onValueChange={() => toggleItem(item.id)}
              trackColor={{ false: '#ccc', true: GOLD }}
              thumbColor={item.done ? PURPLE : '#f4f3f4'}
            />
          </View>
        )}
        style={{ marginTop: 20 }}
      />

      <Text style={styles.hint}>
        Check each prayer after you finish it.
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
