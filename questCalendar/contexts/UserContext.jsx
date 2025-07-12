import { createContext, useState } from "react";
import { signUp, signIn, signOut } from "../app/(auth)/authCognito";

export const UserContext = createContext()

export function UserProvider({ children }) {
  const [user, setUser] = useState(null)

  // ログイン処理 resには成功したら{"token": token, "user": user}のjsonファイルが返ってくる
  // 失敗すると、失敗メッセージが返ってくる
  async function login(username, password) {
    try {
      const res = await signIn(username, password);

      if (typeof res === "string") {
        return res; // エラーメッセージ
      } else {
        setUser(res.user);
        return res; // ユーザー情報とトークン
      }
    } catch (err) {
      console.log(err);
      console.log("error when logging in");
      return "ログインに失敗しました。";
    }
  }

  // 登録処理、 登録できれば、成功メッセージ、できなければ失敗メッセージを返す
  async function register(username, password, email) {
    try {
      const res = await signUp(username, password, email);
      return res; // 成功/失敗メッセージ
    } catch (err) {
      return "サーバーで問題が起きました。もう一度試してください。";
    }
  }

  // ログアウト処理
  async function logout() {
    try {
      const res = await signOut();
      setUser(null);
      return res; // 成功/失敗メッセージ
    } catch (err) {
      console.log("error when logging out");
      return "ログアウトに失敗しました。";
    }
  }

  return (
    <UserContext.Provider value={{ user, login, register, logout }}>
      {children}
    </UserContext.Provider>
  )
}