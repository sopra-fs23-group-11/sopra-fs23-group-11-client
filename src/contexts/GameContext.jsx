import React, { createContext, useState } from "react"
import generateBoard from "../helpers/getBoard"
import shipsData from "../models/ShipsData"
import { api } from "../helpers/api"
import {bigSplash, smallSplash, sinkShipSound, explosionSound} from "../helpers/soundEffects"
import { useToast } from "@chakra-ui/react"

export const GameContext = createContext()

export default function GameProvider({ children }) {
  const [direction, setDirection] = useState("Horizontal")
  const [lobby, setLobby] = useState(null)
  const [errorLogs, setErrorLogs] = useState([])
  let error_logs = []
  const toast = useToast()

  const [user, setUser] = useState({
    id: null,
    name: "",
    avatar: "",
    isHost: false,
  })

  const [player, setPlayer] = useState({
    id: null,
    name: "",
    board: generateBoard(),
    ships: shipsData,
    missesReceived: [],
    hitsReceived: [],
    isReady: false,
    isMyTurn: false,
    hasWon: false,
  })

  const [enemy, setEnemy] = useState({
    id: null,
    name: "",
    board: generateBoard(),
    isReady: false,
  })

  const resetState = () => {
    setPlayer({
      id: null,
      name: "",
      board: generateBoard(),
      ships: shipsData,
      missesReceived: [],
      hitsReceived: [],
      isReady: false,
      isMyTurn: false,
      hasWon: false,
    })

    setEnemy({
      id: null,
      name: "",
      board: generateBoard(),
      isReady: false,
    })
  }

  const handleShoot = (rowIndex, colIndex) => {
    setEnemy((enemy) => ({
      ...enemy,
      board: shootMissle(enemy.board, rowIndex, colIndex),
    }))
    if (enemy.board[rowIndex][colIndex].isOccupied == null ) {
      smallSplash()
    } else {
      explosionSound()
    }
  }

  const handleSunk = (playerId, shipId) => {
    sinkShipSound()
    playerId === player.id
      ? setPlayer((player) => ({
          ...player,
          board: renderSink(player.board, shipId),
        }))
      : setEnemy((enemy) => ({
          ...enemy,
          board: renderSink(enemy.board, shipId),
        }))
  }

  const handlePlace = (rowIndex, colIndex) => {
    setPlayer(updatePlayerSetup(player, rowIndex, colIndex))
  }

  const handleSelect = (shipId) => {
    setPlayer({ ...player, ships: highlightSelection(player.ships, shipId) })
  }

  const highlightSelection = (ships, shipId) => {
    const selectedShip = ships.find((ship) => ship.id === shipId)

    const newShips = ships.map((ship) => {
      if(ship.id === shipId){
        if(ship.isHeld){
          sessionStorage.removeItem("selected")
          return {...ship, isHeld: false}
        }else{
          sessionStorage.setItem("selected", JSON.stringify(selectedShip))
          return {...ship, isHeld: true}
        }
      }else{
        return {...ship, isHeld: false}
      }
    }
      
        // ? { ...ship, isHeld: !ship.isHeld }
        // : { ...ship, isHeld: false }
    )

    
    return newShips
  }

  // get letter value for a  certain index
  function getYCords(ind) {
    let characters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"]
    return characters[ind]
  }

  function getLastPart(url) {
    const parts = url.split("/")
    return parts.at(-1)
  }

  const updatePlayerSetup = (player, rowIndex, colIndex) => {
    const shipToBePlaced = JSON.parse(sessionStorage.getItem("selected"))
    console.log("row:" + rowIndex, "col:" + colIndex)
    if (shipToBePlaced) {
      const length = shipToBePlaced.length
      const coordinatesToBeOccupied = []
      let shipPlayerPlayerId = player.id
      console.log("playerid:" + shipPlayerPlayerId)
      let shipPlayerShipId = shipToBePlaced.id
      console.log("shipId:" + shipPlayerShipId)
      let startPosition
      let endPosition
      let startX
      let startY
      let endX
      let endY
      // place ships either horizontally or vertically
      if (direction === "Horizontal") {
        setErrorLogs([])
        startY = getYCords(rowIndex) // 7 ==>  H
        endY = startY // horizontal has the same row // H
        startX = colIndex // 7
        endX = colIndex + length - 1 // 11
        console.log(
          "rowIndex:" + rowIndex,
          "colIndex:" + colIndex,
          "endY:" + endY,
          "endX:" + endX
        )
        if (endX > 9) {
          toast({
            title: "Invalid Placement",
            description: "Out of Boundary",
              position: "bottom",
              isClosable: true,
              duration: 3000,
              status: "error",
          })
          return player
        } else {
          startPosition = startY.toString() + startX.toString() // H7
          endPosition = endY.toString() + endX.toString()// H11

          for (let i = 0; i < length; i++) {
            coordinatesToBeOccupied.push(
              player.board[rowIndex][colIndex + i].id
            )
          }
        }
      }
      if (direction === "Vertical") {
        setErrorLogs([])
        startY = getYCords(rowIndex) // 7 ==> H
        endY = getYCords(rowIndex + length - 1) // 11 ===> ?
        startX = colIndex // 0
        endX = startX // 0

        if (rowIndex + length - 1 > 9) {
          toast({
            title: "Invalid Placement",
            description: "Out of Boundary",
              position: "bottom",
              isClosable: true,
              duration: 3000,
              status: "error",
          })
          return player
        } else {
          startPosition = startY.toString() + startX.toString() // H0
          endPosition = endY.toString() + endX.toString() // ?0
          for (let i = 0; i < length; i++) {
            coordinatesToBeOccupied.push(
              player.board[rowIndex + i][colIndex].id
            )
          }
        }
      }
      console.log("startPos:" + startPosition, "endPos:" + endPosition)
      submitShipPosition(
        shipPlayerPlayerId,
        shipPlayerShipId,
        startPosition,
        endPosition
      )

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
        bigSplash()
        const updatedShips = player.ships.filter(
          (ship) => ship.id !== shipToBePlaced.id
        )
        sessionStorage.removeItem("selected")

        return { ...player, board: newBoard, ships: updatedShips }
      } else {
        toast({
          title: "Invalid Placement",
          description: "Ships are overlapping",
            position: "bottom",
            isClosable: true,
            duration: 3000,
            status: "error",
        })
        return player
      }
    } else {
      toast({
        title: "Invalid Placement",
        description: "Select a ship first!",
          position: "bottom",
          isClosable: true,
          duration: 3000,
          status: "error",
      })
      return player
    }
  }

  const shootMissle = (board, rowIndex, colIndex) => {
    const newBoard = board.map((row, rIndex) =>
      row.map((cell, cIndex) =>
        rIndex === rowIndex && cIndex === colIndex
          ? cell.isOccupied
            ? { ...cell, isHit: true }
            : { ...cell, isShotAt: true }
          : cell
      )
    )
    return newBoard
  }

  const renderSink = (board, shipId) => {
    const newBoard = board.map((row) => {
      return row.map((cell) => {
         return cell.isOccupied?.id === shipId
          ? { ...cell, isOccupied: { ...cell.isOccupied, isSunk: true } }
          : cell
      })
    })

    return newBoard
  }

  const submitShipPosition = async (
    shipPlayerPlayerId,
    shipPlayerShipId,
    startPosition,
    endPosition
  ) => {
    try {
      const gameId = getLastPart(window.location.href)
      const response = await api.post(
        "/ships",
        JSON.stringify({
          shipPlayerPlayerId,
          shipPlayerShipId,
          startPosition,
          endPosition,
          gameId,
        })
      )
      return response
    } catch (e) {
      //alert("ships are touching")
    }
  }

  return (
    <GameContext.Provider
      value={{
        errorLogs,
        setErrorLogs,
        direction,
        setDirection,
        user,
        setUser,
        player,
        setPlayer,
        lobby,
        setLobby,
        handlePlace,
        handleSelect,
        handleShoot,
        enemy,
        setEnemy,
        handleSunk,
        resetState
      }}
    >
      {children}
    </GameContext.Provider>
  )
}
