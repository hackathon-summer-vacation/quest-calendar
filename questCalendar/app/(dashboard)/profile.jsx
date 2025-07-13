import { StyleSheet, Text, View, Image, SafeAreaView, Pressable, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage'

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
    return require('../../assets/userlevel_images/user_level1.png');
  }
};

const Profile = () => {
  const [tapCount, setTapCount] = useState(0);
  const [isSecretUnlocked, setSecretUnlocked] = useState(false);
  const [userData, setUserData] = useState({
    name: '',
    level: 1,
    enemiesDefeated: 0,
    bossesDefeated: 0,
    daysUntilDeadline: 0
  });
  const [daysUntilAugust31, setDaysUntilAugust31] = useState(0);
  const [loading, setLoading] = useState(true);

  // ユーザー情報を取得する関数
  const fetchUserInfo = async (userId) => {
    try {
      const response = await fetch(`http://localhost:8000/userinfo/${userId}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      // 配列の最初の要素を取得（APIが配列で返すため）
      const user = data[0];
      return {
        name: user.username,
        level: user.level,
        enemiesDefeated: user.enemies_defeated,
        bossesDefeated: user.bosses_defeated,
        daysUntilDeadline: user.days_until_deadline
      };
    } catch (error) {
      console.error("Fetch error:", error);
      throw error;
    }
  };

  // 今日から8月31日までの日数を計算する関数
  const calculateDaysUntilAugust31 = () => {
    const today = new Date();
    const currentYear = today.getFullYear();
    const august31 = new Date(currentYear, 7, 31); // 月は0から始まるので7が8月
    
    // もし今日が8月31日を過ぎていたら、来年の8月31日を対象にする
    if (today > august31) {
      august31.setFullYear(currentYear + 1);
    }
    
    const timeDiff = august31.getTime() - today.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return daysDiff;
  };

  // コンポーネントマウント時にユーザーIDとユーザー情報を取得
  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = "1"; // debug用
        // const userId = await AsyncStorage.getItem('userId'); // 本番環
        console.log("取得したuserId:", userId);
        
        if (userId) {
        const userInfo = await fetchUserInfo(userId);
        setUserData(userInfo);
        }
        
        // 8月31日までの日数を計算
        const days = calculateDaysUntilAugust31();
        setDaysUntilAugust31(days);
      } catch (e) {
        console.error("Error:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Loading...</Text>
      </SafeAreaView>
    );
  }

  const levelAvatar = getHeroAvatarByLevel(userData.level);
  const secretAvatar = require('../../assets/userlevel_images/secret_user.png');
  const currentAvatar = isSecretUnlocked ? secretAvatar : levelAvatar;

  return (
    <SafeAreaView style={styles.container}>
      {/* ユーザー名 */}
      <Text style={styles.pageTitle}>{userData.name}さんのマイページ</Text>

      {/* 勇者の画像 */}
      <Image source={currentAvatar} style={styles.heroImage} />

      {/* メインメッセージ */}
      <Text style={styles.heroTitle}>あなたは勇者です</Text>

      {/* ステータス表示エリア */}
      <View style={styles.statsContainer}>
        <Text style={styles.statText}>レベル: {userData.level} Level</Text>
        <Text style={styles.statText}>倒した敵の数: {userData.enemiesDefeated}匹</Text>
        <Text style={styles.statText}>倒したボスの数: {userData.bossesDefeated}体</Text>
      </View>

      {/* カウントダウン */}
      <Pressable onPress={handleCountdownTap}>
        <View style={styles.countdownContainer}>
          <Text style={styles.countdownText}>
            世界が滅亡するまであと {daysUntilAugust31} 日
          </Text>
        </View>
      </Pressable>
    </SafeAreaView>
  );
};

// stylesは変更なし
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
export default Profile;