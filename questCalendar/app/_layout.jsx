import { StyleSheet, Text, View, StatusBar} from 'react-native'
import { Stack } from 'expo-router'
import React from 'react'
import { UserProvider } from '../contexts/UserContext'

const RootLayout = () => {
  return (
    <UserProvider>
      <StatusBar style="auto" />
      <Stack>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(dashboard)" options={{ headerShown: false }} />
        <Stack.Screen name="(quest_battle)" options={{ headerShown: false }} />
        <Stack.Screen name="index" options={{ title: "Home"}} />
      </Stack>
    </UserProvider>
  )
}

export default RootLayout

const styles = StyleSheet.create({})