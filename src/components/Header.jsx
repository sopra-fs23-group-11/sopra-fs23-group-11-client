import React, { useContext, useEffect, useState } from "react"
import {
  Flex,
  Box,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Heading,
} from "@chakra-ui/react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import AnimationContainer from "./AnimationContainer"
import { GameContext } from "../contexts/GameContext"
import { Stomp } from "stompjs/lib/stomp"
import { getDomainWebsocket } from "../helpers/getDomainWebsocket"
import { headerVariants } from "../animations/variants"


function Header() {
  const location = useLocation()
  const navigate = useNavigate()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { resetState, lobby } = useContext(GameContext)
  const [isLeaving, setIsLeaving] = useState(false)

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
          <Box
            bgGradient="linear(to-tr, #0172AF, #4FD1C5)"
            bgClip="text"
            display="flex"
            justifyContent="center"
          >
            <Heading
              fontSize="4xl"
              onClick={isLobbyOrProfile ? toMenu : onOpen}
              cursor="pointer"
            >
              BATTLESHIP
            </Heading>
          </Box>
          <Modal
            closeOnOverlayClick={false}
            isOpen={isOpen}
            size="xs"
            onClose={onClose}
          >
            <ModalOverlay backdropFilter="blur(10px)" />
            <ModalContent>
              <ModalHeader>Confirm Exit</ModalHeader>
              <ModalCloseButton />
              <ModalBody pb={6}>
                Captain, are you sure you want to leave the Game session?
              </ModalBody>

              <ModalFooter>
                <Button colorScheme="blue" mr={3} onClick={toMenu}>
                  Return to Menu
                </Button>
                <Button onClick={onClose}>Stay</Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </Box>
      </Box>
    </AnimationContainer>
  )
}

export default Header
