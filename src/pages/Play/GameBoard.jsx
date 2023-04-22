import React , {useState, useEffect}from 'react';
import Board from '../Setup/Board.jsx';
import ShipBoard from "../Setup/ShipBoard.jsx";
import {Box, Button} from "@chakra-ui/react";
import {Link} from "react-router-dom";


const GameBoard =() => {
    
    const [shipPositions, setShipPositions] = useState(null)
    const user = JSON.parse(localStorage.getItem("user"))
    const id = user.id

    useEffect(()=> {
        async function getShipPositions(){
            try{
                const response = await api.get(`/ships/${id}`)
                setShipPositions(response)
            }catch(error){
                console.log(error)
            }
        }
        getShipPositions()

    },[])

    console.log(shipPositions)

    let positions = {}

    for (const obj of shipPositions) {
        positions[obj.id] = [obj.startPosition, obj.endPosition]
    }

    console.log(positions)
    return (
        <>
        <div><Board shipPositions={shipPositions}/></div>
        <div><Board shipPositions={shipPositions}/></div>
        </>
    )
}
export default GameBoard;
