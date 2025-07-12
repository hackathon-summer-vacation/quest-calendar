import { Auth } from 'aws-amplify';

async function signUp(username, password, email) {
  try {
    const { user } = await Auth.signUp({
      username,
      password,
      attributes: {
        email, // メールアドレスを属性として登録
      },
      autoSignIn: { enabled: true } // 登録後自動ログイン
    });
    console.log('ユーザー登録成功:', user);
    
    // 登録成功時は成功メッセージを返す（メール確認が必要なため）
    return "ユーザー登録が完了しました。確認メールをチェックしてください。";
  } catch (error) {
    console.error('ユーザー登録エラー:', error);
    
    // エラー時はエラーメッセージを返す
    return error.message || "ユーザー登録に失敗しました。";
  }
}

async function signIn(username, password) {
  try {
    const user = await Auth.signIn(username, password);
    console.log('ログイン成功:', user);
    
    // Cognitoは3種類のトークンを提供
    const session = user.signInUserSession;
    
    return {
      user: user,
      userId: user.attributes?.sub || user.username,
      // アクセストークン（API呼び出し用）
      accessToken: session.accessToken.jwtToken,
      // IDトークン（ユーザー情報含む）
      idToken: session.idToken.jwtToken,
      // リフレッシュトークン（トークン更新用）
      refreshToken: session.refreshToken.token,
      username: user.username
    };
  } catch (error) {
    console.error('ログインエラー:', error);
    return error.message || "ログインに失敗しました。";
  }
}

// ログアウト機能
async function signOut() {
  try {
    await Auth.signOut();
    return "ログアウトしました。";
  } catch (error) {
    console.error('ログアウトエラー:', error);
    return "ログアウトに失敗しました。";
  }
}

// エクスポート
export { signUp, signIn, signOut };
