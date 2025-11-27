// screens/HomeScreen.js
import React, { useState } from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function HomeScreen({ navigation }) {
  const [streak, setStreak] = useState(1); // start at 1 for now

  const handleStreakPress = () => {
    setStreak(prev => prev + 1);
  };

  const NavButton = ({ title, screen }) => (
    <TouchableOpacity
      style={styles.button}
      onPress={() => navigation.navigate(screen)}
      activeOpacity={0.7}
    >
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Title */}
      <Text style={styles.title}>Deo</Text>
      <Text style={styles.subtitle}>
        Stay disciplined in daily prayer.
      </Text>

      {/* Streak box */}
      <View style={styles.streakContainer}>
        <Text style={styles.streakLabel}>Daily Prayer Streak</Text>

        <TouchableOpacity
          style={styles.streakBadge}
          onPress={handleStreakPress}
        >
          <Text style={styles.streakNumber}>{streak}</Text>
          <Text style={styles.streakText}>days</Text>
        </TouchableOpacity>

        <Text style={styles.streakHint}>
          Tap after you&apos;ve prayed today.
        </Text>
      </View>

      {/* Navigation buttons */}
      <View style={styles.buttonsWrapper}>
        <NavButton title="Prayer List" screen="PrayerList" />
        <NavButton title="Prayer Checklist" screen="Checklist" />
        <NavButton title="Reflections" screen="Reflection" />
        <NavButton title="Prayer Inspiration" screen="Inspiration" />
      </View>
    </ScrollView>
  );
}

const GOLD = '#FFD700';
const PURPLE = '#6A0DAD';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 60,
    alignItems: 'center',
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: PURPLE,
  },
  subtitle: {
    marginTop: 6,
    fontSize: 14,
    color: '#444',
    textAlign: 'center',
  },

  streakContainer: {
    marginTop: 40,
    alignItems: 'center',
  },
  streakLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  streakBadge: {
    marginTop: 12,
    paddingVertical: 10,
    paddingHorizontal: 26,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: GOLD,
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  streakNumber: {
    fontSize: 34,
    fontWeight: 'bold',
    marginRight: 6,
    color: PURPLE,
  },
  streakText: {
    fontSize: 16,
  },
  streakHint: {
    marginTop: 6,
    fontSize: 12,
    color: '#666',
  },

  buttonsWrapper: {
    marginTop: 40,
    width: '100%',
  },
  button: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: GOLD,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  buttonText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
    color: PURPLE,
  },
});
