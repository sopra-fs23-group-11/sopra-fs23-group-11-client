import React from "react"
import { Grid, GridItem, Box } from "@chakra-ui/react"
import Destroyer from "../models/Destroyer.jpeg"
import Submarine from "../models/Submarine.jpeg"
import Cruiser from "../models/Cruiser.jpeg"
import Carrier from "../models/Carrier.jpeg"
import Battleship from "../models/Battleship.jpeg"

export default function Ships(props) {

   
  return (
        <Box 
        borderWidth="3px"
        borderRadius="md"
        p={2}
        textAlign="center"
        onClick={() => props.handleSelect(props.shipId)}
        borderColor={props.isHeld  ? "#59E391" : "#F0F4F8"}
        opacity = {props.isHeld ? 1 : 0.5}
        backgroundImage = {
            props.type === "Destroyer" ? `url(${Destroyer})` :
            props.type === "Submarine" ? `url(${Submarine})`:
            props.type === "Cruiser" ? `url(${Cruiser})`:
            props.type === "BattleShip" ? `url(${Carrier})`:
            props.type === "Carrier" ? `url(${Battleship})`:null
        }
        backgroundSize = "100%"
        height = "40px"
        backgroundRepeat = "no-repeat"
        backgroundPosition = "center"
        borderBottomWidth = "4px"
        borderBottomStyle = "solid"
        borderBottomColor = "#3C4E5A"
        width={`calc(50px * ${props.length})`}
        />
  )
}
