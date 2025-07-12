// frontend/screens/AddHomeworkScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage'


const AddHomeworkScreen = () => {
  const [userId, setUserId] = useState(0); // 仮ユーザーID
  const [title, setTitle] = useState('');
  const [deadline, setDeadline] = useState('');
  const [days, setDays] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState(0); // 0: habit, 1: pages, 2: research
  const [extra, setExtra] = useState({ frequency: 1, total_pages: 30, theme: '' });
  const [loading, setLoading] = useState(false);

  const submitHomework = async () => {
    if (!title || !deadline || !days) {
      Alert.alert('入力エラー', 'タイトル、締切、日数はすべて入力してください。');
      return;
    }



    setLoading(true);

    try {
      const userId = await AsyncStorage.getItem('userId');
      console.log("取得したuserId:", userId);

      const payload = {
        user_id: userId,
        title,
        deadline,
        days: Number(days),
        description,
        type: Number(type),
        extra
      };

      const res = await fetch(`http://localhost:8000/homework/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      console.log(res);
      const data = await res.json();
      console.log(data);

      Alert.alert('成功', '宿題が追加されました！');
      // 入力リセットも可能
      setTitle('');
      setDeadline('');
      setDays('');
      setDescription('');
      setExtra({ frequency: 1, total_pages: 30, theme: '' });

    } catch (error) {
      console.error(err);
      Alert.alert('エラー', '追加に失敗しました');
    } finally {
      setLoading(false);
    };
  }





  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.label}>タイトル</Text>
        <TextInput style={styles.input} value={title} onChangeText={setTitle} />

        <Text style={styles.label}>締切 (YYYY-MM-DD)</Text>
        <TextInput style={styles.input} value={deadline} onChangeText={setDeadline} />

        <Text style={styles.label}>日数</Text>
        <TextInput
          style={styles.input}
          value={days}
          onChangeText={setDays}
          keyboardType="numeric"
        />

        <Text style={styles.label}>説明</Text>
        <TextInput
          style={[styles.input, { height: 80 }]}
          value={description}
          onChangeText={setDescription}
          multiline
        />

        <Text style={styles.label}>タイプ</Text>
        <View style={styles.pickerWrapper}>
          <Picker selectedValue={type} onValueChange={(value) => setType(value)}>
            <Picker.Item label="習慣系 (habit)" value={0} />
            <Picker.Item label="ページ系 (pages)" value={1} />
            <Picker.Item label="研究系 (research)" value={2} />
          </Picker>
        </View>

        {type === 0 && (
          <>
            <Text style={styles.label}>頻度 (1:毎日, 2:毎週)</Text>
            <TextInput
              style={styles.input}
              value={String(extra.frequency)}
              onChangeText={(val) =>
                setExtra({ ...extra, frequency: Number(val) })
              }
              keyboardType="numeric"
            />
          </>
        )}

        {type === 1 && (
          <>
            <Text style={styles.label}>ページ数</Text>
            <TextInput
              style={styles.input}
              value={String(extra.total_pages)}
              onChangeText={(val) =>
                setExtra({ ...extra, total_pages: Number(val) })
              }
              keyboardType="numeric"
            />
          </>
        )}

        {type === 2 && (
          <>
            <Text style={styles.label}>研究テーマ</Text>
            <TextInput
              style={styles.input}
              value={extra.theme}
              onChangeText={(val) => setExtra({ ...extra, theme: val })}
            />
          </>
        )}

        <Button title="宿題を追加" onPress={submitHomework} disabled={loading} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16
  },
  scroll: {
    paddingBottom: 20
  },
  label: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: 'bold'
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    borderRadius: 4,
    marginTop: 4
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    marginTop: 4,
    marginBottom: 16
  }
});

export default AddHomeworkScreen;
