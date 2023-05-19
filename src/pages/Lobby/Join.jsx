import React, { useState, useEffect, useContext } from "react"
import { Button, Heading, Input, Box, Alert, AlertIcon } from "@chakra-ui/react"

import { api, handleError } from "../../helpers/api.js"
import { useNavigate } from "react-router"
import { GameContext } from "../../contexts/GameContext.jsx"
import AnimationContainer from "../../components/AnimationContainer.jsx"
import { lobbyVariants } from "../../animations/variants.js"

function Join() {
  const [lobbyCode, setLobbyCode] = useState("")
  const [isValidCode, setIsValidCode] = useState(false)
  const [errorLogs, setErrorLogs] = useState(null)
  const navigate = useNavigate()
  const { user, setUser, lobby, setLobby } = useContext(GameContext)
  const joinerId = user.id

  async function submitCode() {
    try {
      const response = await api.put(
        "/lobbies",
        JSON.stringify({ joinerId, lobbyCode })
      )
      console.log(response.ok, response.status, response.data)
      if (response.status === 200) {
        setIsValidCode(true)
        setLobby(response.data)
        setUser({ ...user, isHost: false }) //a user that hosted a lobby before, but wants to join a lobby now
      }
    } catch (error) {
      setErrorLogs(error.response.data)
    }
  }

  useEffect(() => {
    // effect callbacks are synchronous to prevent race conditions. So we put the async function inside:
    if (isValidCode) {
      console.log("effect ran...")
      setTimeout(() => {
        navigate(`/setup/${lobbyCode}`)
      }, 1000)
    }
  }, [isValidCode])

  const goLobby = () => {
        navigate(`/lobby`)
        // start new game
    }

  return (
    <AnimationContainer variants={lobbyVariants}>
      <Box
        height="20vh"
        display="flex"
        justifyContent="space around"
        alignItems="center"
        flexDirection="column"
      >
        <Heading as="h1" color="blackAlpha.900" frontsize="4x1" mb={6}>
          Enter RoomCode
        </Heading>
        <div style={{ display: "flex", alignItems: "center" }}>
          <Input
            value={lobbyCode}
            name="code"
            onChange={(e) => setLobbyCode(e.target.value)}
            htmlSize={4}
            width="auto"
            mr={6}
          />
          <Button variant="brand" onClick={submitCode} isDisabled={isValidCode}>
            {!isValidCode ? "submit code" : "will redirect shortly..."}
          </Button>
        </div>
        {errorLogs && (
          <Alert status="error" maxW={200}>
            <AlertIcon />
            {errorLogs.errorMessage}
          </Alert>
        )}
        <Button
              onClick={goLobby}
              variant="brand"
              size="lg"
              w="230px"
              mt="10"
              h="200px"

          >
            Main Menu
          </Button>
      </Box>
    </AnimationContainer>
  )
}

export default Join
