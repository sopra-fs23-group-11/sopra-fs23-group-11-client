import { Button, Flex } from "@chakra-ui/react"
import React, { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { api, handleError } from "../../helpers/api"

function Lobby() {
  const [code, setCode] = useState(null)
  const user = JSON.parse(localStorage.getItem("user"))
  const id = user.id
  const host = { id }
  const navigate = useNavigate()

  async function generateLobbyCode() {
    try {
      const response = await api.post("/host", JSON.stringify({ host }))
      setCode(response.data.lobbyCode)

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

  useEffect(() => {
    if (code) {
      navigate(`/chatroom/${code}`)
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
