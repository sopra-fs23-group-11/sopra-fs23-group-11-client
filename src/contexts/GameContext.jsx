import React, { createContext, useEffect, useState } from "react"
import { Stomp } from "stompjs/lib/stomp"
import generateBoard from "../helpers/getBoard"
import shipsData from "../models/ShipsData"
import { api } from "../helpers/api"
export const GameContext = createContext()

export default function GameProvider({ children }) {
  // const [host, setHost] = useState({hostId: "", hostName: ""})
  // const [joiner, setJoiner] = useState({joinerId: "", joinerName: ""})
  // const user = JSON.parse(sessionStorage.getItem("user"))
  const userData = JSON.parse(sessionStorage.getItem("user"))
  const [direction, setDirection] = useState("Horizontal")
  const [lobby, setLobby] = useState(null)
  const [game, setGame] = useState(null)
  // const [playerOne, setPlayerOne] = useState({
  //   playerId: null,
  //     playerName: "",
  //     playerBoard: generateBoard(),
  //     playerShips: shipsData,
  //     receivedShots: [],
  //     isReady: false,
  //     isPlayerTurn: true
      

  // })

  // const [playerTwo, setPlayerTwo] = useState({
    
  //     playerId: null,
  //     playerName: "",
  //     playerBoard: generateBoard(),
  //     playerShips: shipsData,
  //     receivedShots: [],
  //     isReady: false,
  //     isPlayerTurn: false

  // })

  
  const [user, setUser] = useState({
    id: null,
    name: "",
    avatar: "",
    isHost: false
  })
  
  useEffect(() => {

    if(userData) {
      setUser((prev) => ({
        ...prev,
        name: userData.username,
        id: userData.id,
        avatar: userData.avatar,
      }))
    }

}, [0])

  const [player, setPlayer] = useState({
    id: null,
    name: "",
    board: generateBoard(),
    ships: shipsData,
    receivedShots: [],
    isReady: false,
    isMyTurn: false,
    hasWon: false,
  })

  const [enemy, setEnemy] = useState({
    id: null, 
    name: "",
    board: generateBoard(),
    isReady: false
  })

  const handleShoot = (rowIndex, colIndex) => {

      setEnemy(enemy => ({...enemy, board:shootMissle(enemy.board, rowIndex, colIndex)}))
    
  }

  const handlePlace = (rowIndex, colIndex) => {
      setPlayer(updatePlayerSetup(player, rowIndex, colIndex))
  }

  const handleSelect = (shipId) => {
      setPlayer({...player, ships: highlightSelection(player.ships, shipId)})
   
  }
  
  const highlightSelection = (ships, shipId) => {
    const selectedShip = ships.find((ship) => ship.id === shipId)

    const newShips = ships.map(ship => (
      ship.id === shipId ?
      {...ship, isHeld: !ship.isHeld} :
      {...ship, isHeld: false}
    ))

    sessionStorage.setItem("selected", JSON.stringify(selectedShip))
    
    return newShips
  
  }

// get letter value for a  certain index
  function getYCords(ind){
    let characters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"]
    return characters[ind];
  }

  function getLastPart(url) {
    const parts = url.split('/');
    return parts.at(-1);
  }

  const updatePlayerSetup =  (player, rowIndex, colIndex) => {
    const shipToBePlaced = JSON.parse(sessionStorage.getItem("selected"))
    console.log("row:"+rowIndex, "col:"+colIndex)
    if(shipToBePlaced){
      const length = shipToBePlaced.length
      const coordinatesToBeOccupied = []
      let shipPlayerPlayerId = player.id;
      console.log("playerid:"+shipPlayerPlayerId)
      let shipPlayerShipId = shipToBePlaced.id;
      console.log("shipId:"+shipPlayerShipId)
      let startPosition
      let endPosition
      let startY; let startX; let endX; let endY
      // place ships either horizontally or vertically
      if(direction=== "Horizontal") {
        startY = getYCords(rowIndex); // 0 ==>  A
        endY = startY // horizontal has the same row // A
        startX = colIndex; // 0
        endX = colIndex + length-1; // 4
        console.log("rowIndex:" + rowIndex, "colIndex:" + colIndex, "startY:" + startY, "endX:" + endX)
        startPosition = startY.toString() + startX.toString(); // A0
        endPosition = endY.toString() + endX.toString(); // A4
        for (let i = 0; i < length; i++) {
          coordinatesToBeOccupied.push(player.board[rowIndex][colIndex + i].id)
        }
      }
      if(direction === "Vertical"){
        startY = getYCords(rowIndex) // 0 ==> A
        endY = getYCords(rowIndex + length -1) // 4 ===> E
        startX = colIndex // 0
        endX = startX // 0
        startPosition = startY.toString() + startX.toString() // A0
        endPosition = endY.toString() + endX.toString() // E0
        for(let i =0; i <length; i++){
          coordinatesToBeOccupied.push(player.board[rowIndex + i][colIndex].id)
        }

      }
      console.log("startPos:"+startPosition, "endPos:"+endPosition)
      submitShipPosition(shipPlayerPlayerId,shipPlayerShipId,startPosition,endPosition)

      let valid = true
      player.board.forEach((row) =>
        row.forEach((cell) => {
          if (cell.isOccupied && coordinatesToBeOccupied.includes(cell.id)) {
            valid = false
          }
        })
      )
      if (valid) {
        //await submitShipPosition(coordinatesToBeOccupied, shipToBePlaced)
        const newBoard = player.board.map((row) =>
          row.map((cell) =>
            coordinatesToBeOccupied.includes(cell.id)
              ? { ...cell, isOccupied: shipToBePlaced }
              : cell
          )
        )
        const updatedShips = player.ships.filter(ship => ship.id !== shipToBePlaced.id)
        sessionStorage.removeItem("selected") 
        
        
        return {...player, board: newBoard, ships: updatedShips}
      } else {
        alert("invalid placement please try again")
        return player
      }
    }else {
      alert("please select a ship first")
      return player
    }
  }



  const shootMissle = (board, rowIndex, colIndex) => {
      const newBoard = board.map((row, rIndex) =>
      row.map((col, cIndex) =>
        rIndex === rowIndex && cIndex === colIndex
          ? { ...col, isShotAt: true }
          : col
      )
    )
    return newBoard
  }


   const submitShipPosition = async (shipPlayerPlayerId,shipPlayerShipId,startPosition,endPosition) => {
    try {
      const gameId = getLastPart(window.location.href)
      const response = await api.post(
          "/ships",
          JSON.stringify({
            shipPlayerPlayerId,
            shipPlayerShipId,
            startPosition,
            endPosition,
            gameId
          })
      )
      return response
    }catch(e){
      //alert("ships are touching")
    }
   }

  return (
    <GameContext.Provider value={{direction, setDirection, user, setUser, player, setPlayer, lobby, setLobby, handlePlace, handleSelect, game, setGame, handleShoot, enemy, setEnemy}}>
      {children}
    </GameContext.Provider>
  )
}
