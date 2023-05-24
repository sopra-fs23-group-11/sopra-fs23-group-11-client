import {
  Text,
  Button,
  Flex,
  Box,
  IconButton,
  Collapse,
  Icon,
} from "@chakra-ui/react"

import React, { useContext, useEffect, useState } from "react"

import { Link, useNavigate } from "react-router-dom"
import { GameContext } from "../../contexts/GameContext"
import { api } from "../../helpers/api.js"
import { motion } from "framer-motion"
import AnimationContainer from "../../components/AnimationContainer"
import { InfoIcon } from "@chakra-ui/icons"
import {
  lobbyVariants,
  navigationButtonVariant,
} from "../../animations/variants"
import Rules from "../../components/Rules"

function Lobby() {
  const userId = JSON.parse(sessionStorage.getItem("userId"))
  const { user, setUser, player, setIsDisabled } = useContext(GameContext)
  const [showRules, setShowRules] = useState(false)
  const navigate = useNavigate()
  console.log(player)
  setIsDisabled(false)

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
      <AnimationContainer variants={navigationButtonVariant}>
          <Flex justifyContent="end" width="93%">
            <Icon
              aria-label="Show Rules"
              position="relative"
              onClick={toggleRules}
              _hover={{ transform: "scale(1.1)" }}
              cursor="pointer"
              boxSize={8}
            />
          </Flex>
        </AnimationContainer>
      <Flex
        flexDirection="column"
        height="60vh"
        gap="20px"
        justifyContent="center"
        alignItems="center"
        position="relative"
      >
        <AnimationContainer variants={navigationButtonVariant}>
          <Text fontWeight="bold">{`Welcome ${user.name}`}</Text>
        </AnimationContainer>

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
        
        <Rules showRules={showRules} toggleRules={toggleRules} currentPage="lobby"/>
      </Flex>
    </AnimationContainer>
  )
}

export default Lobby
