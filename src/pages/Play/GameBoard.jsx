import React,  from 'react';
import Board from '../Setup/Board.jsx';
import ShipBoard from "../Setup/ShipBoard.jsx";
import {Box, Button} from "@chakra-ui/react";
import {Link} from "react-router-dom";


const GameBoard =({shipPositions}) => {
    return (
        <>
        <div><Board shipPositions={shipPositions}/></div>
        <div><Board shipPositions={shipPositions}/></div>
        </>
    )
}
export default GameBoard;
