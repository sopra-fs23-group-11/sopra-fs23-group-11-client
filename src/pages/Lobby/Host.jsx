import React, { useContext, useEffect, useState } from "react"
import { api, handleError } from "../../helpers/api.js"
import {
  Button,
  Stack,
  Alert,
  Text,
  Box,
  Spinner,
  IconButton,
  useToast,
  position,
  Collapse,
  Toast
} from "@chakra-ui/react"
import { GameContext } from "../../contexts/GameContext.jsx"
import { Stomp } from "stompjs/lib/stomp.js"
import { useNavigate } from "react-router-dom"
import { getDomainWebsocket } from "../../helpers/getDomainWebsocket.js"
import { CopyIcon, CheckIcon } from "@chakra-ui/icons"
import AnimationContainer from "../../components/AnimationContainer.jsx"
function Host() {
  const [code, setCode] = useState(null)
  const { user, setUser, lobby, setLobby } = useContext(GameContext)
  const [isJoined, setIsJoined] = useState(false)
  const [showCode, setShowCode] = useState(false)
  const [showMessage, setShowMessage] = useState(false)
  const [copied, setCopied] = useState(false)
  const [errorLogs, setErrorLogs] = useState([])
  const navigate = useNavigate()
  const toast = useToast()

  const error_logs = []
  console.log(user)
  console.log(lobby)

  useEffect(() => {
    if (isJoined) {
      setTimeout(()=>{
        navigate(`/setup/${code}`)
      }, 1000)
    }
  }, [isJoined])


  async function generateLobbyCode() {
    const hostId = user.id
    try {
      const response = await api.post("/lobbies", JSON.stringify({ hostId }))
      console.log(response.data)
      setCode(response.data.lobbyCode)
      setShowCode(true)
      setUser((prev) => ({ ...prev, isHost: true }))
      setLobby(response.data)

      const stompClient = Stomp.client(getDomainWebsocket())
      stompClient.connect({}, () => {
        console.log("Stomp client connected !")
        stompClient.subscribe(`/join/${response.data.lobbyCode}`, onJoiner)
      })
    } catch (error) {
      console.error(
        `Something went wrong while trying to create lobby: \n${handleError(
          error
        )}`
      )
      console.error("Details:", error)
      alert(
        "Something went wrong while trying to create lobby! See the console for details."
      )
    }
  }

  function onJoiner(payload) {
    const payloadData = JSON.parse(payload.body)
    setIsJoined(true)
    console.log(payloadData)
    setLobby((lobby) => ({
      ...lobby,
      joinerId: payloadData.joinerId,
      joinerName: payloadData.joinerName,
    }))
  }

  function confirmCode() {
    if (isJoined) {
      setShowCode(false)
      navigate(`/setup/${code}`)
    } else {
      alert("wait for player to join")
    }
  }


  const copyCode = () => {
    navigator.clipboard.writeText(code).then(() => {

      setCopied(true)

      setTimeout(() => {

        setCopied(false)
      }, 3000)
    })
  }

  return (
    <AnimationContainer>

    <Box
      height="50vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
    >
      <Collapse in={showCode} animateOpacity>
        <Box bg="transparent" p="4" rounded="md" mt="4" position="relative">

          <Box
            w="100%"
            display="flex"
            flexDirection="column"
            alignItems="center"
          >
            <Text md="2" fontSize='lg' mb='5' > Your lobby code: </Text>
            <Box width="100%">
              <code>{code}</code>
              <Button
                  icon={copied ? <CheckIcon /> : <CopyIcon />}
                  onClick={copyCode}
                  ml="20px">
                {copied ? "✓ Copied!" : "📋 Copy code"}
              </Button>
            </Box>

          </Box>

          {/* <Button mt="2" onClick={copyCodeToClipboard}>
            Copy code
          </Button> */}
        </Box>
      </Collapse>


      <Button onClick={generateLobbyCode}>Get a Lobby Code</Button>
      {!isJoined && showCode && (
        <Box pt="1em" marginRight="auto" marginLeft="auto">
          {/* <Button mt="2" bg="blue.500"> */}

          <Text>Waiting for Player to join</Text>
          <Spinner
            thickness="4px"
            speed="0.95s"
            emptyColor="gray.200"
            color="blue.500"
            size="lg"
          />
        </Box>
      )}

      {isJoined && <Text>Player Joined, will redirect shortly</Text>}
    </Box>
    </AnimationContainer>
  )
}

export default Host
