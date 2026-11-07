// useToast.js

import { useState, useCallback } from 'react'

export function useToast() {
  const [toasts, setToasts] = useState([])

  const push = useCallback((msg, type = 'default', duration = 2800) => {
    const id = crypto.randomUUID()
    setToasts(t => [...t, { id, msg, type }])
    setTimeout(() => {
      setToasts(t => t.filter(x => x.id !== id))
    }, duration)
  }, [])

  return { toasts, push }
}
