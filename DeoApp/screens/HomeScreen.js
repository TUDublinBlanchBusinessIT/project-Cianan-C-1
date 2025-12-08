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

import { auth, db } from '../firebaseConfig';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';

const GOLD = '#FFD700';
const PURPLE = '#6A0DAD';

export default function HomeScreen({ navigation }) {
  const [streak, setStreak] = useState(0);
  const [lastDate, setLastDate] = useState(null);

  const user = auth.currentUser;
  const uid = user?.uid;
  const email = user?.email || '';

  if (!uid) return null;

  const getTodayString = () => {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };

  useEffect(() => {
    const streakRef = doc(db, 'streaks', uid);

    const unsubscribe = onSnapshot(streakRef, async (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        setStreak(data.streak ?? 0);
        setLastDate(data.lastDate ?? null);
      } else {
        await setDoc(streakRef, { streak: 0, lastDate: null });
        setStreak(0);
        setLastDate(null);
      }
    });

    return unsubscribe;
  }, [uid]);

  const handleStreakPress = async () => {
    const today = getTodayString();
    const streakRef = doc(db, 'streaks', uid);

    let newStreak = 1;

    if (lastDate) {
      const last = new Date(lastDate);
      const now = new Date();
      last.setHours(0, 0, 0, 0);
      now.setHours(0, 0, 0, 0);

      const diffDays = Math.round((now - last) / (1000 * 60 * 60 * 24));

      if (diffDays === 0) {
        Alert.alert('Already counted', 'You already logged prayer for today.');
        return;
      } else if (diffDays === 1) {
        newStreak = streak + 1;
      } else {
        newStreak = 1;
      }
    }

    await setDoc(streakRef, {
      streak: newStreak,
      lastDate: today,
    });

    setStreak(newStreak);
    setLastDate(today);
  };

  const NavButton = ({ title, screen }) => (
    <TouchableOpacity
      style={styles.button}
      onPress={() => navigation.navigate(screen)}
      activeOpacity={0.8}
    >
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Banner */}
      <View style={styles.banner}>
        <Text style={styles.bannerIcon}>⛪</Text>
        <View style={{ flex: 1 }}>
          <Text style={styles.bannerTitle}>Deo</Text>
          <Text style={styles.bannerSubtitle}>
            Stay disciplined in daily prayer.
          </Text>
          {email ? (
            <Text style={styles.bannerUser}>Logged in as {email}</Text>
          ) : null}
        </View>
      </View>

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
    paddingTop: 40,
    paddingBottom: 30,
  },

  // Banner
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: GOLD,
    borderRadius: 18,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  bannerIcon: {
    fontSize: 36,
    marginRight: 12,
  },
  bannerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: PURPLE,
  },
  bannerSubtitle: {
    fontSize: 13,
    color: '#333',
  },
  bannerUser: {
    marginTop: 4,
    fontSize: 11,
    color: '#444',
  },

  // Streak
  streakContainer: {
    marginTop: 10,
    alignItems: 'center',
  },
  streakLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  streakBadge: {
    marginTop: 12,
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: GOLD,
    backgroundColor: '#f8f0c8',
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
    color: '#333',
  },
  streakHint: {
    marginTop: 6,
    fontSize: 12,
    color: '#666',
  },

  // Nav buttons
  buttonsWrapper: {
    marginTop: 30,
  },
  button: {
    backgroundColor: PURPLE,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 10,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: GOLD,
  },
  buttonText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '700',
    color: '#FFF',
  },
});
