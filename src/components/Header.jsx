import React, { useContext, useEffect, useRef, useState } from "react"
import {
  Flex,
  Box,
  useDisclosure,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  AlertDialogCloseButton,
  Button,
  Heading,
  Avatar,
} from "@chakra-ui/react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import AnimationContainer from "./AnimationContainer"
import { GameContext } from "../contexts/GameContext"
import { Stomp } from "stompjs/lib/stomp"
import { getDomainWebsocket } from "../helpers/getDomainWebsocket"
import { headerVariants } from "../animations/variants"
import Lottie from "lottie-react"
import Ship from "../animations/Ship.json"

function Header() {
  const location = useLocation()
  const navigate = useNavigate()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { resetState, lobby, user } = useContext(GameContext)
  const [isLeaving, setIsLeaving] = useState(false)
  const cancelRef = useRef()

  const routeParts = location.pathname.split("/")
  const mainRouteName = routeParts[1]
  const isLobbyOrProfile =
    mainRouteName === "lobby" || mainRouteName === "profile"
  const lobbyCode = lobby?.lobbyCode
  const sendExitMsg = () => {
    const socket = Stomp.client(getDomainWebsocket())
    socket.connect({}, () => {
      socket.send("/app/leave", {}, JSON.stringify({ lobbyCode }))
    })
  }

  const toMenu = () => {
    navigate("/lobby")
    onClose()
    !isLobbyOrProfile ? sendExitMsg() : ""
    resetState()
  }

  return (
    <AnimationContainer variants={headerVariants}>
      <Box
        as="header"
        backgroundColor="transparent"
        color="black"
        padding="1rem"
        textAlign="center"
        fontSize="2rem"
        fontWeight="bold"
      >
        <Box
          borderBottom="2px solid #015871"
          width="90%"
          margin="auto"
          minWidth="200px"
        >
          {/* <Box h="70px" w="70px" position="absolute" left="0">
            <Lottie animationData={Ship} />
          </Box> */}
          <Box
            bgGradient="linear(to-tr, #0172AF, #4FD1C5)"
            bgClip="text"
            display="flex"
            justifyContent="space-between"
          >
            <Box />
            <Heading
              fontSize="4xl"
              mr={-10}
              onClick={isLobbyOrProfile ? toMenu : onOpen}
              cursor="pointer"
              _hover={{borderTop: "3px solid #015871"}}
            >
              BATTLESHIP
            </Heading>
            <Avatar src={user.avatar} showBorder />
          </Box>

          <AlertDialog
            isOpen={isOpen}
            leastDestructiveRef={cancelRef}
            onClose={onClose}
            size="xs"
          >
            <AlertDialogOverlay>
              <AlertDialogContent bgGradient="linear(to-br, #B7E8EB, rgba(255,254,234,1))">
                <AlertDialogHeader fontSize="lg" fontWeight="bold">
                  Confirm Exit
                </AlertDialogHeader>

                <AlertDialogBody>
                  Captain, are you sure you want to leave the Game session?
                </AlertDialogBody>

                <AlertDialogFooter>
                  <Button ref={cancelRef} onClick={onClose} variant="brand">
                    Stay
                  </Button>
                  <Button colorScheme="red" onClick={toMenu} ml={3}>
                    Exit
                  </Button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialogOverlay>
          </AlertDialog>
        </Box>
      </Box>
    </AnimationContainer>
  )
}

export default Header
