import { Stack } from "expo-router";
import { StatusBar } from "react-native";

export default function QuestLayout() {
  return (
    <>
      <StatusBar style="auto" />
      <Stack screenOptions={{ headerShown: false, animation: "none"}}/>
    </>
  )
}