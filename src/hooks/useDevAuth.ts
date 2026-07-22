import { useCallback, useEffect, useState } from 'react'
import { isDevAuthenticated, setDevAuthenticated, verifyDevPassword } from '../lib/devApi'

export function useDevAuth() {
  const [isDev, setIsDev] = useState(() => isDevAuthenticated())

  useEffect(() => {
    setIsDev(isDevAuthenticated())
  }, [])

  const login = useCallback(async (password: string) => {
    const ok = await verifyDevPassword(password)
    setIsDev(ok)
    return ok
  }, [])

  const logout = useCallback(() => {
    setDevAuthenticated(false)
    setIsDev(false)
  }, [])

  return { isDev, login, logout }
}
