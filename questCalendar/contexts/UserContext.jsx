import { createContext, useEffect, useState } from "react";
import {
  ensureGuestUser,
  loginLocalUser,
  logoutLocalUser,
  registerLocalUser,
} from "../utils/localDataStore";

export const UserContext = createContext()

export function UserProvider({ children }) {
  const [user, setUser] = useState(null)

  useEffect(() => {
    ensureGuestUser()
      .then(setUser)
      .catch((err) => console.log("guest user load error", err));
  }, []);

  // ログイン処理は廃止。常にゲストユーザーとして入る。
  async function login() {
    try {
      const data = await loginLocalUser()
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

  // 登録処理も廃止。ゲストユーザーを保証するだけにする。
  async function register() {
    try {
      const message = await registerLocalUser()
      const guest = await ensureGuestUser()
      setUser(guest)
      return message
    } catch (err) {
      return "登録処理で問題が起きました。もう一度試してください。"
    }
  }

  // ログアウト処理
  async function logout() {
    try {
      const data = await logoutLocalUser()
      setUser(data.user)
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
