import { Text, Button, Flex, Box} from "@chakra-ui/react"

import React, { useContext, useEffect} from "react"

import { Link, useNavigate } from "react-router-dom"
import { GameContext } from "../../contexts/GameContext"
import {api} from "../../helpers/api.js";
import withAnimation from "../../HOC/withAnimation";
import { motion } from "framer-motion";


function Lobby() {
  const userId = JSON.parse(sessionStorage.getItem("userId"))
  const {user, setUser} = useContext(GameContext)
  const navigate = useNavigate()
  
  useEffect(() => {
        async function host() {
          try {
            const response = await api.get('/users/' + userId)
            console.log(response.data)
            setUser(user => ({...user, id: response.data.id, name: response.data.username, avatar: response.data.avatar, isHost: false}))
          } catch (error) {
            console.log(error.message)
          }
        }

        host();
      }
      , []);

  const logout = () => {
    localStorage.removeItem("token")
    navigate("/")
  }

    return (
          <Flex
              flexDirection="column"
              height="70vh"
              gap="20px"
              justifyContent="center"
              alignItems="center"
          >
              <Text fontWeight="bold" color="black">
                {`Welcome ${user.name}`}
              </Text>

            <Link to="host">
              <Button w="200px" to="host" size="lg"as={motion.button} whileHover={{scale: 1.1}}>
                  Host a Lobby
              </Button>
            </Link>

            <Link to="join">
              <Button w="200px" size="lg" as={motion.button} whileHover={{scale: 1.1}}>
                Join a Lobby
              </Button>
            </Link>

            <Link to={`/profile/${user.id}`}>
              <Button w="200px" size="lg" as={motion.button} whileHover={{scale: 1.1}}>
                Profile
              </Button>
            </Link>

            <Button onClick={logout} w="200px" size="lg" as={motion.button} whileHover={{scale: 1.1}}>
              Log Out
            </Button>
          </Flex>
        
    )
  }


export default withAnimation(Lobby, "LOBBY")
