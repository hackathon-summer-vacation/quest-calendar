import { Platform, StyleSheet, Text, View, Image } from 'react-native';
import { Link } from 'expo-router'

export default function Home() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Quest Calendar</Text>
      <Image source={require('../assets/images/slime.png')} style={styles.image} />
      <Link href="/login" style={styles.link}>Login Page</Link>
      <Link href="/register" style={styles.link}>Register Page</Link>
      <Link href="/profile" style={styles.link}>Profile</Link>
    </View>
  );
}

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
