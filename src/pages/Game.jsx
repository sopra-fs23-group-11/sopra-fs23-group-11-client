import React, { useEffect, useContext, useState } from "react"
import { morse } from "../helpers/soundEffects"
import {
  Divider,
  Flex,
  Text,
  Box,
  Center,
  useToast,
  Avatar,
  Button,
  InputGroup,
  Input,
  InputRightElement,
  Card,
  CardBody,
} from "@chakra-ui/react"
import { ChatIcon } from "@chakra-ui/icons"
import { GameContext } from "../contexts/GameContext.jsx"
import { Stomp } from "stompjs/lib/stomp.js"
import { useParams, useNavigate } from "react-router-dom"
import BattleshipBoard from "../components/BattleShipBoard.jsx"
import {
  explosionSound,
  smallSplash,
  sinkShipSound,
} from "../helpers/soundEffects"
import { getDomainWebsocket } from "../helpers/getDomainWebsocket.js"
import AnimationContainer from "../components/AnimationContainer.jsx"
import EnemyExitModal from "../components/EnemyExitModal.jsx"
import EndGameModal from "../components/EndGameModal"
import {
  playerVariant,
  enemyVariant,
  switchTurnVariants,
} from "../animations/variants"

let socket = null
export default function Game() {
  const { player, user, setPlayer, handleShoot, enemy, setEnemy, handleSunk } =
    useContext(GameContext)
  const [enemyExit, setEnemyExit] = useState(false)
  const [isFinished, setIsFinished] = useState(false)
  const [inputValue, setInputValue] = useState("")
  const [messages, setMessages] = useState([])
  const [isChatOpen, setIsChatOpen] = useState(false)

  const { lobbyCode } = useParams()
  const toast = useToast()

  useEffect(() => {
    socket = Stomp.client(getDomainWebsocket())
    socket.connect({}, onConnected)
  }, [])

  const onConnected = () => {
    if (socket && socket.connected) socket.disconnect
    socket.subscribe(`/game/${lobbyCode}/${player.id}`, onShotReceived)
    socket.subscribe(`/game/${lobbyCode}/sunk`, onSunkenShip)
    socket.subscribe(`/game/${lobbyCode}/finish`, onFinished)
    socket.subscribe(`/game/${lobbyCode}/leave`, onLeave)
    socket.subscribe(`/game/${lobbyCode}/${player.id}/newgame`, onNewGame)
    socket.subscribe(`/chatroom/${lobbyCode}`, onMessage)
  }

  const onShotReceived = (payload) => {
    console.log("shot received")
    const payloadData = JSON.parse(payload.body)
    const position = payloadData.posOfShot
    const isAHit = payloadData.hit

    setPlayer((player) =>
      isAHit
        ? { ...player, hitsReceived: [...player.hitsReceived, position] }
        : { ...player, missesReceived: [...player.missesReceived, position] }
    )

    setPlayer((player) => {
      const newBoard = player.board.map((row) =>
        row.map((cell) =>
          player.hitsReceived.includes(cell.id)
            ? { ...cell, isHit: true }
            : player.missesReceived.includes(cell.id)
            ? { ...cell, isShotAt: true }
            : cell
        )
      )
      if (isAHit) {
        explosionSound()
      } else {
        smallSplash()
      }
      return { ...player, board: newBoard, isMyTurn: true }
    })
  }
  const onFinished = (payload) => {
    const payloadData = JSON.parse(payload.body)
    if (payloadData.winnerId === player.id) {
      setPlayer((player) => ({ ...player, hasWon: true }))
    }
    setIsFinished(true)
    //navigate(`/endscreen/${lobbyCode}`)
  }

  const onNewGame = (payload) => {
    setEnemy({...enemy, newGame: true})
  }

  const onMessage = (payload) => {
    let payloadData = JSON.parse(payload.body)
    console.log("message payload:" + payload.body)
    setMessages((prevMessages) => [...prevMessages, payloadData.content])
    console.log(payloadData.content)
    morse()
  }

  const sendMessage = (newMessage) => {
    newMessage = player.name + ": " + newMessage
    const message = {
      lobbyCode: lobbyCode,
      content: newMessage,
    }
    socket.send(`/chatroom/${lobbyCode}`, {}, JSON.stringify(message))
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSendMessage()
    }
  }

  const handleSendMessage = () => {
    sendMessage(inputValue)
    setInputValue("")
  }

  const onSunkenShip = (payload) => {
    sinkShipSound()
    const payloadData = JSON.parse(payload.body)
    const shipType = payloadData.shipType
    const shipId = payloadData.shipId
    console.log(payloadData)
    if (payloadData.defenderId === player.id) {
      handleAlerts(`Your ${shipType} has been sunk`, "warning")
      handleSunk(player.id, shipId)
    } else {
      handleAlerts(`You have sunk their ${shipType}`, "info")
      handleSunk(enemy.id, shipId)
    }
  }

  const onLeave = () => {
    console.log("player left the game")
    setEnemyExit(true)
  }

  const shootMissle = (rowIndex, colIndex) => {
    //first render the shot on your own screen on the enemy board
    handleShoot(rowIndex, colIndex)

    //next, send the shot through websocket to render on enemy screen
    const position = player.board[rowIndex][colIndex].id

    setPlayer((player) => ({ ...player, isMyTurn: false }))

    const shot = {
      attackerId: player.id,
      defenderId: enemy.id,
      posOfShot: position,
      gameId: lobbyCode,
    }
    if (socket) {
      socket.send("/app/game", {}, JSON.stringify(shot))
    }
  }

  const handleError = (text) => {
    toast({
      title: "Invalid Shot",
      description: text,
      position: "bottom",
      isClosable: true,
      duration: 4000,
      status: "error",
    })
  }

  const handleAlerts = (text, status) => {
    toast({
      title: text,
      position: "bottom",
      isClosable: true,
      duration: 4000,
      status: status,
    })
  }

  return (
    <Flex justifyContent="space-around" width="80%" m="auto">
      <AnimationContainer variants={playerVariant}>
        <Flex direction="column" alignItems="center">
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
          <BattleshipBoard board={player.board} handleError={handleError} />
          {player.isMyTurn && (
            <AnimationContainer variants={switchTurnVariants}>
              Your Turn Captain
            </AnimationContainer>
          )}
        </Flex>
      </AnimationContainer>

      <Center display="flex" flexDirection="column">
        <Divider orientation="vertical" borderColor="red" border="2px solid" />
        <Button
          onClick={() => setIsChatOpen(!isChatOpen)}
          bgColor="teal.500"
          color="white"
          borderRadius="lg"
          p={4}
          fontWeight="medium"
          _hover={{ bgColor: "teal.400" }}
          mt={2}
        >
          Toggle Radio
        </Button>
      </Center>

      <AnimationContainer variants={enemyVariant}>
        <Flex direction="column" alignItems="center">
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
            <Avatar src={enemy.avatar} />
            <Text>{enemy.name}</Text>
          </Card>
          <BattleshipBoard
            board={enemy.board}
            handleShoot={shootMissle}
            isTurn={player.isMyTurn}
            isEnemy={true}
            handleError={handleError}
          />
          {!player.isMyTurn && (
            <AnimationContainer variants={switchTurnVariants}>
              Enemy Shot Incoming
            </AnimationContainer>
          )}
        </Flex>
      </AnimationContainer>
      {enemyExit && <EnemyExitModal enemyExit={enemyExit} />}

      {isChatOpen && (
        <Box
          position="fixed"
          bottom="0"
          right="0"
          bgColor="white"
          boxShadow="0px -5px 10px rgba(0, 0, 0, 0.2)"
          borderRadius="lg"
          maxHeight="600px"
          overflowY="auto"
          p={4}
        >
          <Box mb={4}>
            {messages.map((message, index) => (
              <Box key={index} mb={2}>
                {message}
              </Box>
            ))}
          </Box>
          <InputGroup>
            <Input
              type="text"
              placeholder="Type your message here..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyPress}
            />
            <InputRightElement>
              <Button
                onClick={handleSendMessage}
                bgColor="teal.500"
                color="white"
                borderRadius="lg"
                p={4}
                fontWeight="medium"
                _hover={{ bgColor: "teal.400" }}
              >
                Send
              </Button>
            </InputRightElement>
          </InputGroup>
        </Box>
      )}

      {isFinished && <EndGameModal isFinished={isFinished} socket={socket}/>}
    </Flex>
  )
}
