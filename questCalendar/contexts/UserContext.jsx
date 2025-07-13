import { createContext,useState  } from "react";

export const UserContext = createContext()

export function UserProvider({ children }) {
  const [user, setUser] = useState(null)

  // ログイン処理 resには成功したら{"token": token, "user": user}のjsonファイルが返ってくる
  // 失敗すると、失敗メッセージが返ってくる
  async function login(username, password) {
    try {
      const res = await fetch("http://localhost:8000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, password })
      });

      if (!res.ok) {
        const message = await res.text()
        return message
      } else {
        const data = await res.json()
        setUser(data.user)
        return data
      }
    } catch (err) {
      console.log(err)
      console.log("error when logging in")
      return "サーバーで問題が起きました。もう一度試してください。"
    }
  }

  // 登録処理、 登録できれば、成功メッセージ、できなければ失敗メッセージを返す
  async function register(username, password) {
    try {
      const res = await fetch("http://localhost:8000/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, password })
      });

      const message = await res.text()
      return message
    } catch (err) {
      return "サーバーで問題が起きました。もう一度試してください。"
    }
  }

  // ログアウト処理
  async function logout() {
    try {
      const res = await fetch("http://localhost:8000/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        }
      });

      if (!res.ok) throw new Error("Logout failed")
      const data = await res.json()
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