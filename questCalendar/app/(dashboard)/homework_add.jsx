import React, { useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, Pressable, Alert, Image } from 'react-native';

const AddQuestScreen = () => {
  // 選択されているクエストを記憶するための状態（state）
  const [selectedQuest, setSelectedQuest] = useState(null);

  // 「課題をえらぶ」ボタンが押されたときの処理 [cite: 5, 17]
  const handleChooseQuest = () => {
    // 本来はここで登録済み課題一覧を表示しますが、今はダミーの課題を選択します
    const dummyQuest = { id: 1, name: 'ドリル' }; // 
    setSelectedQuest(dummyQuest);
    Alert.alert('課題を選択！', `${dummyQuest.name}が選ばれたよ。`);
  };

  // 「クエストスタート」ボタンが押されたときの処理 [cite: 7, 19]
  const handleStartQuest = () => {
    if (selectedQuest) {
      Alert.alert('クエストスタート！', `${selectedQuest.name}を始めよう！`);
    } else {
      Alert.alert('おっと！', 'まずはクエストを選んでくれ。');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        {/* ▼▼▼ 画像挿入箇所① ▼▼▼ */}
        {/* ここに左の木の画像を指定してください */}
        <Image source={require('../../assets/images/tree.png')} style={styles.decorationImage} />

        <Text style={styles.title}>クエストを始める...</Text> [cite: 3, 15]

        {/* ▼▼▼ 画像挿入箇所② ▼▼▼ */}
        {/* ここに右の木の画像を指定してください */}
        <Image source={require('../../assets/images/tree.png')} style={styles.decorationImage} />
      </View>

      <View style={styles.selectionContainer}>
        <Text style={styles.subtitle}>選択中の課題</Text> [cite: 4, 16]
        <View style={styles.selectedQuestBox}>
          {/* ▼▼▼ 画像挿入箇所③ ▼▼▼ */}
          {/* ここに看板の画像を指定してください */}
          <Image source={require('../../assets/images/signboard.png')} style={styles.signImage} />
          
          <View style={styles.questTextContainer}>
            {selectedQuest ? (
              <Text style={styles.selectedQuestText}>{selectedQuest.name}</Text>
            ) : (
              <Text style={styles.placeholderText}>何も選択されてないよ</Text> [cite: 6]
            )}
          </View>
        </View>
        <Pressable style={styles.button} onPress={handleChooseQuest}>
          <Text style={styles.buttonText}>課題をえらぶ</Text> [cite: 5, 17]
        </Pressable>
      </View>

      <Pressable style={styles.startButton} onPress={handleStartQuest}>
        <Text style={styles.startButtonText}>クエストスタート</Text> [cite: 7, 19]
      </Pressable>
    </SafeAreaView>
  );
};

export default AddQuestScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3c3c3c', // RPGらしい暗めの背景色
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 20,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  decorationImage: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginHorizontal: 15,
  },
  selectionContainer: {
    width: '80%',
    alignItems: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#ddd',
    marginBottom: 10,
  },
  selectedQuestBox: {
    width: '100%',
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  signImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
    position: 'absolute', // テキストと重ねるため
  },
  questTextContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedQuestText: {
    fontSize: 20,
    color: '#5b3a29', // 看板の色に合わせた文字色
    fontWeight: 'bold',
  },
  placeholderText: {
    fontSize: 16,
    color: '#6f5a4d',
  },
  button: {
    backgroundColor: '#795548',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    borderBottomWidth: 3,
    borderBottomColor: '#5d4037',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  startButton: {
    backgroundColor: '#4CAF50', // 緑色
    paddingVertical: 18,
    paddingHorizontal: 50,
    borderRadius: 10,
    borderBottomWidth: 4,
    borderBottomColor: '#388E3C', // 少し濃い緑
  },
  startButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
});