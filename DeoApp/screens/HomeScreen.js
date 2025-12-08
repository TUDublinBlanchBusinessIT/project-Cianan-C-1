// screens/HomeScreen.js
import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
  Dimensions,
} from 'react-native';

import { auth, db } from '../firebaseConfig';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';

const GOLD = '#FFD700';
const PURPLE = '#6A0DAD';

// detect phone vs larger screen
const { width } = Dimensions.get('window');
const isPhone = width < 600;

export default function HomeScreen({ navigation }) {
  const [streak, setStreak] = useState(0);
  const [lastDate, setLastDate] = useState(null); // "YYYY-MM-DD"

  const uid = auth.currentUser?.uid;
  if (!uid) return null; // user not ready yet

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
      activeOpacity={0.7}
    >
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.scrollContent}>
      {/* FULL-WIDTH BANNER */}
      <View style={styles.bannerWrapper}>
        <Image
          source={require('../assets/Deo App Banner.png')}
          style={styles.bannerImage}
          resizeMode="cover"
        />

        <View style={styles.bannerOverlay}>
          <Text style={styles.bannerTitle}>Deo</Text>
          <Text style={styles.bannerSubtitle}>
            Stay disciplined in daily prayer.
          </Text>
        </View>
      </View>

      {/* REST OF CONTENT WITH PADDING */}
      <View style={styles.content}>
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

        <View style={styles.buttonsWrapper}>
          <NavButton title="Prayer List" screen="PrayerList" />
          <NavButton title="Prayer Checklist" screen="Checklist" />
          <NavButton title="Reflections" screen="Reflection" />
          <NavButton title="Prayer Inspiration" screen="Inspiration" />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  // outer scroll area – NO horizontal padding here
  screen: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    paddingBottom: 40,
  },

  // ---------- Banner ----------
  bannerWrapper: {
    width: '100%',
    height: isPhone ? 180 : 260, // smaller on phone, taller on bigger screens
    position: 'relative',
    overflow: 'hidden',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  bannerOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 16,
    alignItems: 'center',
    backgroundColor: 'transparent', // no big glow bar
  },
  bannerTitle: {
    fontSize: isPhone ? 32 : 40,
    fontWeight: '900',
    color: PURPLE,
    textShadowColor: 'rgba(255, 215, 0, 0.6)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  bannerSubtitle: {
    fontSize: isPhone ? 14 : 16,
    fontWeight: '500',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0,0,0,0.4)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },

  // ---------- Inner content (streak + buttons) ----------
  content: {
    width: '100%',
    paddingHorizontal: 20,  // padding is only for content, not banner
    alignItems: 'center',
    marginTop: 24,
  },

  streakContainer: {
    alignItems: 'center',
  },
  streakLabel: {
    fontSize: 18,
    fontWeight: '600',
  },
  streakBadge: {
    marginTop: 14,
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 40,
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
    marginTop: 32,
    width: '100%',
  },
  button: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: GOLD,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 10,
    marginBottom: 12,
  },
  buttonText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
    color: PURPLE,
  },
});
