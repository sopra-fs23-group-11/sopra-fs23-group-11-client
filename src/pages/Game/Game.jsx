import React, { useContext, useEffect, useState } from "react"
import BattleshipBoard from "../../components/BattleShipBoard.jsx"
import Ship from "../../components/Ship.jsx"
import { api } from "../../helpers/api.js"
import './Game.css'

import { Flex, Button, Box, Text, Spinner } from "@chakra-ui/react"
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
    direction,
    setDirection,
  } = useContext(GameContext)

  const [game, setGame] = useState(null)
  const [isStartSetup, setIsStartSetup] = useState(false)
  const [waitingSpinner, setWaitingSpinner] = useState(false)
  const { lobbyCode } = useParams()
  const hostId = host.hostId
  const hostName = host.hostName
  const user = JSON.parse(sessionStorage.getItem("user"))
  const navigate = useNavigate()


  // console.log(playerOne.isReady, playerTwo.isReady)
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

  async function playerReady() {
    let id
    let name
    if(host.hostId === user.id){
      id = playerOne.playerId
      name = playerOne.playerName
      setPlayerOne(player => ({...player, isReady: true}))
    }else{
      id = playerTwo.playerId
      name = playerTwo.playerName
      setPlayerTwo(player => ({...player, isReady: true}))
    }
    const readyMessage = {
      gameId: lobbyCode,
      playerId: id,
      playerName: name
    }
    setWaitingSpinner(true)
    socket.send(`/app/ready`, {}, JSON.stringify(readyMessage))
    // if(isReady)
    // setIsReady(true)
    
  }
    

  // function onReady(payload) {
  //   const payloadData = JSON.parse(payload.body)
  //   console.log(payloadData)
  // }

  useEffect(() => {
    console.log("effect ran...")
    socket = Stomp.client("ws://localhost:8080/ws")
    socket.connect({}, onConnected, errorCallback)

    if(playerOne.isReady && playerTwo.isReady)navigate(`/main/${lobbyCode}`)
  }, [isStartSetup, waitingSpinner])

  const errorCallback = (m) => {
    console.log('mmm', m)
  }
  
  const onConnected = () => {
    console.log("Stomp client connected !", lobbyCode)
    
    socket.subscribe(`/startgame/${lobbyCode}`, onStartGame)
    console.log("websocket connected!")
    socket.subscribe(`/ready/${ host.hostId === user.id ? playerTwo.playerName : playerOne.playerName}`, onReady)
  }
  
  const onStartGame = (payload) => {
    console.log("game starts")
    const payloadData = JSON.parse(payload.body)
    console.log("game starts")

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

  const onReady = (payload) => {
    console.log("game starts on REady")
    const payloadData = JSON.parse(payload.body)
    console.log(typeof(payloadData.playerId), typeof(parseInt(playerOne.playerId)))
    setWaitingSpinner(false)
    if(payloadData.playerId === parseInt(playerOne.playerId)){
       setPlayerOne(player => ({...player, isReady: true}))
    console.log("player 1 is ready")
     }else if(payloadData.playerId === parseInt(playerTwo.playerId)){
       setPlayerTwo(player => ({...player, isReady: true}))
    console.log("player 2 is ready")
    }else{
      console.log("abti wuxuu waa sidee??")
    }
  }

  const toGame = () => {
    navigate(`/main/${lobbyCode}`)
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
        {playerOne.isReady && <p>Player1 is READY</p> }

        {playerTwo.isReady && <p>Player2 is READY</p> }
        <h2>Player1 ID: {playerOne.playerId}</h2>
        <h2>Player1 Name: {playerOne.playerName}</h2>
        <h2>Player2 ID: {playerTwo.playerId}</h2>
        <h2>Player2 Name: {playerTwo.playerName}</h2>
        <h2> Click the button on the right to make your ship vertical or horizontal</h2>
        <Flex>
          {user.id === host.hostId ? (
            <>
              <div className="board-container">
              <BattleshipBoard
                socket={socket}
                board={playerOne.playerBoard}
                //handleShoot={shootMissle}
                handlePlace={placeShip}
                playerId={playerOne.playerId}
                playerName={playerOne.playerName}
              />
              </div>
              <div className="ship-container">
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
                { playerOne.playerShips.length !== 0 &&
                  <button className="button-orientation" onClick={handleClick}>
                  {direction}
                </button>}
              </div>
            </>


          ) : (
            <>
              <div className="board-container">
              <BattleshipBoard
                socket={socket}
                board={playerTwo.playerBoard}
                //handleShoot={shootMissle}
                handlePlace={placeShip}
                playerId={playerTwo.playerId}
                playerName={playerTwo.playerName}
              />
              </div>
              <div className="ship-container">
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
                { playerTwo.playerShips.length !== 0 &&
                  <button className="button-orientation" onClick={handleClick}>
                  {direction}
                </button>}
              </div>
            </>
          )}
        </Flex>
      </>
      ) : host.hostId === user.id ? (
        <Button onClick={startSetup}>Start Setup</Button>
      ) : (
        <Flex justifyContent="center" alignItems="center" h="70vh" direction={"column"}>
          <Spinner
                  thickness='4px'
                  speed='0.65s'
                  emptyColor='gray.200'
                  color='blue.500'
                  size='lg'
              />
          <Text textAlign={"center"}>Please Wait Host is putting on his socks...</Text>

        </Flex>
      )}
      {(playerOne.playerShips.length === 0 || playerTwo.playerShips.length === 0) &&
        
          <Button onClick={playerReady} isDisabled={waitingSpinner}>
            {!waitingSpinner ? "Ready" : 
            <>
            <Spinner
              thickness='4px'
              speed='0.65s'
              emptyColor='gray.200'
              color='blue.500'
              size='lg'/>
        <Text>Good Luck Captain, See you on the other side 🫡</Text>
            </>
    }
          </Button>
        }

    </Box>

)
}
export default Game
