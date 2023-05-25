import { getDomainWebsocket } from "../helpers/getDomainWebsocket"
import React, { useEffect } from "react"
import { Stomp } from "stompjs/lib/stomp"

export default function RefreshHandler({ lobbyCode }) {
  useEffect(() => {
    const handleRefresh = (e) => {
      e.preventDefault()
      e.returnValue = "" // Chrome requires a returnValue to show a confirmation dialog
      // Redirect the user to the desired page
      console.log(lobbyCode)
    }
    
    window.addEventListener("beforeunload", handleRefresh)
    // const socket = Stomp.client(getDomainWebsocket())
    
    // return () => {
    //   window.removeEventListener("beforeunload", handleRefresh)
    //   socket.connect({}, () => {
    //     socket.send("/app/leave", {}, JSON.stringify({ lobbyCode }))
    //   })
    // }
  }, [])

  return <></> // Empty fragment as the component doesn't render anything
}
