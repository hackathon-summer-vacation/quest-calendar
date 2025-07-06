import { View, Text, StyleSheet, Pressable, TextInput } from 'react-native'
import { Link } from 'expo-router'
import { router } from 'expo-router';
import React from 'react'
import { Colors } from '../../constants/Colors'
import { useState } from 'react'
import { useUser } from '../../hooks/useUser'
import AsyncStorage from '@react-native-async-storage/async-storage'


const Login = () => {

  //ログイン結果の表示
  const [message, setMessage] = useState("")

  const [username, setUserName] = useState('')
  const [password, setPassword] = useState('')

  // hooks/useUserの中で定義されている
  const { user, login } = useUser()

  // ログインボタン押した後の処理
  const handleSubmit = async () => {
    try {
      // resには成功したら{"token": token, "user": user}のjsonファイルが返ってくる
      // 失敗すると、失敗メッセージが返ってくる
      res = await login(username, password)
      console.log(res)
      if (typeof res === "string") {
        setMessage(res);
      } else {
        // 成功時のユーザー情報を取ってくる
        console.log("ユーザー:", res.user);

        // tokenをAyncStorageに保存
        await AsyncStorage.setItem('authToken', res.token);

        // プロフィール画面に飛ぶ
        router.replace("/(dashboard)/profile");
      }
    } catch (error) {
      setMessage("サーバーに問題が起きました。もう一度試してください。");
    }
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

      <Text style={{ marginTop: 16, color: "red" }}>{message}</Text>

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
