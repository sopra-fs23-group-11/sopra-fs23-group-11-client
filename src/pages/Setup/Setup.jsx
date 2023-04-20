import React from 'react';
import Board from './Board.jsx';
import ShipBoard from "./ShipBoard.jsx";
import {Box, Button} from "@chakra-ui/react";
import {Link} from "react-router-dom";

import './Setup.css';
import {useState} from "react";


const Setup =() =>{

    const[shipPositions, setShipPositions] = useState([])
    function handleShipPlacement(positions){
        console.log('position', positions)
        setShipPositions(positions)
        console.log('shipPosition', shipPositions)
  // there is function takes value from ShipBoard
    // put all 10 input values
  //const getValueFromShipBoard(startPointBattle, endPointBattle, startPointCruiser, endPointCruiser) {

    // https://timmousk.com/blog/react-call-function-in-child-component/
        // read that, how to pass values to child component
    }

  return (
    <div className="float-container">
      <div className="float-child1"><Board shipPositions={shipPositions}/></div>
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
    </div>
  );
}

export default Setup;
