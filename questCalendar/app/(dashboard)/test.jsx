import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet } from 'react-native';

const QuestSelectorScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [titles, setTitles] = useState([
    { id: 1, name: 'ドリル' },
    { id: 2, name: 'レポート' },
    { id: 3, name: '予習' },
  ]);
  const [selectedQuest, setSelectedQuest] = useState(null);

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text>選択中の課題:</Text>
      <TouchableOpacity
        style={styles.selectedQuestBox}
        onPress={() => setModalVisible(true)}
      >
        <Text>{selectedQuest ? selectedQuest.name : '課題を選択してください'}</Text>
      </TouchableOpacity>

      {/* ここにModalを置く */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>課題を選択してください</Text>
            {titles.map((quest) => (
              <TouchableOpacity
                key={quest.id}
                style={styles.questItem}
                onPress={() => {
                  setSelectedQuest(quest);
                  setModalVisible(false);
                }}
              >
                <Text>{quest.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  selectedQuestBox: {
    padding: 12,
    backgroundColor: '#eee',
    marginTop: 8,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    margin: 20,
    borderRadius: 8,
    padding: 16,
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 12,
  },
  questItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
});

export default QuestSelectorScreen;
