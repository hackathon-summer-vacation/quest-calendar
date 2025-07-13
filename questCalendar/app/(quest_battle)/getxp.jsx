import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, SafeAreaView, Pressable, Alert, Image, ImageBackground } from 'react-native';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const QuestClearScreen = () => {
  const params = useLocalSearchParams();
  
  // 難易度から経験値を計算する関数
  const calculateExperience = (days) => {
    const dayNum = parseInt(days);
    if (dayNum <= 10) return 1; // EASY
    if (dayNum <= 20) return 1.5; // NORMAL
    return 2; // HARD
  };
  
  // --- 状態管理 (State) ---
  // 本来は前の画面やDBから受け取る結果データを、仮で用意します
  const [questResult, setQuestResult] = useState({
    defeatedEnemies: params.questName || 'スライム',
    experienceGained: calculateExperience(params.days || 15),
  });

  // 画面が表示されるたびに敵の数を増やし、経験値を追加
  useFocusEffect(
    React.useCallback(() => {
      const updateStats = async () => {
        try {
          // 敵の数を増やす
          const currentCount = await AsyncStorage.getItem('enemiesDefeated') || '0';
          const newCount = parseInt(currentCount) + 1;
          await AsyncStorage.setItem('enemiesDefeated', newCount.toString());
          
          // 経験値を追加
          const currentXP = await AsyncStorage.getItem('totalExperience') || '0';
          const newXP = parseFloat(currentXP) + questResult.experienceGained;
          await AsyncStorage.setItem('totalExperience', newXP.toString());
        } catch (error) {
          console.error('Error updating stats:', error);
        }
      };
      
      updateStats();
    }, [questResult.experienceGained])
  );

  // --- ボタンの処理 ---
  const handleGoToProfile = () => {
    router.push('../(dashboard)/profile');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.mainTitle}>クエストクリア</Text>

      {/* --- 上部イメージエリア --- */}
      <View style={styles.imageArea}>
        {/* ▼▼▼ 画像挿入箇所① (背景の石タイル) ▼▼▼ */}
        <ImageBackground 
          source={require('../../assets/quest_battle/renga.png')} 
          resizeMode="repeat" 
          style={styles.wallBackground}
        >
          {/* ▼▼▼ 画像挿入箇所② (左の松明) ▼▼▼ */}
          <Image source={require('../../assets/images/torch.png')} style={[styles.torchImage, styles.torchLeft]} />
          {/* ▼▼▼ 画像挿入箇所③ (右の松明) ▼▼▼ */}
          <Image source={require('../../assets/images/torch.png')} style={[styles.torchImage, styles.torchRight]} />
        </ImageBackground>

        {/* ▼▼▼ 画像挿入箇所④ (赤いカーペット) ▼▼▼ */}
        <ImageBackground 
          source={require('../../assets/quest_battle/redtail.png')} 
          style={styles.carpet}
        >
          {/* ▼▼▼ 画像挿入箇所⑤ (宝箱) ▼▼▼ */}
          <Image source={require('../../assets/quest_battle/xpbox.png')} style={styles.treasureImage} />
        </ImageBackground>
      </View>

      {/* --- 結果表示エリア --- */}
      <View style={styles.resultContainer}>
        <View style={styles.resultBox}>
          <Text style={styles.resultText}>倒した敵：{questResult.defeatedEnemies}</Text>
          <Text style={styles.resultText}>獲得した経験値：{questResult.experienceGained}</Text>
        </View>
        <Pressable style={styles.button} onPress={handleGoToProfile}>
          <Text style={styles.buttonText}>プロフィールに移動</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

export default QuestClearScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
  },
  mainTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: 40,
    marginBottom: 20,
  },
  imageArea: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 30,
  },
  wallBackground: {
    width: '90%',
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
  },
  torchImage: {
    width: 30,
    height: 60,
    resizeMode: 'contain',
    position: 'absolute',
    top: 20,
  },
  torchLeft: {
    left: 40,
  },
  torchRight: {
    right: 40,
  },
  carpet: {
    width: '100%',
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  treasureImage: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },
  resultContainer: {
    width: '80%',
    backgroundColor: '#e0cffc', // UI案の紫色
    borderRadius: 15,
    padding: 25,
    alignItems: 'center',
  },
  resultBox: {
    marginBottom: 20,
  },
  resultText: {
    fontSize: 18,
    fontWeight: '500',
    lineHeight: 30, // 行間を調整
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#2d6a6a', // UI案の青緑色
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

