import { useCallback, useEffect } from 'react';
import { Text, View, StyleSheet, Pressable } from 'react-native';
import { router } from 'expo-router';
import { useUser } from '../../hooks/useUser';

const Register = () => {
  const { register } = useUser();

  const enterAsGuest = useCallback(async () => {
    await register();
    router.replace('/(dashboard)/profile');
  }, [register]);

  useEffect(() => {
    enterAsGuest();
  }, [enterAsGuest]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>ゲストで入ります</Text>
      <Text style={styles.message}>登録は不要です。</Text>
      <Pressable
        onPress={enterAsGuest}
        style={({ pressed }) => [styles.btn, pressed && styles.pressed]}
      >
        <Text style={styles.btnText}>ゲストで入る</Text>
      </Pressable>
    </View>
  );
};

export default Register;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  message: {
    color: '#555',
    fontSize: 16,
    marginBottom: 20,
  },
  btn: {
    backgroundColor: '#2d6a6a',
    padding: 15,
    borderRadius: 8,
  },
  btnText: {
    color: '#f2f2f2',
    fontWeight: 'bold',
  },
  pressed: {
    opacity: 0.8,
  },
});
