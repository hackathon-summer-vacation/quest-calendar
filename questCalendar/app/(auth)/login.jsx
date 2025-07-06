import { View, Text, StyleSheet, Pressable, TextInput } from 'react-native'
import { Link } from 'expo-router'
import React from 'react'
import { Colors } from '../../constants/Colors'
import { useState } from 'react'
import { useUser } from '../../hooks/useUser'

const Login = () => {

  const [username, setUserName] = useState('')
  const [password, setPassword] = useState('')

  const { user, register } = useUser()

  const handleSubmit = () => {
    console.log(user)
  }
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <TextInput
        style={styles.input}
        placeholder='UserName'
        keyboardType='email-address'
        onChangeText={setUserName}
        value={username}
      >
      </TextInput>

      <TextInput
        style={styles.input}
        placeholder='Password'
        onChangeText={setPassword}
        value={password}
        secureTextEntry
      >
      </TextInput>

      <Pressable
      onPress={handleSubmit}
      style={({pressed}) => [styles.btn, pressed && styles.pressed]}>
        <Text style={{ color : "#f2f2f2"}}>Login</Text>
      </Pressable>

      <Link href="/register" style={styles.link}>Register instead</Link>
    </View>
  )
}

export default Login

const theme = Colors.light

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center'
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
  },

  btn: {
    backgroundColor: Colors.primary,
    padding: 15,
    borderRadius: 5,
  },
  pressed: {
    opacity: 0.8
  },
  input: {
    backgroundColor: theme.uiBackground,
    color: theme.text,
    padding: 20,
    borderRadius: 6,
    width: "80%",
    marginBottom: 20
  }
})
