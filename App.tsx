// App.tsx
import React, { useState } from 'react';
import { SafeAreaView, TextInput, Button, Text, View } from 'react-native';
import Amplify, { Auth, API, graphqlOperation } from 'aws-amplify';
import awsconfig from './src/aws-exports';
import { createHomework } from './src/graphql/mutations';

Amplify.configure(awsconfig);

export default function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState<any>(null);

  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');

  const [message, setMessage] = useState('');

  const signUp = async () => {
    try {
      await Auth.signUp({
        username: email,
        password,
        attributes: { email },
      });
      setMessage('サインアップ成功！ログインしてください。');
    } catch (err) {
      setMessage(`サインアップ失敗: ${err}`);
    }
  };

  const signIn = async () => {
    try {
      const u = await Auth.signIn(email, password);
      setUser(u);
      setMessage('ログイン成功！');
    } catch (err) {
      setMessage(`ログイン失敗: ${err}`);
    }
  };

  const registerHomework = async () => {
    if (!user) {
      setMessage('ログインしてください。');
      return;
    }
    try {
      const result = await API.graphql(
        graphqlOperation(createHomework, {
          input: {
            userId: user.username,
            title,
            dueDate,
          },
        })
      );
      setMessage(`宿題を登録しました: ${JSON.stringify(result)}`);
    } catch (err) {
      setMessage(`宿題登録失敗: ${err}`);
    }
  };

  return (
    <SafeAreaView style={{ padding: 20 }}>
      {!user && (
        <View>
          <Text>メール:</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            style={{ borderWidth: 1, marginBottom: 10 }}
          />
          <Text>パスワード:</Text>
          <TextInput
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={{ borderWidth: 1, marginBottom: 10 }}
          />
          <Button title="サインアップ" onPress={signUp} />
          <Button title="ログイン" onPress={signIn} />
        </View>
      )}

      {user && (
        <View>
          <Text>宿題のタイトル:</Text>
          <TextInput
            value={title}
            onChangeText={setTitle}
            style={{ borderWidth: 1, marginBottom: 10 }}
          />
          <Text>締め切り (YYYY-MM-DD):</Text>
          <TextInput
            value={dueDate}
            onChangeText={setDueDate}
            style={{ borderWidth: 1, marginBottom: 10 }}
          />
          <Button title="宿題を登録" onPress={registerHomework} />
        </View>
      )}

      <Text style={{ marginTop: 20 }}>{message}</Text>
    </SafeAreaView>
  );
}
