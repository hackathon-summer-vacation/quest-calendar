import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const Quest = () => {
  return (
    <View style={styles.container}>
      <Text>quest</Text>
    </View>
  )
}

export default Quest

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
