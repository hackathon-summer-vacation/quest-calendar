import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, SafeAreaView, Pressable, Alert, Image, ImageBackground, Animated, TouchableOpacity, Button } from 'react-native';
import { router } from 'expo-router';
import { useLocalSearchParams } from 'expo-router';



// 難易度に応じて表示するモンスター画像を決定する関数
const getMonsterImage = (difficulty) => {
  switch (difficulty) {
    case 'easy':
      // ▼▼▼ 画像挿入箇所① (簡単なモンスター) ▼▼▼
      return require('../../assets/monster_images/slime_green.png');
    case 'normal':
      // ▼▼▼ 画像挿入箇所② (普通のモンスター) ▼▼▼
      return require('../../assets/monster_images/slime_purple.png');
    case 'hard':
      // ▼▼▼ 画像挿入箇所③ (難しいモンスター) ▼▼▼
      return require('../../assets/monster_images/golem.png');
    default:
      // ▼▼▼ 画像挿入箇所④ (デフォルトのモンスター) ▼▼▼
      return require('../../assets/monster_images/slime_green.png');
  }
};

const QuestInProgressScreen = () => {

  const params = useLocalSearchParams();
  console.log('受け取ったクエスト:', params.id, params.name, params.days);
  
  // daysから難易度を計算する関数
  const calculateDifficulty = (days) => {
    const dayNum = parseInt(days);
    if (dayNum <= 10) return 'easy';
    if (dayNum <= 20) return 'normal';
    return 'hard';
  };
  
  // --- 状態管理 (State) ---
  const [quest, setQuest] = useState({ 
    difficulty: calculateDifficulty(params.days || 15) 
  }); 
  const [isQuestComplete, setQuestComplete] = useState(false);
  
  // --- アニメーション用の値 ---
  const monsterWiggleAnim = useRef(new Animated.Value(0)).current;
  const swordAttackAnim = useRef(new Animated.Value(0)).current;
  const slashOpacityAnim = useRef(new Animated.Value(0)).current;

    const [uploading, setUploading] = useState(false);
  
    const [beforeUri, setBeforeUri] = useState(null);
    const [afterUri, setAfterUri] = useState(null);
    const [stage, setStage] = useState('before');
  
    const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        alert('カメラのアクセスが必要です');
        return;
      }
  
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: 'Images',
        quality: 1,
      });
  
      if (!result.canceled) {
        const localUri = result.assets[0].uri;
  
        if (stage === 'before') {
          setBeforeUri(localUri);
          await uploadToS3(localUri, 'before');
          setStage('after');
        } else {
          setAfterUri(localUri);
          await uploadToS3(localUri, 'after');
          setStage('before');
        }
      }
    };
  
  
    const uploadToS3 = async (localUri, label) => {
      try {
        setUploading(true);
  
        const res = await fetch('http://192.168.0.104:8000/photo/get-signed-url');
        const data = await res.json();
  
        const url = data.url;
        const key = data.key;
  
        const blob = await (await fetch(localUri)).blob();
  
        const uploadRes = await fetch(url, {
          method: 'PUT',
          headers: {
            'Content-Type': 'image/jpeg',
          },
          body: blob,
        });
  
        if (uploadRes.ok) {
          Alert.alert(`${label} アップロード成功`, `画像キー: ${key}`);
          console.log(`${label} uploaded as ${key}`);
        } else {
          const text = await uploadRes.text();
          console.error('S3アップロード失敗:', uploadRes.status, text);
          throw new Error('S3アップロード失敗');
        }
      } catch (err) {
        console.error(err);
        Alert.alert('エラー', err.message);
      } finally {
        setUploading(false);
      }
    };

  // --- 副作用 (useEffect) ---
  useEffect(() => {
    // daysが変更されたら難易度を更新
    if (params.days) {
      setQuest({ difficulty: calculateDifficulty(params.days) });
    }
    
    console.log('現在の難易度:', quest.difficulty, 'days:', params.days);
    // 1. モンスターのゆらゆらアニメーション
    Animated.loop(
      Animated.sequence([
        Animated.timing(monsterWiggleAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
        Animated.timing(monsterWiggleAnim, { toValue: -1, duration: 800, useNativeDriver: true }),
        Animated.timing(monsterWiggleAnim, { toValue: 0, duration: 800, useNativeDriver: true }),
      ])
    ).start();

    // 2. 5秒ごとの攻撃アニメーション
    const attackInterval = setInterval(() => {
      if (!isQuestComplete) {
        triggerAttackAnimation();
      }
    }, 5000);

    return () => clearInterval(attackInterval);
  }, [isQuestComplete, params.days]);

  // --- アニメーションのトリガー関数 ---
  const triggerAttackAnimation = () => {
    swordAttackAnim.setValue(0);
    slashOpacityAnim.setValue(0);
    
    Animated.sequence([
      Animated.timing(swordAttackAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
      Animated.timing(slashOpacityAnim, { toValue: 1, duration: 100, useNativeDriver: true }),
      Animated.delay(200),
      Animated.timing(slashOpacityAnim, { toValue: 0, duration: 100, useNativeDriver: true }),
      Animated.timing(swordAttackAnim, { toValue: 0, duration: 300, useNativeDriver: true }),
    ]).start();
  };
  
  // --- ボタンの処理 ---
  const handleUpload = () => { Alert.alert('課題アップロード', '（ここに課題アップロード処理を実装）'); };

  // --- ▼▼▼ ここから修正 ▼▼▼ ---
  // 「課題完了を報告する」ボタンが押されたときの処理
  const handleComplete = () => {
    // 将来的に、ここに画像アップロードやサーバーへの報告処理を実装します。
    Alert.alert('課題完了を報告！', 'クリア判定を待っています...（仮）');
    // この時点ではまだ isQuestComplete は変更しません。
  };

  // サーバーなどからクリア判定の信号を受け取ったと仮定する関数
  const receiveClearSignal = () => {
    Alert.alert('クリア！', '見事にクエストを達成した！');
    setQuestComplete(true); // ここで初めてモンスターが宝箱に変わる
    // 2秒後にgetxp画面に遷移
    setTimeout(() => {
      router.push('../(quest_battle)/getxp');
    }, 2000);
  };
  // --- ▲▲▲ ここまで修正 ▲▲▲ ---


  // --- アニメーションのスタイル計算 ---
  const monsterWiggleStyle = { transform: [{ rotate: monsterWiggleAnim.interpolate({ inputRange: [-1, 1], outputRange: ['-5deg', '5deg'] }) }] };
  const slashOpacity = { opacity: slashOpacityAnim };
  const swordAttackStyle = {
    transform: [
      { translateX: swordAttackAnim.interpolate({ inputRange: [0, 1], outputRange: [0, -50] }) },
      { translateY: swordAttackAnim.interpolate({ inputRange: [0, 1], outputRange: [0, -100] }) }, // 剣をより上方に動かす
      { rotate: swordAttackAnim.interpolate({ inputRange: [0, 1], outputRange: ['20deg', '-45deg'] }) },
    ]
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* ▼▼▼ 画像挿入箇所 (背景のレンガ) ▼▼▼ */}
      <ImageBackground source={require('../../assets/quest_battle/renga.png')} resizeMode="repeat" style={styles.background}>
        {/* ▼ 戻るボタン */}
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Text style={styles.backButtonText}>← 戻る</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{params.name}</Text>
        <Text style={styles.title}>モンスター討伐中…</Text>

        <Button title={uploading ? 'アップロード中...' : '写真を撮る'} onPress={takePhoto} disabled={uploading} />
              {beforeUri && (
                <View style={{ marginBottom: 10 }}>
                  <Image source={{ uri: beforeUri }} style={{ width: 200, height: 200 }} />
                  <Text>宿題前</Text>
                </View>
              )}
        
              {afterUri && (
                <View>
                  <Image source={{ uri: afterUri }} style={{ width: 200, height: 200 }} />
                  <Text>宿題後</Text>
                </View>
              )}

        <View style={styles.monsterArea}>
          {/* ▼▼▼ 画像挿入箇所 (左の松明) ▼▼▼ */}
          <Image source={require('../../assets/images/torch.png')} style={styles.torchImage} />
          
          <View style={styles.monsterContainer}>
            {isQuestComplete ? (
              // --- クエスト完了後 ---
              // ▼▼▼ 画像挿入箇所 (宝箱) ▼▼▼
              <Image source={require('../../assets/quest_battle/giftbox.png')} style={styles.treasureImage} />
            ) : (
              // --- クエスト中 ---
              <>
                <Animated.Image 
                  source={getMonsterImage(quest.difficulty)} 
                  style={[styles.monsterImage, monsterWiggleStyle]} 
                />
                {/* 斬撃エフェクト (モンスターの上) */}
                <Animated.Image
                  // ▼▼▼ 画像挿入箇所 (攻撃エフェクト) ▼▼▼
                  source={require('../../assets/quest_battle/cut_01.png')}
                  style={[styles.slashImage, slashOpacity]}
                />
              </>
            )}
          </View>
          
          {/* ▼▼▼ 画像挿入箇所 (右の松明) ▼▼▼ */}
          <Image source={require('../../assets/images/torch.png')} style={styles.torchImage} />
        </View>

        {/* --- ▼▼▼ 修正: 画面下部の全要素をまとめるコンテナ ▼▼▼ --- */}
        <View style={styles.bottomContainer}>
          <View style={styles.playerEquipmentContainer}>
            {/* ▼▼▼ 画像挿入箇所 (盾) ▼▼▼ */}
            <Image source={require('../../assets/quest_battle/shield.png')} style={styles.shieldImage} />
            {/* ▼▼▼ 画像挿入箇所 (剣) ▼▼▼ */}
            <Animated.Image source={require('../../assets/quest_battle/sword.png')} style={[styles.swordImage, swordAttackStyle]} />
          </View>

          <View style={styles.buttonContainer}>
            <Pressable style={styles.button} onPress={handleUpload}>
              <Text style={styles.buttonText}>課題をアップロードする</Text>
            </Pressable>
            <Pressable style={[styles.button, styles.completeButton]} onPress={handleComplete}>
              <Text style={styles.buttonText}>課題完了を報告する</Text>
            </Pressable>
            
            {/* --- ▼▼▼ ここから追加 ▼▼▼ --- */}
            {/* 動作確認用の仮ボタン。最終的には削除します。 */}
            <Pressable style={[styles.button, {backgroundColor: '#3498db'}]} onPress={receiveClearSignal}>
              <Text style={styles.buttonText}>（仮）クリア信号を受信</Text>
            </Pressable>
            {/* --- ▲▲▲ ここまで追加 ▲▲▲ --- */}
          </View>
        </View>

      </ImageBackground>
    </SafeAreaView>
  );
};

