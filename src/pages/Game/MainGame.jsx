import React, { useState, useEffect, useContext } from "react"
import { api } from "../../helpers/api.js"
import { Flex } from "@chakra-ui/react"
import { GameContext } from "../../contexts/GameContext.jsx"
import AttackBoard from "./AttackBoard.jsx"

export default function MainGame() {
  const {host, playerOne, playerTwo, handleShoot} = useContext(GameContext)
  let socket = null
//   const user = JSON.parse(sessionStorage.getItem("user"))
//   const id = user.id
//   const hostId = sessionStorage.getItem("hostId")

//   useEffect(() => {
//     async function getShipPositions() {
//       try {
//         const response1 = await api.get(`/ships/${id}`)
//         setShipPositions1(response1.data)
//         // const response2 = await api.get(`/ships/${id}`)
//       } catch (error) {
//         console.log(error)
//       }
//     }
//     getShipPositions()
//   }, [])


//   shipPositions1.shipPlayers.forEach(el => console.log(el))
const shootMissle = (id, rowIndex, colIndex) => {
    //console.log(e.target.id)
    //const position = gameBoard.grid[rowIndex][colIndex].id
    if (socket)
      socket.send("/app/game-simple", {}, JSON.stringify({ position }))
    handleShoot(id, rowIndex, colIndex)
  }
  
  return (
    <div>
        <Flex>
            <AttackBoard
            socket={socket}
            board={playerOne.playerBoard}
            handleShoot={shootMissle}
            />
            <AttackBoard
            socket={socket}
            board={playerTwo.playerBoard}
            handleShoot={shootMissle}
            />
        </Flex>
    </div>
  )
}
