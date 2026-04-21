import { createContext, useEffect, useState } from "react";
import {
  getCurrentUser,
  loginLocalUser,
  logoutLocalUser,
  registerLocalUser,
} from "../utils/localDataStore";

export const UserContext = createContext()

export function UserProvider({ children }) {
  const [user, setUser] = useState(null)

  useEffect(() => {
    getCurrentUser()
      .then(setUser)
      .catch((err) => console.log("local user load error", err));
  }, []);

  // ログイン処理。GitHub Pagesでも動くようにローカルJSON/AsyncStorageだけを使う。
  async function login(username, password) {
    try {
      const data = await loginLocalUser(username, password)
      if (typeof data !== "string") {
        setUser(data.user)
      }
      return data
    } catch (err) {
      console.log(err)
      console.log("error when logging in")
      return "ログイン処理で問題が起きました。もう一度試してください。"
    }
  }

  // 登録処理。データはブラウザ/端末内に保存される。
  async function register(username, password) {
    try {
      return await registerLocalUser(username, password)
    } catch (err) {
      return "登録処理で問題が起きました。もう一度試してください。"
    }
  }

  // ログアウト処理
  async function logout() {
    try {
      const data = await logoutLocalUser()
      setUser(null)
      return data
    } catch (err) {
      console.log("error when logging out")
      return "ログアウトに失敗しました。"
    }
  }

  return (
    <UserContext.Provider value={{ user, login, register, logout}}>
      {children}
    </UserContext.Provider>
  )
}
