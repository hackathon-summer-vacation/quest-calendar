import * as ImagePicker from 'expo-image-picker';
import { Button, Image, View, Alert } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

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
