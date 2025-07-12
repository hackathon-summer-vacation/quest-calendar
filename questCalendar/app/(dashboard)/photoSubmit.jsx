import * as ImagePicker from 'expo-image-picker';
import { Button, Image, View, Alert, Text } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as ImageManipulator from 'expo-image-manipulator';

const resizeImage = async (uri) => {
  try {
    const result = await ImageManipulator.manipulateAsync(
      uri,
      [{ resize: { width: 800 } }], // 幅800pxにリサイズ
      { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
    );
    return result.uri;
  } catch (error) {
    console.error('画像リサイズエラー:', error);
    throw error;
  }
};

export default function App() {
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
      mediaTypes: ImagePicker.MediaTypeOptions.Images, // ここ修正
      quality: 1,
    });

    if (!result.canceled) {
      const localUri = result.assets[0].uri;

      const resizedUri = await resizeImage(localUri);

      if (stage === 'before') {
        setBeforeUri(resizedUri);
        await uploadToS3(resizedUri, 'before');  // リサイズ済URIを渡す
        setStage('after');
      } else {
        setAfterUri(resizedUri);
        await uploadToS3(resizedUri, 'after');
        setStage('before');
      }
    }
  };


  const uploadToS3 = async (localUri, label) => {
    try {
      setUploading(true);
      const userId = await AsyncStorage.getItem('userId');
      const questId = 10; //動的に取得する想定

      const key = `uploads/${label}-${userId}-${questId}.jpg`;

      const res = await fetch(`http://192.168.0.108:8000/photo/get-signed-url?key=${encodeURIComponent(key)}`);
      const data = await res.json();
      const url = data.url;

      // ここは渡されたURIをそのまま使う
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


  return (
    <SafeAreaView>
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

    </SafeAreaView>
  );
}