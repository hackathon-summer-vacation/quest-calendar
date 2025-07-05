import { StyleSheet, Text, useColorScheme, View, Image} from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'
import { Colors } from '../../constants/Colors'
import { Iconicons, Ionicons } from '@expo/vector-icons'

export default function DashboardLayout() {
  const theme = Colors.light
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.navBackground,
          paddingTop: 10,
          height: 90
        },
        tabBarActiveTintColor: theme.iconColorFocused,
        tabBarInactiveTintColor: theme.iconColor
      }}
    >

      <Tabs.Screen
        name="calendar"
        options={{title: "Calendar", tabBarIcon: ({focused}) => (
          <Ionicons
            size={24}
            name={focused ? "calendar" : "calendar-outline"}
            color={focused ? theme.iconColorFocused : theme.iconColor}
          />
        )}}
      />
      <Tabs.Screen
        name="quest"
        options={{title: "Quest", tabBarIcon: ({focused}) => (
          <Image
            size={24}
            source={require('../../assets/images/slime.png')}
            style={{
              width: 24,
              height: 24

            }}
          />
        )}}
      />
      <Tabs.Screen
        name="profile"
        options={{title: "Profile", tabBarIcon: ({focused}) => (
          <Ionicons
            size={24}
            name={focused ? "person" : "person-outline"}
            color={focused ? theme.iconColorFocused : theme.iconColor}
          />
        )}}
      />
    </Tabs>
  )
}

const styles = StyleSheet.create({})