import React, { createContext, useEffect, useState } from "react"
import { Stomp } from "stompjs/lib/stomp"

export const StompContext = createContext(null)

export default function StompProvider({ children }) {
  const [stompClient, setStompClient] = useState(null)
  const [isReady, setIsReady] = useState(null)

  useEffect(() => {
    const socket = Stomp.client("ws://localhost:8080/ws")
    

    socket.connect({}, () => {
      console.log("Stomp client connected")
      setStompClient(socket)
    })
    setIsReady(true)

    
  }, [])

  if(!isReady) return <div>Loading...</div>

  return (
    <StompContext.Provider value={stompClient}>
      {children}
    </StompContext.Provider>
  )
}
