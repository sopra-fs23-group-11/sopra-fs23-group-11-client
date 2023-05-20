import React, { useContext, useEffect } from "react"
import {
  Modal,
  ModalOverlay,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  ModalContent,
  Button,
  Flex,
  Text,
  Image,
  Card,
  Avatar,
} from "@chakra-ui/react"
import { GameContext } from "../contexts/GameContext"
import ship_loser from "../assets/ship_loser2.png"
import ship_winner from "../assets/ship_winner.jpg"
import { useNavigate } from "react-router-dom"

export default function EndGameModal({ isFinished, socket }) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { user, player, setPlayer, resetState, lobby, enemy } = useContext(GameContext)
  const navigate = useNavigate()
  const lobbyCode = lobby.lobbyCode

  useEffect(() => {
    if (isFinished) {
      onOpen()
    }

    if(player.newGame && enemy.newGame){
        resetState(true)
        navigate(`/setup/${lobbyCode}`)
    }
  }, [player.newGame, enemy.newGame])

  const goLobby = () => {
    resetState()
    onClose()
    navigate(`/lobby`)
    // start new game
  }

  const newGame = () => {
    const enemyId = enemy.id
    socket.send("/app/newgame", {}, JSON.stringify({ lobbyCode, enemyId }))
    setPlayer({...player, newGame: true})
  }
  return (
      <Modal
        onClose={onClose}
        isOpen={isOpen}
        isCentered
        size="xl"
        closeOnOverlayClick={false}
      >
        <ModalOverlay bg="blackAlpha.300"/>
        <ModalContent>
          <ModalHeader textAlign="center">
            {player.hasWon
              ? "Congratulations Captain!"
              : "Mission Failed Captain! We are sinking"}
          </ModalHeader>
          <ModalBody>
            <Flex
              alignItems="center"
              justifyContent="center"
              direction="column"
            >
              <Image
                src={player.hasWon ? ship_winner : ship_loser}
                alt="Image 1"
                h="400px"
              />
              <Card
                padding="4px 5px"
                direction="flex"
                w={200}
                alignItems="center"
                justifyContent="center"
                borderRadius="full"
                variant="filled"
                bgGradient="linear(to-l, #4FD1C5, #B7E8EB)"
              >
                <Avatar src={user.avatar} />
                <Text>{player.name}</Text>
              </Card>
              <Text>
                total wins:{" "}
                {player.hasWon ? user.totalWins + 1 : user.totalWins}
              </Text>
            </Flex>
          </ModalBody>
          <ModalFooter display="flex" justifyContent="space-evenly">
            <Button variant="brand" onClick={newGame}>
              {player.hasWon ? "New Game" : "Revenge"}
            </Button>
            <Button variant="brand" onClick={goLobby}>
              Main Menu
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
  )
}
