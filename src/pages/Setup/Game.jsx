import React from 'react';
import Board from './Board.jsx';
import ShipBoard from "./ShipBoard.jsx";
import {Box, Button} from "@chakra-ui/react"
import { Link } from "react-router-dom";

import './Game.css';


function Game() {
  return (
    <div className="float-container">
      <div className="float-child1"><Board /></div>
      <div className="float-child2"><ShipBoard/></div>
        <div>
            <Box position="fixed" bottom="4rem" right="2rem">
                <Button as={Link} to="/play" colorScheme="blue">
                    Submit Ships
                </Button>
            </Box>
        </div>
    </div>
  );
}

export default Game;