export default QuestInProgressScreen;

const styles = StyleSheet.create({
  container: { flex: 1 },
  background: {
    flex: 1,
    alignItems: 'center',
    // --- ▼▼▼ 修正: 各要素を上下に均等配置 ▼▼▼ ---
    justifyContent: 'space-between',
    paddingVertical: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
  monsterArea: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  torchImage: { width: 40, height: 80, resizeMode: 'contain' },
  monsterContainer: {
    width: 200,
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 10,
  },
  monsterImage: { width: 150, height: 150, resizeMode: 'contain' },
  treasureImage: { width: 120, height: 120, resizeMode: 'contain' },
  slashImage: {
    width: 120,
    height: 120,
    resizeMode: 'contain',
    position: 'absolute',
  },
  // --- ▼▼▼ 修正: 画面下部全体のコンテナスタイル ▼▼▼ ---
  bottomContainer: {
    width: '100%',
    alignItems: 'center',
  },
  playerEquipmentContainer: {
    width: '80%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    // --- ▼▼▼ 修正: ボタンとの間に余白を追加 ▼▼▼ ---
    marginBottom: 20, 
    height: 120, // 高さを確保して剣の動きを見やすくする
  },
  shieldImage: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
  },
  swordImage: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    transform: [{ rotate: '20deg' }],
  },
  buttonContainer: {
    width: '80%',
  },
  button: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderWidth: 2,
    borderColor: '#fff',
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 15,
  },
  completeButton: { backgroundColor: '#c0392b' },
  buttonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  backButton: {
    backgroundColor: 'rgba(0,0,0,256)', // 半透明の背景
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});