import React, { createContext, useMemo, useState } from "react"
import { Stomp } from "stompjs/lib/stomp"
import generateBoard from "../helpers/getBoard"
import shipsData from "../models/ShipsData"
import { api } from "../helpers/api"
export const GameContext = createContext()

export default function GameProvider({ children }) {
  const [host, setHost] = useState({hostId: "", hostName: ""})
  const [joiner, setJoiner] = useState({joinerId: "", joinerName: ""})
  const user = JSON.parse(sessionStorage.getItem("user"))

  const [playerOne, setPlayerOne] = useState({
    playerId: null,
      playerName: "",
      playerBoard: generateBoard(),
      playerShips: shipsData
  })

  const [playerTwo, setPlayerTwo] = useState({
    
      playerId: null,
      playerName: "",
      playerBoard: generateBoard(),
      playerShips: shipsData
     
  })

  // const [gameState, setGameState] = useState([
  //   {
  //     playerId: 1,
  //     playerName: "kalil",
  //     playerBoard: generateBoard(),
  //     playerShips: shipsData
  //   },
  //    {
  //     playerId: 2,
  //     playerName: "sumi",
  //     playerBoard: generateBoard(),
  //     playerShips: shipsData
  //    }
  // ])

  const handleShoot = (playerId, rowIndex, colIndex) => {
    if(playerOne.playerId === playerId){
      setPlayerTwo({...playerTwo, playerBoard: shootMissle(playerTwo.playerBoard,rowIndex,colIndex)})
    }else{
      setPlayerOne({...playerOne, playerBoard: shootMissle(playerOne.playerBoard, rowIndex, colIndex)})
    }
   
  }

  const handlePlace = (playerId, rowIndex, colIndex) => {
    playerOne.playerId === playerId ?
      setPlayerOne(updatePlayer(playerOne, rowIndex, colIndex))
        :
      setPlayerTwo(updatePlayer(playerTwo, rowIndex, colIndex))
  }

  const handleSelect = (shipId, playerId) => {
    playerOne.playerId === playerId ? 
      setPlayerOne({...playerOne, playerShips: highlightSelection(playerOne.playerShips, shipId)})
       :
      setPlayerTwo({...playerTwo, playerShips: highlightSelection(playerTwo.playerShips, shipId)})
   
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

  const updatePlayer =  (player, rowIndex, colIndex) => {
    const shipToBePlaced = JSON.parse(sessionStorage.getItem("selected"))
    if(shipToBePlaced){
      const length = shipToBePlaced.length
      const coordinatesToBeOccupied = []
      for (let i = 0; i < length; i++) {
        coordinatesToBeOccupied.push(player.playerBoard[rowIndex][colIndex + i].id)
      }
      let valid = true
      player.playerBoard.forEach((row) =>
        row.forEach((cell) => {
          if (cell.isOccupied && coordinatesToBeOccupied.includes(cell.id)) {
            valid = false
          }
        })
      )
      if (valid) {
        //await submitShipPosition(coordinatesToBeOccupied, shipToBePlaced)
        const newBoard = player.playerBoard.map((row) =>
          row.map((cell) =>
            coordinatesToBeOccupied.includes(cell.id)
              ? { ...cell, isOccupied: shipToBePlaced }
              : cell
          )
        )
        const updatedShips = player.playerShips.filter(ship => ship.id !== shipToBePlaced.id)
        sessionStorage.removeItem("selected") 
        
        
        return {...player, playerBoard: newBoard, playerShips: updatedShips}
      } else {
        alert("invalid placement please try again")
        return player
      }
    }else {
      alert("please select a ship first")
      return player
    }
  }
  
  // const updatePlayerShips = (ships) => {
  //     const shipToBePlaced = JSON.parse(sessionStorage.getItem("selected"))
  //     if(isUpdated){
  //       const updatedShips = ships.filter(ship => ship.id !== shipToBePlaced.id)
  //       return updatedShips
  //     }
  //     return ships
  // }

  const shootMissle = (board, rowIndex, colIndex) => {
    // console.log("...still working on it")
      const newBoard = board.map((row, rIndex) =>
      row.map((col, cIndex) =>
        rIndex === rowIndex && cIndex === colIndex
          ? { ...col, isShotAt: !col.isShotAt }
          : col
      )
    )
    return newBoard
  }
  //const providerHost = useMemo(() => ({host, setHost}), [host, setHost])


  // const submitShipPosition = async (array, ship) => {
  //   const startPosition = array[0]
  //   const endPosition = array[array.length - 1]
  //   const shipPlayerShipId = ship.id
  //   const shipPlayerPlayerId = user.id
  //   const response = await api.post(
  //     "/submit/ships",
  //     JSON.stringify({
  //       shipPlayerPlayerId,
  //       shipPlayerShipId,
  //       startPosition,
  //       endPosition,
  //     })
  //   )
  //   return response
  // }

  return (
    <GameContext.Provider value={{host, setHost, joiner, setJoiner,playerOne, playerTwo,setPlayerOne, setPlayerTwo,  handleShoot, handleSelect, handlePlace}}>
      {children}
    </GameContext.Provider>
  )
}
