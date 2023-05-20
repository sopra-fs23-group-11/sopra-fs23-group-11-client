import React, { useState, useEffect, useContext } from "react"
import { Button, Heading, Input, Box, Alert, AlertIcon } from "@chakra-ui/react"

import { api } from "../../helpers/api.js"
import { useNavigate } from "react-router"
import { GameContext } from "../../contexts/GameContext.jsx"
import AnimationContainer from "../../components/AnimationContainer.jsx"
import { lobbyVariants } from "../../animations/variants.js"

function Join() {
  const [lobbyCode, setLobbyCode] = useState("")
  const [isValidCode, setIsValidCode] = useState(false)
  const [errorLogs, setErrorLogs] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()
  const { user, setUser, setLobby } = useContext(GameContext)
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
      setIsSubmitting(false)
    }
  }

  function runAfterTimeout(callback, timeout) {
    setIsSubmitting(true)
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(callback());
      }, timeout)
    })
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

  return (
    <AnimationContainer variants={lobbyVariants}>
      <Box
        display="flex"
        justifyContent="space evenly"
        alignItems="center"
        flexDirection="column"
      >
        <Heading as="h1" frontsize="4x1" mb={6}>
          Enter a Lobby Code
        </Heading>
        <Input
          value={lobbyCode}
          name="code"
          onChange={(e) => setLobbyCode(e.target.value)}
          htmlSize={4}
          width="auto"
          mb={5}
          p={5}
        />

        <Button
          variant="brand"
          onClick={() => runAfterTimeout(submitCode, 2000)}
          isDisabled={isValidCode || !lobbyCode}
          isLoading={isSubmitting || isValidCode}
          loadingText={
            isValidCode ? "Will redirect shortly" : "submitting code"
          }
        >
          Submit Code
        </Button>
        {errorLogs && (
          <Alert status="error" maxW={200} borderRadius="full">
            <AlertIcon />
            {errorLogs.errorMessage}
          </Alert>
        )}
      </Box>
    </AnimationContainer>
  )
}

export default Join
