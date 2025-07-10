import { StyleSheet, Text, View, Image, SafeAreaView, Pressable, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage'

// --- ▼▼▼ この関数を丸ごと追加 ▼▼▼ ---
// レベルに応じて表示する画像を決定する関数
const getHeroAvatarByLevel = (level) => {
  if (level >= 20) {
    return require('../../assets/userlevel_images/user_level20.png');
  } else if (level >= 18) {
    return require('../../assets/userlevel_images/user_level18.png');
  } else if (level >= 15) {
    return require('../../assets/userlevel_images/user_level15.png');
  } else if (level >= 12) {
    return require('../../assets/userlevel_images/user_level10.png');
  } else if (level >= 10) {
    return require('../../assets/userlevel_images/user_level8.png');
  } else if (level >= 8) {
    return require('../../assets/userlevel_images/user_level5.png');
  } else if (level >= 5) {
    return require('../../assets/userlevel_images/user_level3.png');
  } else if (level >= 3) {
    return require('../../assets/userlevel_images/user_level1.png');
  } else {
    // レベル3未満の初期状態
    return require('../../assets/userlevel_images/user_level1.png');
  }
};
// --- ▲▲▲ ここまで ▲▲▲ ---


// 最終的にはデータベースから取得する、仮の（ダミー）データ
const dummyUserData = {
  name: 'User',
  //ユーザーのレベルを変えると見た目が変化します。テスト是非お願いします。
  level: 1,
  enemiesDefeated: 42,
  bossesDefeated: 3,
  daysUntilDeadline: 7,
  // avatar: require(...) の行は不要なので削除しました
};

const Profile = () => {
  const [tapCount, setTapCount] = useState(0);
  const [isSecretUnlocked, setSecretUnlocked] = useState(false);

  // AsyncStorageというところにloginの時にuserIdを入れたのでそこからuserIdの獲得
  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const userId = await AsyncStorage.getItem('userId');
        console.log("取得したuserId:", userId);
      } catch (e) {
        console.error("AsyncStorage エラー:", e);
      }
    };

    fetchUserId();
  }, []);

  // カウントダウン表示がタップされたときの処理
  const handleCountdownTap = () => {
    const newCount = tapCount + 1;
    setTapCount(newCount);

    if (newCount === 66) {
      Alert.alert('！勇者の様子がおかしいぞ！', 'secretキャラクターガイコツを開放した');
      setSecretUnlocked(true);
    }
  };

  const levelAvatar = getHeroAvatarByLevel(dummyUserData.level);
  const secretAvatar = require('../../assets/userlevel_images/secret_user.png');
  const currentAvatar = isSecretUnlocked ? secretAvatar : levelAvatar;

  return (
    <SafeAreaView style={styles.container}>
      {/* ユーザー名 */}
      <Text style={styles.pageTitle}>{dummyUserData.name}さんのマイページ</Text>

      {/* 勇者の画像 */}
      <Image source={currentAvatar} style={styles.heroImage} />

      {/* メインメッセージ */}
      <Text style={styles.heroTitle}>あなたは勇者です</Text>

      {/* ステータス表示エリア */}
      <View style={styles.statsContainer}>
        <Text style={styles.statText}>レベル: {dummyUserData.level} Level</Text>
        <Text style={styles.statText}>倒した敵の数: {dummyUserData.enemiesDefeated}匹</Text>
        <Text style={styles.statText}>倒したボスの数: {dummyUserData.bossesDefeated}体</Text>
      </View>

      {/* カウントダウン */}
      <Pressable onPress={handleCountdownTap}>
        <View style={styles.countdownContainer}>
          <Text style={styles.countdownText}>
            世界が滅亡するまであと {dummyUserData.daysUntilDeadline} 日
          </Text>
        </View>
      </Pressable>
    </SafeAreaView>
  );
};

export default Profile;

// stylesの部分は変更ありません
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    paddingTop: 40,
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'gray',
    marginBottom: 20,
  },
  heroImage: {
    width: 150,
    height: 150,
    marginBottom: 20,
    resizeMode: 'contain', 
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  statsContainer: {
    width: '80%',
    backgroundColor: '#f0f8ff',
    borderRadius: 10,
    padding: 20,
    marginBottom: 30,
  },
  statText: {
    fontSize: 18,
    lineHeight: 30,
  },
  countdownContainer: {
    borderWidth: 2,
    borderColor: '#ff4500',
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 25,
  },
  countdownText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ff4500',
  },
});