import React from "react"
import { Box } from "@chakra-ui/react"
import Destroyer from "../assets/Destroyer.jpeg"
import Submarine from "../assets/Submarine.jpeg"
import Cruiser from "../assets/Cruiser.jpeg"
import Carrier from "../assets/Carrier.jpeg"
import Battleship from "../assets/Battleship.jpeg"


export default function Ships(props) {

   
  return (
        <Box 
        borderWidth="3px"
        borderRadius="md"
        textAlign="center"
        onClick={() => props.handleSelect(props.shipId)}
        borderColor={props.isHeld  ? "#59E391" : "#F0F4F8"}
        opacity = {props.isHeld ? 1 : 0.6}
        backgroundImage = {
            props.type === "Destroyer" ? `url(${Destroyer})` :
            props.type === "Submarine" ? `url(${Submarine})`:
            props.type === "Cruiser" ? `url(${Cruiser})`:
            props.type === "BattleShip" ? `url(${Carrier})`:
            props.type === "Carrier" ? `url(${Battleship})`:null
        }
        backgroundSize = "100%"
        minH = "40px"
        backgroundRepeat = "no-repeat"
        backgroundPosition = "center"
        borderBottomWidth = "4px"
        borderBottomStyle = "solid"
        borderBottomColor = "#3C4E5A"
        width={`calc(60px * ${props.length})`}
        mb="20px"
        />
  )
}
