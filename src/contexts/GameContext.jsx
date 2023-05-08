import React, { createContext, useEffect, useState } from "react"
import { Stomp } from "stompjs/lib/stomp"
import generateBoard from "../helpers/getBoard"
import shipsData from "../models/ShipsData"
import { api } from "../helpers/api"
import waterSound from "../assets/sounds/water.mp3";
import bigSplash1 from '../assets/sounds/bigSplash1.mp3'
import bigSplash2 from '../assets/sounds/bigSplash2.mp3'
import bigSplash3 from '../assets/sounds/bigSplash3.mp3'
import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Stack,
} from "@chakra-ui/react";

export const GameContext = createContext()

export default function GameProvider({ children }) {
  const [direction, setDirection] = useState("Horizontal")
  const [lobby, setLobby] = useState(null)
  const [game, setGame] = useState(null)
  const[errorLogs, setErrorLogs] = useState([])
  let error_logs = []

  const [user, setUser] = useState({
    id: null,
    name: "",
    avatar: "",
    isHost: false
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
    isReady: false
  })

  const handleShoot = (rowIndex, colIndex) => {

      setEnemy(enemy => ({...enemy, board:shootMissle(enemy.board, rowIndex, colIndex)}))
    smallSplash();
    smallSplash();

  }
  function smallSplash() {
    const audio = new Audio(waterSound);
    audio.play();
  }
  function bigSplash() {
    const audio1 = new Audio(bigSplash1);
    const audio2 = new Audio(bigSplash2);
    const audio3 = new Audio(bigSplash3);
    const randomNumber = Math.random();
    if (randomNumber < 0.33) {
      audio1.play();
    } else if (randomNumber < 0.66) {
      audio2.play();
    } else {
      audio3.play();
    }

  }
  function smallSplash() {
    const audio = new Audio(waterSound);
    audio.play();
  }
  function bigSplash() {
    const audio1 = new Audio(bigSplash1);
    const audio2 = new Audio(bigSplash2);
    const audio3 = new Audio(bigSplash3);
    const randomNumber = Math.random();
    if (randomNumber < 0.33) {
      audio1.play();
    } else if (randomNumber < 0.66) {
      audio2.play();
    } else {
      audio3.play();
    }

  }

  const handlePlace = (rowIndex, colIndex) => {
      setPlayer(updatePlayerSetup(player, rowIndex, colIndex))
      bigSplash();
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
      let startX; let startY; let endX; let endY
      // place ships either horizontally or vertically
      if(direction=== "Horizontal") {
        setErrorLogs([])
        startY = getYCords(rowIndex); // 7 ==>  H
        endY = startY // horizontal has the same row // H
        startX = colIndex; // 7
        endX = colIndex + length-1; // 11
        console.log("rowIndex:" + rowIndex, "colIndex:" + colIndex, "endY:" + endY, "endX:" + endX)
        if(endX > 9){
          error_logs.push("Out of boundary!")
          setErrorLogs(error_logs)
          return player
        }
        else
        {
          startPosition = startY.toString() + startX.toString(); // H7
          endPosition = endY.toString() + endX.toString(); // H11
          for (let i = 0; i < length; i++) {
          coordinatesToBeOccupied.push(player.board[rowIndex][colIndex + i].id)
        }
        }
      }
      if(direction === "Vertical"){
        setErrorLogs([])
        startY = getYCords(rowIndex) // 7 ==> H
        endY = getYCords(rowIndex + length -1) // 11 ===> ?
        startX = colIndex // 0
        endX = startX // 0

        if (rowIndex + length -1 > 9){
          error_logs.push("Out of boundary!")
          setErrorLogs(error_logs)
          return player
        }

        else
        {
          startPosition = startY.toString() + startX.toString() // H0
        endPosition = endY.toString() + endX.toString() // ?0
        for(let i =0; i <length; i++){
          coordinatesToBeOccupied.push(player.board[rowIndex + i][colIndex].id)
        }}
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
        error_logs.push("Invalid placement, please try again!")
        setErrorLogs(error_logs)
        return player
      }
    }else {
      error_logs.push("Please select a ship first!")
      setErrorLogs(error_logs)
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
    <GameContext.Provider value={{errorLogs, setErrorLogs, direction, setDirection, user, setUser, player, setPlayer, lobby, setLobby, handlePlace, handleSelect, game, setGame, handleShoot, enemy, setEnemy}}>
      {children}
    </GameContext.Provider>
  )
}
