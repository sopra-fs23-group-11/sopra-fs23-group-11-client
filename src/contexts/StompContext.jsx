import React, { createContext, useEffect, useState } from "react"
import { Stomp } from "stompjs/lib/stomp"

export const StompContext = createContext(null)

export default function StompProvider({ children }) {
  const [stompClient, setStompClient] = useState(null)

  useEffect(() => {
    const socket = Stomp.client("ws://localhost:8080/ws")
    setStompClient(socket)

    socket.connect({}, () => {
      console.log("Stomp client connected")
    })

    return () => socket.disconnect()
  }, [])
  return (
    <StompContext.Provider value={stompClient}>
      {children}
    </StompContext.Provider>
  )
}
