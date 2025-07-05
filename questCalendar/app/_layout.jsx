import { StyleSheet, Text, View, StatusBar} from 'react-native'
import { Stack } from 'expo-router'
import React from 'react'

const RootLayout = () => {
  return (
    <>
      <StatusBar style="auto" />
      <Stack>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(dashboard)" options={{ headerShown: false }} />
        <Stack.Screen name="index" options={{ title: "Home"}} />
      </Stack>
    </>
  )
}

export default RootLayout

const styles = StyleSheet.create({})