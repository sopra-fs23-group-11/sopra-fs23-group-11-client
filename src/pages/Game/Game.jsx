import React, { useContext, useEffect, useState } from "react"
import BattleshipBoard from "../../components/BattleShipBoard.jsx"
import Ship from "../../components/Ship.jsx"
import { api } from "../../helpers/api.js"

import { Flex, Button, Box, Text } from "@chakra-ui/react"
import { GameContext } from "../../contexts/GameContext.jsx"
import { Stomp } from "stompjs/lib/stomp"

import { useParams, Link, useNavigate } from "react-router-dom"

let socket = null
function Game() {

  const {
    playerOne,
    playerTwo,
    setPlayerOne,
    setPlayerTwo,
    handlePlace,
    handleSelect,
    host,
    setHost,
    joiner,
    setJoiner,
  } = useContext(GameContext)

  const [game, setGame] = useState(null)
  const [isReady, setIsReady] = useState(false)
  const [isStartSetup, setIsStartSetup] = useState(false)
  const { lobbyCode } = useParams()
  const hostId = host.hostId
  const hostName = host.hostName
  const user = JSON.parse(sessionStorage.getItem("user"))
  console.log(joiner)
  const navigate = useNavigate()
  const [direction, setDirection] = useState("Horizontal")


  async function startSetup() {
    try {

      const response = await api.post(
        `/startgame`,
        JSON.stringify({ lobbyCode, hostId })
      )
      


      setGame(response.data)
    } catch (error) {
      console.log(error.message)
    }
  }

  function playerReady() {
    let id
    let name
    if(host.hostId === user.id){
      id = hostId
      name = host.hostName
    }else{
      id = joiner.joinerId
      name = joiner.joinerName
    }
    const readyMessage = {
      gameId: lobbyCode,
      playerId: id,
      playerName: name
    }

    socket.send(`/app/ready`, {}, JSON.stringify(readyMessage))
    // setIsReady(true)
    navigate(`/main/${lobbyCode}`)
  }
    

  // function onReady(payload) {
  //   const payloadData = JSON.parse(payload.body)
  //   console.log(payloadData)
  // }

  useEffect(() => {
    console.log("effect ran...")
    socket = Stomp.client("ws://localhost:8080/ws")
    socket.connect({}, onConnected, errorCallback)
  }, [])

  const errorCallback = (m) => {
    console.log('mmm', m)
  }
  
  const onConnected = () => {
    console.log("Stomp client connected !", lobbyCode)
    
    socket.subscribe(`/startgame/${lobbyCode}`, onStartGame)
    console.log("websocket connected!")
    socket.subscribe(`/ready/${lobbyCode}`, onReady)
  }
  
  const onStartGame = (payload) => {
    console.log("game starts")
    const payloadData = JSON.parse(payload.body)
    console.log("game starts")
    if(payloadData.type === "Start"){

      setPlayerOne((player) => ({
        ...player,
        playerId: payloadData.player1Id,
        playerName: payloadData.player1Name,
      }))
     
      setPlayerTwo((player) => ({
        ...player,
        playerId: payloadData.player2Id,
        playerName: payloadData.player2Name,
      }))
      console.log("isStartsetup", isStartSetup)
      setIsStartSetup(true)
    }
  }

  const onReady = (payload) => {
    console.log("game starts on REady")
    const payloadData = JSON.parse(payload.body)
    console.log(payloadData)
    setIsReady(true)
  }


  const selectShip = (shipId, playerId) => {
    handleSelect(shipId, playerId)
  }

  const placeShip = (playerId, rowIndex, colIndex) => {
    handlePlace(playerId, rowIndex, colIndex)
    
  }

  const handleClick =() => {
    setDirection(direction === "Horizontal" ? "Vertical":"Horizontal")
  }


  return (

    <Box>
      {isStartSetup ? (
      <>
        {isReady && <p>Ready!!!</p> }
        
        <h2>Player1 ID: {playerOne.playerId}</h2>
        <h2>Player1 Name: {playerOne.playerName}</h2>
        <h2>Player2 ID: {playerTwo.playerId}</h2>
        <h2>Player2 Name: {playerTwo.playerName}</h2>
      
        <Flex>
          {user.id === host.hostId ? (
            <>
              <BattleshipBoard
                socket={socket}
                board={playerOne.playerBoard}
                //handleShoot={shootMissle}
                handlePlace={placeShip}
                playerId={playerOne.playerId}
                playerName={playerOne.playerName}
              />
              <Flex direction="column">
                {playerOne.playerShips.map((ship) => (
                  <Ship
                    key={ship.id}
                    type={ship.type}
                    length={ship.length}
                    isHeld={ship.isHeld}
                    handleSelect={selectShip}
                    playerId={playerOne.playerId}
                    shipId={ship.id}
                    />
                ))}
                 <button onClick={handleClick}> {direction} </button>

              </Flex>
            </>
          ) : (
            <>
              <BattleshipBoard
                socket={socket}
                board={playerTwo.playerBoard}
                //handleShoot={shootMissle}
                handlePlace={placeShip}
                playerId={playerTwo.playerId}
                playerName={playerTwo.playerName}
              />
              <Flex direction="column">
                {playerTwo.playerShips.map((ship) => (
                  <Ship
                    key={ship.id}
                    type={ship.type}
                    length={ship.length}
                    isHeld={ship.isHeld}
                    handleSelect={selectShip}
                    playerId={playerTwo.playerId}
                    shipId={ship.id}
                  />
                ))}
                <button onClick={handleClick}> {direction} </button>
              </Flex>
            </>
          )}
        </Flex>
      </>
      ) : host.hostId === user.id ? (
        <Button onClick={startSetup}>Start Setup</Button>
      ) : (
        <Text>Preparing Setup stage...</Text>
      )}
      {(playerOne.playerShips.length === 0 || playerTwo.playerShips.length === 0) &&
        (
          <Button onClick={playerReady}>
            Ready!
          </Button>
        )}

      {/* <Button mt={3} as={Link} to={`/chatroom/${lobbyCode}`} colorScheme="blue">
        Chat with friend
      </Button> */}
    </Box>

)
}
export default Game
