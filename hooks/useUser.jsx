import { useContext } from 'react'
import { UserContext } from '../questCalendar/contexts/UserContext'

export function useUser() {
  const context = useContext(UserContext) // user, login, logout, register

  // if the context is accessed outside of the UserContext.Provider
  if (!context) {
    throw new Error("useUser must be used within a UserProvider")
  }

  return context
}