import { useCallback, useEffect } from 'react';
import { StyleSheet, Text, View, Image, Pressable } from 'react-native';
import { router } from 'expo-router';
import { ensureGuestUser } from '../utils/localDataStore';

export default function Home() {
  const startAsGuest = useCallback(async () => {
    await ensureGuestUser();
    router.replace('/(dashboard)/profile');
  }, []);

  useEffect(() => {
    startAsGuest();
  }, [startAsGuest]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Quest Calendar</Text>
      <Image source={require('../assets/images/slime.png')} style={styles.image} />
      <Text style={styles.message}>ゲストとして開始しています...</Text>
      <Pressable style={styles.button} onPress={startAsGuest}>
        <Text style={styles.buttonText}>ゲストで入る</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 20,
    marginBottom: 30,
  },
  message: {
    fontSize: 16,
    color: '#555',
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#2d6a6a',
    borderRadius: 8,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
