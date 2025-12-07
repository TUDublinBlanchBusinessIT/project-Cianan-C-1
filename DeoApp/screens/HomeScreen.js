// screens/HomeScreen.js
import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';

import { db } from '../firebaseConfig';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';

const GOLD = '#FFD700';
const PURPLE = '#6A0DAD';
const USER_ID = 'demoUser'; // fake user id for now

export default function HomeScreen({ navigation }) {
  const [streak, setStreak] = useState(0);
  const [lastDate, setLastDate] = useState(null); // "YYYY-MM-DD"

  // ---- Helper: get today's date as "YYYY-MM-DD"
  const getTodayString = () => {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };

  // ---- Load streak from Firestore once and listen for changes
  useEffect(() => {
    const streakRef = doc(db, 'streaks', USER_ID);

    const unsubscribe = onSnapshot(streakRef, async (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        setStreak(data.streak ?? 0);
        setLastDate(data.lastDate ?? null);
      } else {
        // if doc doesn't exist yet, create it with default values
        await setDoc(streakRef, { streak: 0, lastDate: null });
        setStreak(0);
        setLastDate(null);
      }
    });

    return unsubscribe;
  }, []);

  // ---- Handle streak press (update Firestore)
  const handleStreakPress = async () => {
    const today = getTodayString();
    const streakRef = doc(db, 'streaks', USER_ID);

    let newStreak = 1;

    if (lastDate) {
      // compare days difference
      const last = new Date(lastDate);
      const now = new Date();
      last.setHours(0, 0, 0, 0);
      now.setHours(0, 0, 0, 0);

      const diffDays = Math.round((now - last) / (1000 * 60 * 60 * 24));

      if (diffDays === 0) {
        Alert.alert('Already counted', 'You already logged prayer for today.');
        return; // don’t increment twice in one day
      } else if (diffDays === 1) {
        newStreak = streak + 1; // kept streak
      } else {
        newStreak = 1; // missed days, reset
      }
    }

    await setDoc(streakRef, {
      streak: newStreak,
      lastDate: today,
    });

    // Local update (UI feels instant, even before Firestore snapshot returns)
    setStreak(newStreak);
    setLastDate(today);
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
      <Text style={styles.subtitle}>Stay disciplined in daily prayer.</Text>

      {/* Streak box */}
      <View style={styles.streakContainer}>
        <Text style={styles.streakLabel}>Daily Prayer Streak</Text>

        <TouchableOpacity style={styles.streakBadge} onPress={handleStreakPress}>
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

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
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
