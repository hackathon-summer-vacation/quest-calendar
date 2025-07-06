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
        message = await res.text()
        return message
      } else {
        const data = await res.json()
        setUser(data.user)
        return data
      }
    } catch (err) {
      console.log(err)
      console.log("error when logging in")
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

      message = await res.text()
      return message
    } catch (err) {
      return "サーバーで問題が起きました。もう一度試してください。"
    }
  }

  // ログアウト処理 (未完成)
  async function logout() {
    try {
      const res = await fetch("http://localhost:8000/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, password })
      });

      if (!res.ok) throw new Error("Register failed")
      const data = await res.json()
    } catch (err) {
      console.log("error when registering")
    }
  }

  return (
    <UserContext.Provider value={{ user, login, register, logout}}>
      {children}
    </UserContext.Provider>
  )
}