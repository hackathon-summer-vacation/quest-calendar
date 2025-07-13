import React from 'react';
import { Text, View, StyleSheet, Pressable } from 'react-native';
import { Link } from 'expo-router';
import { Colors } from '../../constants/Colors'
import { TextInput } from 'react-native';
import { useState } from 'react'
import { useUser } from '../../hooks/useUser'

const Register = () => {

  //登録結果の表示
  const [message, setMessage] = useState("");

  const [username, setUserName] = useState('')
  const [password, setPassword] = useState('')

  // hooks/useUserの中で定義されている
  const { user, register } = useUser()

  // 登録ボタンを押した後の処理
  const handleSubmit = async () => {
    try {
      const resMessage = await register(username, password)

      // ここのメッセージに登録できれば、成功メッセージ、できなければ失敗メッセージの表示
      setMessage(resMessage)
    } catch (error) {
      setMessage("サーバーで問題が起きました。もう一度試してください。")
    }
  }
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>

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
        <Text style={{ color : "#f2f2f2"}}>Register</Text>
      </Pressable>

      <Text style={{ marginTop: 16, color: "red" }}>{message}</Text>

      <Link href="/login" style={styles.link}>Login instead</Link>
    </View>
  );
}

export default Register;

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
