import {Text, Button, Flex, Box, IconButton, Collapse} from "@chakra-ui/react"

import React, { useContext, useEffect, useState} from "react"

import { Link, useNavigate } from "react-router-dom"
import { GameContext } from "../../contexts/GameContext"
import { api } from "../../helpers/api.js"
import { motion } from "framer-motion"
import AnimationContainer from "../../components/AnimationContainer"
import {InfoIcon} from "@chakra-ui/icons";
import { lobbyVariants } from "../../animations/variants"


function Lobby() {
  const userId = JSON.parse(sessionStorage.getItem("userId"))
  const { user, setUser } = useContext(GameContext)
  const [showRules, setShowRules] = useState(false);
  const navigate = useNavigate()

  useEffect(() => {
    async function host() {
      try {
        const response = await api.get("/users/" + userId)
        console.log(response.data)
        setUser((user) => ({
          ...user,
          id: response.data.id,
          name: response.data.username,
          avatar: response.data.avatar,
          isHost: false,
          totalWins: response.data.totalWins,
        }))
      } catch (error) {
        console.log(error.message)
      }
    }

    host()
  }, [])

  const logout = () => {
    localStorage.removeItem("token")
    navigate("/")
  }
  const toggleRules = () => {
    setShowRules(!showRules)
  }

  return (
    <AnimationContainer variants={lobbyVariants}>
      <Flex
        flexDirection="column"
        height="70vh"
        gap="20px"
        justifyContent="center"
        alignItems="center"
        position="relative"
      >
        <IconButton
          aria-label="Show Rules"
          icon={<InfoIcon />}
          position="relative"
          right="-10rem"
          onClick={toggleRules}
          variant="ghost"
          size="lg"
          color="red.500"
          _hover={{color: "red.700"}}
          _active={{outline:"none"}}
          />
        <Text fontWeight="bold" color="black">
          {`Welcome ${user.name}`}
        </Text>

        <Link to="host">
          <Button
            w="200px"
            to="host"
            size="lg"
            as={motion.button}
            whileHover={{ scale: 1.1 }}
            variant="brand"
          >
            Host a Lobby
          </Button>
        </Link>

        <Link to="join">
          <Button
            w="200px"
            size="lg"
            as={motion.button}
            whileHover={{ scale: 1.1 }}
            variant="brand"
          >
            Join a Lobby
          </Button>
        </Link>

        <Link to={`profile/${user.id}`}>
          <Button
            w="200px"
            size="lg"
            as={motion.button}
            whileHover={{ scale: 1.1 }}
            variant="brand"
          >
            Profile
          </Button>
        </Link>

        <Button
          onClick={logout}
          w="200px"
          size="lg"
          as={motion.button}
          whileHover={{ scale: 1.1 }}
          variant="brand"
        >
          Log Out
        </Button>

        <Collapse in={showRules}>
          <Text fontSize="sm" color="gray.500" textAlign="left">
            <Text as="b">Rules: </Text><br />
            At the start of the game, each player has to place 5 ships of different length either horizontal or vertical.<br />
            After that, the players take turns shooting at the opponent's field.<br />
            If a ship is hit, the square turns red. If it's a miss, a circle appears. In both cases it's the opponent's turn.<br />
            The first player who sinks all the opponent's ships wins.<br />
            Have fun, Captain!
          </Text>
        </Collapse>
      </Flex>
    </AnimationContainer>
  )
}

export default Lobby
