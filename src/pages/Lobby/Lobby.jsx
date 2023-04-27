import {Box, Text, Button, Flex, Stack, Alert, AlertIcon} from "@chakra-ui/react"
import React, { useEffect, useState, useContext } from "react"
import { Link, useNavigate } from "react-router-dom"
import { api, handleError } from "../../helpers/api"
import { Stomp } from "stompjs/lib/stomp"
import { GameContext } from "../../contexts/GameContext"


function Lobby() {
  const [code, setCode] = useState(null)
  const [lobbyCode, setLobbyCode] = useState(null)
  const[showCode, setShowCode] = useState(false)
  const [isJoined, setIsJoined] = useState(null)
  const [socket, setSocket] = useState(null)
  const user = JSON.parse(sessionStorage.getItem("user"))
  const hostId = user.id
  const navigate = useNavigate()
  const[errorLogs, setErrorLogs] = useState([])
  let error_logs = []
  const {host, setHost, joiner, setJoiner} = useContext(GameContext)

  async function generateLobbyCode() {
    try {
      const response = await api.post("/host", JSON.stringify({ hostId }))
      setCode(response.data.lobbyCode)
      setLobbyCode(response.data.lobbyCode)
      setShowCode(true)
      setHost({hostId: response.data.hostId, hostName: response.data.hostName})
      console.log(host)

      const stompClient = Stomp.client("ws://localhost:8080/ws")
      setSocket(stompClient)
      stompClient.connect({}, ()=> {
      console.log("Stomp client connected !")
      stompClient.subscribe(`/game/${response.data.lobbyCode}`, onJoiner)
    })

      // See here to get more data.
      console.log(response.data)
    } catch (error) {
      console.error(
        `Something went wrong while fetching the users: \n${handleError(error)}`
      )
      console.error("Details:", error)
      alert(
        "Something went wrong while fetching the users! See the console for details."
      )
    }
  }

  function onJoiner(payload) {
    const payloadData = JSON.parse(payload.body)
    setIsJoined(payloadData)
    console.log(payloadData)
    setJoiner({joinerId: payloadData.joinerId, joinerName: payloadData.joinerName})

  }

  function confirmCode(){
    if(isJoined){
      setShowCode(false)
      navigate(`/game/${code}`)
    }else{
      alert("wait for player to join")
    }
  }

  async function copyCodeToClipboard() {
    try {
      await navigator.clipboard.writeText(lobbyCode);

      error_logs.push("✓ Copied!");
    } catch (error) {
      console.error("Failed to copy code to clipboard: ", error);
      error_logs.push("Failed to copy code to clipboard.");
   }
   if(error_logs.length >0){
     setErrorLogs(error_logs)
   }
  }


  /*useEffect(() => {
    if (code) {
      //navigate(`/chatroom/${code}`)
      navigate(`/game/${code}`)
    }
  }, [code])

  return (
    <>
      <Flex
        flexDirection="column"
        height="400px"
        gap="20px"
        justifyContent="center"
        alignItems="center"
      >
        <h2>Host ID: {host.hostId}</h2>
        <h2>Host Name: {host.hostName}</h2>
        <Button w="200px" size="lg" onClick={generateLobbyCode}>
          Host
        </Button>

        <Link to="join">
          <Button w="200px" size="lg">
            Join
          </Button>
        </Link>
      </Flex>
    </>
  )
}

export default Lobby
