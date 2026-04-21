import * as ImagePicker from 'expo-image-picker';
import { Button, Image, View, Alert, Text } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImageManipulator from 'expo-image-manipulator';
import { Platform } from 'react-native';
const resizeImage = async (uri) => {
  try {
    if (Platform.OS === 'web') {
      // Webはresizeなしでそのまま返す（もしくはbase64からBlobに変換）
      return uri;
    } else {
      const result = await ImageManipulator.manipulateAsync(
        uri,
        [{ resize: { width: 800 } }],
        { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
      );
      return result.uri;
    }
  } catch (error) {
    console.error('画像リサイズエラー:', error);
    throw error;
  }
};


export default function App() {
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

      // リサイズ実行
      const resizedUri = await resizeImage(localUri);

      if (stage === 'before') {
        setBeforeUri(resizedUri);
        Alert.alert('写真を記録しました', '宿題前の写真をこの端末内で表示します。');
        setStage('after');
      } else {
        setAfterUri(resizedUri);
        Alert.alert('写真を記録しました', '宿題後の写真をこの端末内で表示します。');
        setStage('before');
      }
    }
  };


  return (
    <SafeAreaView>
      <Button title="写真を撮る" onPress={takePhoto} />
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
