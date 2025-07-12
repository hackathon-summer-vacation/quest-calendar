import { View, Text, StyleSheet, Pressable, TextInput } from 'react-native';
import { Link } from 'expo-router';
import React, { useState } from 'react';
import { Colors } from '../../constants/Colors';

const Login = () => {
  const [username, setUserName] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = () => {
    console.log("login form", username, password);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <TextInput
        style={styles.input}
        placeholder='UserName'
        onChangeText={setUserName}
        value={username}
      />

      <TextInput
        style={styles.input}
        placeholder='Password'
        onChangeText={setPassword}
        value={password}
        secureTextEntry
      />

      <Pressable
        onPress={handleSubmit}
        style={({ pressed }) => [styles.btn, pressed && styles.pressed]}>
        <Text style={{ color: "#f2f2f2" }}>Login</Text>
      </Pressable>

      <Link href="/register" style={styles.link}>Register instead</Link>
    </View>
  );
};

export default Login;

const theme = Colors.light;

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
    marginBottom: 20,
    color: '#333',
  },
  link: {
    fontSize: 16,
    color: '#1E90FF',
    textDecorationLine: 'underline',
    marginTop: 20,
  },
  btn: {
    backgroundColor: Colors.primary,
    padding: 15,
    borderRadius: 5,
    marginTop: 10,
  },
  pressed: {
    opacity: 0.8,
  },
  input: {
    backgroundColor: theme.uiBackground,
    color: theme.text,
    padding: 20,
    borderRadius: 6,
    width: "80%",
    marginBottom: 20,
  },
});