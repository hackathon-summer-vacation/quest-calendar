import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

const PhotoSubmit = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Text>photoSubmit</Text>
    </SafeAreaView>
  )
}

export default PhotoSubmit

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    // justifyContent: 'center',
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


