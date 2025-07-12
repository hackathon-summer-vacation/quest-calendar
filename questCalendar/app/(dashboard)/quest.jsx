import React, { useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, Pressable, Alert, Image } from 'react-native';

const AddQuestScreen = () => {
  // 選択されているクエストを記憶するための状態（state）
  const [selectedQuest, setSelectedQuest] = useState(null);

  // 「課題をえらぶ」ボタンが押されたときの処理
  const handleChooseQuest = () => {
    // 本来はここで登録済み課題一覧を表示しますが、今はダミーの課題を選択します
    const dummyQuest = { id: 1, name: 'ドリル' };
    setSelectedQuest(dummyQuest);
    Alert.alert('課題を選択！', `${dummyQuest.name}が選ばれたよ。`);
  };

  // 「クエストスタート」ボタンが押されたときの処理
  const handleStartQuest = () => {
    if (selectedQuest) {
      Alert.alert('クエストスタート！', `${selectedQuest.name}を始めよう！`);
    } else {
      Alert.alert('おっと！', 'まずはクエストを選んでくれ。');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 上部エリア */}
      <View style={styles.topSection}>
        {/* ▼▼▼ 画像挿入箇所① ▼▼▼ */}
        <Image source={require('../../assets/images/signboard.png')} style={styles.signImage} />
        
        {/* --- ▼▼▼ ここから修正 ▼▼▼ --- */}
        <View style={styles.titleContainer}>
          {/* ▼▼▼ 画像挿入箇所 (左の木) ▼▼▼ */}
          <Image source={require('../../assets/images/tree.png')} style={styles.treeImage} />
          <Text style={styles.title}>クエストを始める...</Text>
          {/* ▼▼▼ 画像挿入箇所 (右の木) ▼▼▼ */}
          <Image source={require('../../assets/images/tree.png')} style={styles.treeImage} />
        </View>
        {/* --- ▲▲▲ ここまで修正 ▲▲▲ --- */}
      </View>

      {/* 中間エリア */}
      <View style={styles.middleSection}>
        <View style={styles.chooseQuestContainer}>
          {/* ▼▼▼ 画像挿入箇所② ▼▼▼ */}
          <Image source={require('../../assets/images/slime_purple.png')} style={styles.iconImage} />
          <Text style={styles.chooseQuestText}>課題をえらぶ</Text>
        </View>

        <Text style={styles.subtitle}>選択中の課題</Text>
        <Pressable style={styles.selectedQuestBox} onPress={handleChooseQuest}>
          {selectedQuest ? (
            <>
              {/* ▼▼▼ 画像挿入箇所③ ▼▼▼ */}
              <Image source={require('../../assets/images/golem.png')} style={styles.questIcon} />
              <Text style={styles.selectedQuestText}>{selectedQuest.name}</Text>
            </>
          ) : (
            <Text style={styles.placeholderText}>（ここをタップして課題を選択）</Text>
          )}
        </Pressable>
      </View>

      {/* 下部エリア */}
      <View style={styles.bottomSection}>
        <View style={styles.torchContainer}>
          {/* ▼▼▼ 画像挿入箇所④ ▼▼▼ */}
          <Image source={require('../../assets/images/torch.png')} style={styles.torchImage} />
          <Image source={require('../../assets/images/torch.png')} style={styles.torchImage} />
        </View>
        <Pressable style={styles.startButton} onPress={handleStartQuest}>
          <Text style={styles.startButtonText}>クエストスタート</Text>
        </Pressable>
        <View style={styles.torchContainer}>
          {/* ▼▼▼ 画像挿入箇所⑤ ▼▼▼ */}
          <Image source={require('../../assets/images/torch.png')} style={styles.torchImage} />
          <Image source={require('../../assets/images/torch.png')} style={styles.torchImage} />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default AddQuestScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 20,
  },
  topSection: {
    alignItems: 'center',
  },
  signImage: {
    width: 120,
    height: 60,
    resizeMode: 'contain',
    marginBottom: 5,
  },
  // --- ▼▼▼ ここから追加・修正 ▼▼▼ ---
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  treeImage: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginHorizontal: 10, // 木と文字の間に余白を追加
  },
  // --- ▲▲▲ ここまで追加・修正 ▲▲▲ ---
  middleSection: {
    width: '80%',
    alignItems: 'center',
  },
  chooseQuestContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  iconImage: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
    marginRight: 10,
  },
  chooseQuestText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    alignSelf: 'flex-start',
    marginBottom: 5,
  },
  selectedQuestBox: {
    flexDirection: 'row',
    width: '100%',
    height: 80,
    backgroundColor: '#ffedd5',
    borderWidth: 2,
    borderColor: '#d4d4d4',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  questIcon: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
    marginRight: 15,
  },
  selectedQuestText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  placeholderText: {
    fontSize: 16,
    color: '#888',
  },
  bottomSection: {
    width: '100%',
    alignItems: 'center',
  },
  torchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '70%',
    marginBottom: 10,
  },
  torchImage: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
  startButton: {
    backgroundColor: '#ef4444',
    width: '70%',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  startButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
});
