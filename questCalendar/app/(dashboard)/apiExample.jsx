import { Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'


const Profile = () => {
  const fetchUserProfile = async () => {
  try {
    const token = await AsyncStorage.getItem("authToken");

    if (!token) {
      console.log("トークンがありません。ログインしてください");
      return;
    }

    const res = await fetch("http://localhost:8000/user/me", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });

    if (!res.ok) {
      throw new Error("API呼び出しに失敗しました");
    }

    const data = await res.json();
    console.log("ユーザー情報:", data);

    return data;
  } catch (error) {
    console.error("ユーザー情報の取得に失敗:", error);
  }
};

  return (
    <View style={styles.container}>
      <Pressable
            onPress={fetchUserProfile}
            style={({pressed}) => [styles.btn, pressed && styles.pressed]}>
              <Text style={{ color : "#111111"}}>API example</Text>
            </Pressable>
    </View>
  )
}

export default Profile

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center'
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
  link: {
    fontSize: 18,
    color: 'blue',
    marginVertical: 5,
  }
});