import React, { useContext, useEffect, useState } from "react"
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
  Spinner,
} from "@chakra-ui/react"
import { GameContext } from "../contexts/GameContext"
import ship_loser from "../assets/ship_loser2.png"
import ship_winner from "../assets/ship_winner.jpg"
import { useNavigate } from "react-router-dom"
import ReactConfetti from "react-confetti"

export default function EndGameModal({ isFinished, handleNewGame, isRematch }) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { user, player, setPlayer, resetState, lobby, enemy, setEnemy, setUser } =
    useContext(GameContext)
  const navigate = useNavigate()
  const [rematchMessage, setRematchMessage] = useState(
    "Waiting for Player to accept Rematch Request"
  )
  const lobbyCode = lobby.lobbyCode
  console.log(isRematch)

  useEffect(() => {
    let shouldNavigate = false
    if (player.newGame && enemy.newGame) {
      console.log("both player pressed new game will, redirect shortly")
      console.log(player, enemy)
      shouldNavigate = true
    }
    if(player.hasWon)setUser({...user, totalWins: user.totalWins + 1})

    if (shouldNavigate) {
      const navigateTimeout = setTimeout(() => {
        console.log("players are redirected...")
        navigate(`/setup/${lobbyCode}`)
      })
      return () => clearTimeout(navigateTimeout)
    }
  }, [player.newGame, enemy.newGame])

  useEffect(() => {
    if (isFinished) {
      onOpen()
    }
    if (isRematch) {
      const navigateTimeout = setTimeout(() => {
        setRematchMessage("Player did not respond. Will redirect shortly...")
        setTimeout(() => goLobby(), 3000)
      }, 10000)
      return () => clearTimeout(navigateTimeout)
    }

  }, [isRematch])

  const goLobby = () => {
    resetState()
    onClose()
    navigate(`/lobby`)
    // start new game
  }

  return (
    <Modal
      onClose={onClose}
      isOpen={isOpen}
      isCentered
      size="xl"
      closeOnOverlayClick={false}
    >
      <ModalOverlay backdropFilter="blur(10px)" />
      <ModalContent bgGradient="linear(to-br, #B7E8EB, rgba(255,254,234,1))">
        {player.hasWon && <ReactConfetti />}
        <ModalHeader textAlign="center">
          {player.hasWon
            ? "Congratulations Captain!"
            : isRematch
            ? "Sent Rematch Request"
            : "Mission Failed Captain! We are sinking"}
        </ModalHeader>
        <ModalBody>
          <Flex alignItems="center" justifyContent="center" direction="column">
            {isRematch ? (
              <>
                <Text>{rematchMessage}</Text>
                <Spinner />
              </>
            ) : (
              <>
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
                  {player.hasWon ? user.totalWins : user.totalWins}
                </Text>
              </>
            )}
          </Flex>
        </ModalBody>
        <ModalFooter display="flex" justifyContent="space-evenly">
          <Button
            variant="brand"
            onClick={handleNewGame}
            isDisabled={isRematch}
          >
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
