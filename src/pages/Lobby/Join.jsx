import React, { useState, useEffect } from "react"
import {Box, Button, Heading, Input} from "@chakra-ui/react"
import { api, handleError } from "../../helpers/api.js"
import { useNavigate } from "react-router"
import backgroundImage from './battleship.jpeg';

export default function Join() {
  const [lobbyCode, setLobbyCode] = useState("")
  const [isValidCode, setIsValidCode] = useState(false)
  const [hostId, setHostId] = useState("")
  const user = JSON.parse(localStorage.getItem("user"))
  const joinerId = user.id
  const navigate = useNavigate()

  async function submitCode() {
    try {
      const response = await api.put(
        "/join",
        JSON.stringify({ joinerId, lobbyCode })
      )
      console.log(response.ok, response.status, response.data)
      if (response.status === 200) {
        setIsValidCode(true)
        setHostId(response.data.hostId)
      }
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

  useEffect(() => {
    // effect callbacks are synchronous to prevent race conditions. So we put the async function inside:
    if (isValidCode) {
      console.log("effect ran...")
      localStorage.setItem("hostId" , hostId)
      //navigate(`/chatroom/${lobbyCode}`)
      navigate(`/setup/${lobbyCode}`)
    }
  }, [isValidCode])

  return (
    <Box
      height="20vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
      flexDirection="column">

      <Heading as="h1" color="blackAlpha.900" frontsize="4x1" mb={6}>
        Enter Roomcode</Heading>
      <div style={{display:"flex", alignItems:"center"}}>
      <Input
        value={lobbyCode}
        name="code"
        onChange={(e) => setLobbyCode(e.target.value)}
        htmlSize={4}
        width="auto"
        mr={6}
      />
      <Button onClick={submitCode}>submit code</Button>
      </div>
    </Box>
  )
}
