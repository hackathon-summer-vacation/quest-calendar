import { createContext,useState  } from "react";

export const UserContext = createContext()

export function UserProvider({ children }) {
  const [user, setUser] = useState(null)

  async function login(username, password) {
    try {
      const res = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, password })
      });

      if (!res.ok) throw new Error("Login failed")
      const data = await res.json()
      setUser(data.user)
    } catch (err) {
      console.log("error when logging in")
    }
  }

  async function register(username, password) {
    
  }

  async function logout() {
    
  }

  return (
    <UserContext.Provider value={{ user, login, register, logout}}>
      {children}
    </UserContext.Provider>
  )
}