import React, {useState} from 'react';
import Board from './Board.jsx';
import ShipBoard from "./ShipBoard.jsx";
import {Box, Button} from "@chakra-ui/react";
import {Link} from "react-router-dom";
import GameBoard from "../Play/GameBoard.jsx";


import './Setup.css';



const Setup =() =>{

    const[shipPositions, setShipPositions] = useState([])
    function handleShipPlacement(positions){
        console.log('position', positions)
        setShipPositions(positions)

    }

    console.log('shipPosition', shipPositions)

  return (
    <div className="float-container">
      <div className="float-child1" ><Board shipPositions={shipPositions}/></div>
      <div className="float-child2">
          <div className="ship-board-container">
            <ShipBoard onShipPlacement={handleShipPlacement}/>
            <div className="button-container">
                <Box >
                    <Button as={Link} to="/play" colorScheme="blue">
                    Submit Ships
                    </Button>
                </Box>
            </div>
          </div>
      </div>
      <div>  <GameBoard shipPositions = {shipPositions}/> </div>
    </div>

  );
}

export default Setup;
