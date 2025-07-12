import React, { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  Modal,
  FlatList,
  StyleSheet,
  Image,
  SafeAreaView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { getHomeWorkData } from '../../utils/getCalender';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AddQuestScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [titles, setTitles] = useState([
    { id: 1, name: 'ドリル' },
    { id: 2, name: 'レポート' },
    { id: 3, name: '予習' },
  ]);
  const [selectedQuest, setSelectedQuest] = useState(null);

  const handleChooseQuest = async () => {
    setModalVisible(true);
    try {
      const userId = await AsyncStorage.getItem('userId');
      const homeworks = await getHomeWorkData(userId);

      // 文字列の配列ではなく、idとnameを持つオブジェクト配列にする
      const titlesData = homeworks.map(item => ({
        id: item.id,
        name: item.title,
      }));
      setTitles(titlesData);
    } catch (err) {
      console.log(err);
    }
  };

  const handleStartQuest = () => {
    if (selectedQuest) {
      Alert.alert('クエストスタート！', `${selectedQuest.name}を始めよう！`);
      router.push(`../(quest_battle)/quest_battle`)
    } else {
      Alert.alert('おっと！', 'まずはクエストを選んでくれ。');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 上部エリア */}
      <View style={styles.topSection}>
        <Image
          source={require('../../assets/images/signboard.png')}
          style={styles.signImage}
        />
        <View style={styles.titleContainer}>
          <Image
            source={require('../../assets/images/tree.png')}
            style={styles.treeImage}
          />
          <Text style={styles.title}>クエストを始める...</Text>
          <Image
            source={require('../../assets/images/tree.png')}
            style={styles.treeImage}
          />
        </View>
      </View>

      {/* 中間エリア */}
      <View style={styles.middleSection}>
        <View style={styles.chooseQuestContainer}>
          {/* ▼▼▼ 画像挿入箇所② ▼▼▼ */}
          <Image source={require('../../assets/images/slime_purple.png')} style={styles.torchImage} />
          <Text style={styles.selectedQuestText}>課題をえらぶ</Text>
        </View>
        <View style={{ flex: 1, padding: 20 }}>
          <Text>選択中の課題:</Text>
          <TouchableOpacity
            style={styles.selectedQuestBox}
            onPress={handleChooseQuest}
          >
            <Text style={styles.selectedQuestText}>
              {selectedQuest ? selectedQuest.name : '課題を選択してください'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 下部エリア */}
      <View style={styles.bottomSection}>
        <View style={styles.torchContainer}>
          <Image
            source={require('../../assets/images/torch.png')}
            style={styles.torchImage}
          />
          <Image
            source={require('../../assets/images/torch.png')}
            style={styles.torchImage}
          />
        </View>
        <Pressable style={styles.startButton} onPress={handleStartQuest}>
          <Text style={styles.startButtonText}>クエストスタート</Text>
        </Pressable>
        <View style={styles.torchContainer}>
          <Image
            source={require('../../assets/images/torch.png')}
            style={styles.torchImage}
          />
          <Image
            source={require('../../assets/images/torch.png')}
            style={styles.torchImage}
          />
        </View>
      </View>

      {/* モーダル */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={modalStyles.modalContainer}>
          <View style={modalStyles.modalContent}>
            <Text style={modalStyles.modalTitle}>課題を選択してください</Text>
            <FlatList
              data={titles}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={modalStyles.questItem}
                  onPress={() => {
                    setSelectedQuest(item);
                    setModalVisible(false);
                    Alert.alert('課題を選択！', `${item.name}が選ばれたよ。`);
                  }}
                >
                  <Text style={modalStyles.questText}>{item.name}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
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
    marginHorizontal: 10,
  },
  middleSection: {
    width: '80%',
    alignItems: 'center',
  },
  selectedQuestBox: {
  width: '100%',
  height: 80,
  backgroundColor: '#ffedd5',
  borderWidth: 2,
  borderColor: '#d4d4d4',
  borderRadius: 10,
  justifyContent: 'center',  // ここで縦横中央に配置
  alignItems: 'center',      // これも忘れずに
  paddingHorizontal: 20,
},

selectedQuestText: {
  fontSize: 24,
  fontWeight: 'bold',
  color: '#333',
  textAlign: 'center', // テキストの中央寄せも入れると安心
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

const modalStyles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    marginHorizontal: 30,
    borderRadius: 10,
    maxHeight: '70%',
    paddingVertical: 20,
    paddingHorizontal: 15,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  questItem: {
    paddingVertical: 12,
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
  },
  questText: {
    fontSize: 16,
  },
  chooseQuestContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
});
