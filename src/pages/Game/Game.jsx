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


  async function startSetup() {
    try {

      const response = await api.post(
        `/startgame`,
        JSON.stringify({ lobbyCode, hostId })
      )
      setPlayerOne((player) => ({
        ...player,
        playerId: host.hostId,
        playerName: host.hostName,
      }))

      
      

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
    socket.connect({}, onConnected)
  }, [])
  
  const onConnected = () => {
    console.log("Stomp client connected !")
    
    socket.subscribe(`/startgame/${lobbyCode}`, onStartGame)
    socket.subscribe(`/ready/${lobbyCode}`, onReady)
  }
  
  const onStartGame = (payload) => {
    const payloadData = JSON.parse(payload.body)
    if(payloadData.type === "Start"){
      setJoiner({
        joinerId: payloadData.player2Id,
        joinerName: payloadData.player2Name,
      })
      setPlayerTwo((player) => ({
        ...player,
        playerId: joiner.joinerId,
        playerName: joiner.joinerName,
      }))
      setIsStartSetup(true)
    }
  }

  const onReady = (payload) => {
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

  return (

    <Box>
      <>
        {isReady && <p>Ready!!!</p> }
        
        <h2>Host ID: {host.hostId}</h2>
        <h2>Host Name: {host.hostName}</h2>
        <h2>Joiner ID: {joiner.joinerId}</h2>
        <h2>Joiner Name: {joiner.joinerName}</h2>
      </>
      {isStartSetup ? (
      
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
              </Flex>
            </>
          )}
        </Flex>
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
