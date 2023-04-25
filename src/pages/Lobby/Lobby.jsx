import { Box, Text, Button, Flex } from "@chakra-ui/react"
import React, { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { api, handleError } from "../../helpers/api"

function Lobby() {
  const [code, setCode] = useState(null)
  const [lobbyCode, setLobbyCode] = useState(null)
  const[showCode, setShowCode] = useState(false)
  const user = JSON.parse(localStorage.getItem("user"))
  const hostId = user.id
  console.log("users",user)
  const navigate = useNavigate()

  async function generateLobbyCode() {
    try {
      const response = await api.post("/host", JSON.stringify({ hostId }))
      setCode(response.data.lobbyCode)
      setLobbyCode(response.data.lobbyCode)
      setShowCode(true)

      // See here to get more data.
      console.log(response)
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

  function confirmCode(){
    setShowCode(false)
    navigate(`/setup/${code}`)
  }

  /*useEffect(() => {
    if (code) {
      //navigate(`/chatroom/${code}`)
      navigate(`/setup/${code}`)
    }
  }, [code])*/

  return (
    <>
      <Flex
        flexDirection="column"
        height="400px"
        gap="20px"
        justifyContent="center"
        alignItems="center"
      >
        <Button w="200px" size="lg" onClick={generateLobbyCode}>
          Host
        </Button>

        <Link to="join">
          <Button w="200px" size="lg">
            Join
          </Button>
        </Link>

        {showCode && (
            <Box bg="gray.200" p="4" rounded="md" mt="4">
              <Text md="2"> Your lobby code: </Text>
              <code>{lobbyCode}</code>
              <Button mt="2" onClick={confirmCode}>
                Start Game
              </Button>
            </Box>
        )}
      </Flex>
    </>
  )
}

export default Lobby
