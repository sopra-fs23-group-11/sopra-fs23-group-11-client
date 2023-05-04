import React, {useContext, useEffect, useState} from 'react'
import {api, handleError} from "../../helpers/api.js";
import {Button, Stack, Alert, Text, Box, Spinner} from "@chakra-ui/react";
import { GameContext } from '../../contexts/GameContext.jsx';
import { Stomp } from 'stompjs/lib/stomp.js';
import { useNavigate } from 'react-router-dom';


export default function Host() {
  const [code, setCode] = useState(null)
  const {host, setHost, setJoiner} = useContext(GameContext)
  const [isJoined, setIsJoined] = useState(false)
  const [showCode, setShowCode] = useState(false)
  const[errorLogs, setErrorLogs] = useState([])
  const user = JSON.parse(sessionStorage.getItem("user"))
  const navigate = useNavigate()

  const error_logs = []

  const hostId = user.id

  async function generateLobbyCode() {
    try {
      const response = await api.post("/lobbies", JSON.stringify({ hostId }))
      localStorage.setItem("lobby",JSON.stringify(response));
      setCode(response.data.lobbyCode)
      setShowCode(true)

      setHost({hostId: response.data.hostId, hostName: response.data.hostName})
      console.log(host)

      const stompClient = Stomp.client("ws://localhost:8080/ws")
      stompClient.connect({}, ()=> {
      console.log("Stomp client connected !")
      stompClient.subscribe(`/join/${response.data.lobbyCode}`, onJoiner)
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
      await navigator.clipboard.writeText(code);

      error_logs.push("✓ Copied!");
    } catch (error) {
      console.error("Failed to copy code to clipboard: ", error);
      error_logs.push("Failed to copy code to clipboard.");
   }
   if(error_logs.length >0){
    setErrorLogs(error_logs)
  }

  }
  return (
    <div>
      <Button onClick={generateLobbyCode}>Get a Lobby Code</Button>
      {/*  */}
      
      {showCode && (
            <Box bg="gray.200" p="4" rounded="md" mt="4" position ="relative">
               {errorLogs.length > 0 &&
                <Stack position="absolute" top="0"  right="0" >
                {errorLogs.map(error => (
                <Alert status='error' variant="ghost" key={1}>
            {error}
                </Alert>
                ))}
            </Stack>
                }
              <Text md="2"> Your lobby code: </Text>
              <code>{code}</code>
              <Button mt="2" onClick={copyCodeToClipboard}>
                Copy code
              </Button>
              {
                isJoined ? 
                <Button mt="2" bg="blue.500" onClick={confirmCode}>
                  Continue
                </Button>
                :
                <>
                <Button mt="2" bg="blue.500">

                <Text>Waiting for Player to join</Text>
                <Spinner
                  thickness='4px'
                  speed='0.95s'
                  emptyColor='gray.200'
                  color='blue.500'
                  size='lg'
              />
                </Button>
                </>
              }
            </Box>
        )}
    </div>
  )
}
