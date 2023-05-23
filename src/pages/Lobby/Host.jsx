import React, { useContext, useEffect, useState } from "react"
import { api } from "../../helpers/api.js"
import {
  Button,
  Alert,
  Text,
  Box,
  Spinner,
  Collapse,
  AlertIcon,
  Heading,
  Tag,
} from "@chakra-ui/react"
import { GameContext } from "../../contexts/GameContext.jsx"
import { Stomp } from "stompjs/lib/stomp.js"
import { useNavigate } from "react-router-dom"
import { getDomainWebsocket } from "../../helpers/getDomainWebsocket.js"
import { CopyIcon, CheckIcon } from "@chakra-ui/icons"
import AnimationContainer from "../../components/AnimationContainer.jsx"
import {
  lobbyVariants,
  navigationButtonVariant,
} from "../../animations/variants.js"
// import RefreshRedirect from "../../components/RefreshRedirect.jsx"

function Host() {
  const [code, setCode] = useState(null)
  const { user, setUser, lobby, setLobby } = useContext(GameContext)
  const [isJoined, setIsJoined] = useState(false)
  const [showCode, setShowCode] = useState(false)
  const [copied, setCopied] = useState(false)
  const [errorLogs, setErrorLogs] = useState(null)
  const navigate = useNavigate()

  console.log(user)
  console.log(lobby)

  useEffect(() => {

    if (user.id === null)
    throw ({
      message: "The User does not exist", 
      desc: " You may have accidentally refreshed the site"
    })

    if (isJoined) {
      setTimeout(() => {
        navigate(`/setup/${code}`)
      }, 2000)
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
      }, 10000)
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
      {/* <RefreshRedirect redirectTo="/lobby" /> */}
      <Box
        height="50vh"
        display="flex"
        flexDirection="column"
        justifyContent="space-evenly"
        alignItems="center"
      >
        <Heading color="#015871">Host a Game Session</Heading>
        {errorLogs && (
          <Alert status="error" maxW={200} borderRadius="full">
            <AlertIcon />
            {errorLogs.errorMessage}
          </Alert>
        )}
        <Collapse in={showCode} animateOpacity>
          <Box bg="transparent" rounded="md" position="relative">
            <Box
              w="100%"
              display="flex"
              flexDirection="column"
              alignItems="center"
            >
              <Text fontSize="lg">Your lobby code:</Text>
              <Tag m={4} size="lg" variant="subtle">
                {code}
              </Tag>
              <Button
                variant="brand"
                icon={copied ? <CheckIcon /> : <CopyIcon />}
                onClick={copyCode}
              >
                {copied ? "✓ Copied!" : "📋 Copy code"}
              </Button>
            </Box>
          </Box>
        </Collapse>

        <Button
          onClick={generateLobbyCode}
          variant="brand"
          mb="4"
          size="lg"
          w="200px"
          isDisabled={isJoined || showCode}
          isLoading={isJoined || showCode}
          loadingText={isJoined ? "Player joined!" : showCode ?  "Waiting for a Player": ""}
        >
          Get a Lobby Code
        </Button>

        {/* {!isJoined && showCode && (
          <AnimationContainer variants={navigationButtonVariant}>
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="space-around"
            >


              <Text m={3}>Waiting for Player to join</Text>
              <Spinner
                thickness="4px"
                speed="0.95s"
                emptyColor="gray.200"
                size="lg"
              />
            </Box>
          </AnimationContainer>
        )} */}

        {/* {isJoined && (
          <AnimationContainer variants={navigationButtonVariant}>
            <Text>Player Joined, will redirect shortly</Text>
          </AnimationContainer>
        )} */}
      </Box>
    </AnimationContainer>
  )
}

export default Host
