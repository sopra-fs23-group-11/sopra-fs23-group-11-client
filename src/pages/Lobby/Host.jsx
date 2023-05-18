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
  Toast,
  AlertIcon, Flex, Heading,
} from "@chakra-ui/react"
import { GameContext } from "../../contexts/GameContext.jsx"
import { Stomp } from "stompjs/lib/stomp.js"
import { useNavigate } from "react-router-dom"
import { getDomainWebsocket } from "../../helpers/getDomainWebsocket.js"
import { CopyIcon, CheckIcon } from "@chakra-ui/icons"
import AnimationContainer from "../../components/AnimationContainer.jsx"
import { lobbyVariants } from "../../animations/variants.js"
import {motion} from "framer-motion";

function Host() {
  const [code, setCode] = useState(null)
  const { user, setUser, lobby, setLobby } = useContext(GameContext)
  const [isJoined, setIsJoined] = useState(false)
  const [showCode, setShowCode] = useState(false)
  const [showMessage, setShowMessage] = useState(false)
  const [copied, setCopied] = useState(false)
  const [errorLogs, setErrorLogs] = useState(null)
  const navigate = useNavigate()

  console.log(user)
  console.log(lobby)

  useEffect(() => {
    if (isJoined) {
      setTimeout(() => {
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
      setErrorLogs(error.response.data)
    }
  }

      const goLobby = () => {
        navigate(`/lobby`)
        // start new game
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

  const copyCode = () => {
    if (window.isSecureContext && navigator.clipboard) {
      navigator.clipboard.writeText(code).then(() => {
        setCopied(true)

        setTimeout(() => {
          setCopied(false)
        }, 3000)
      })
    } else {
      unsecuredCopyToClipboard(code)
      setCopied(true)

      setTimeout(() => {
        setCopied(false)
      }, 3000)
    }
  }

  function unsecuredCopyToClipboard(text) {
    const textArea = document.createElement("textarea")
    textArea.value = text
    document.body.appendChild(textArea)
    textArea.focus()
    textArea.select()
    try {
      document.execCommand("copy")
    } catch (err) {
      console.error("Unable to copy to clipboard", err)
    }
    document.body.removeChild(textArea)
  }

  return (
    <AnimationContainer variants={lobbyVariants}>
      <Box
        height="50vh"
        display="flex"
        flexDirection="column"
        justifyContent="space-evenly"
        alignItems="center"
      >
        <Heading>Host a Game Session</Heading>
        {errorLogs && (
          <Alert status="error" maxW={200}>
            <AlertIcon />
            {errorLogs.errorMessage}
          </Alert>
        )}
        <Collapse in={showCode} animateOpacity>
          <Box bg="transparent" p="4" rounded="md" mt="4" position="relative">
            <Box
              w="100%"
              display="flex"
              flexDirection="column"
              alignItems="center"
            >
              <Text md="2" fontSize="lg" mb="5">
                {" "}
                Your lobby code:{" "}
              </Text>
              <Box width="100%">
                <code>{code}</code>
                <Button
                  variant="brand"
                  icon={copied ? <CheckIcon /> : <CopyIcon />}
                  onClick={copyCode}
                  ml="20px"
                >
                  {copied ? "✓ Copied!" : "📋 Copy code"}
                </Button>
              </Box>
            </Box>
          </Box>
        </Collapse>



        <Flex
         flexDirection="column"
        >
          <Button
              onClick={generateLobbyCode} variant="brand" mb = "4"
              size="lg" w="200px">
          Get a Lobby Code
          </Button>
          <Button
              onClick={goLobby} variant="brand" size="lg" w="200px"
          >
            Back to Lobby
          </Button>
        </Flex>


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
