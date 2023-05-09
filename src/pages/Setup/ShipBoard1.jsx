import React, {useState} from "react";
import "./ShipBoard.css";
import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
    Stack,
} from '@chakra-ui/react'
import {api} from "../../helpers/api.js";
import User from "../../models/User.js";

const ShipBoard = (props)=> {

    const[startPointBattle, setStartPointBattle] = useState('')
    const[startPointCarrier, setStartPointCarrier] = useState('')
    const[startPointCruiser, setStartPointCruiser] = useState('')
    const[startPointDestroyer, setStartPointDestroyer] = useState('')
    const[startPointSubmarine, setStartPointSubmarine] = useState('')
    const[endPointBattle, setEndPointBattle] = useState('')
    const[endPointCarrier, setEndPointCarrier] = useState('')
    const[endPointCruiser, setEndPointCruiser] = useState('')
    const[endPointDestroyer, setEndPointDestroyer] = useState('')
    const[endPointSubmarine, setEndPointSubmarine] = useState('')
    const[errorLogs, setErrorLogs] = useState([]);
    let positions = {};
    let error_logs = [];


    const handleStartPoint = (event, shipType) => {
        const inputValue = event.target.value;
        if (shipType === 'Battleship') {setStartPointBattle(inputValue); setErrorLogs([])}
        if (shipType === 'Carrier'){setStartPointCarrier(inputValue); setErrorLogs([])}
        if (shipType === 'Cruiser'){setStartPointCruiser(inputValue); setErrorLogs([])}
        if (shipType === 'Destroyer'){setStartPointDestroyer(inputValue); setErrorLogs([])}
        if (shipType === 'Submarine'){setStartPointSubmarine(inputValue); setErrorLogs([])}
        }


    const handleSubmit = async (shipType) => {
            const positions = {
            battleShip: [startPointBattle, endPointBattle],
            carrier: [startPointCarrier, endPointCarrier],
            cruiser: [startPointCruiser,endPointCruiser],
            destroyer: [startPointDestroyer, endPointDestroyer],
            submarine: [startPointSubmarine, endPointSubmarine]
            };
            const lobbyCode = JSON.parse(localStorage.getItem("lobbyCode"))

            let requestBody = null
        const user = JSON.parse(localStorage.getItem("user"))
        const shipPlayerPlayerId = user.id;
            let shipPlayerShipId = null;
            let startPosition = null;
            let endPosition = null;

        if (shipType === 'Destroyer'){
            shipPlayerShipId = 1;
            startPosition = startPointDestroyer
            endPosition = endPointDestroyer
        }
        if (shipType === 'Submarine'){
            shipPlayerShipId = 2;
            startPosition = startPointSubmarine
            endPosition = endPointSubmarine
            }
        if (shipType === 'Cruiser'){
            shipPlayerShipId = 3;
            startPosition = startPointCruiser
            endPosition = endPointCruiser
            }
        if (shipType === 'Battleship'){
            shipPlayerShipId = 4;
            startPosition = startPointBattle
            endPosition = endPointBattle
            }
        if (shipType === 'Carrier'){
            shipPlayerShipId = 5;
            startPosition = startPointCarrier
            endPosition = endPointCarrier
            }

        requestBody = JSON.stringify({shipPlayerShipId, startPosition, endPosition, shipPlayerPlayerId, lobbyCode})
        console.log("requestBody",requestBody)

    const response = await api.post('/submit/ships', requestBody);
            console.log('props', props)
            console.log('positions', positions)
            //props.onShipPlacement(positions);
        }


    const handleEndPoint = (event, shipType) => {
        const inputValue = event.target.value;
        console.log(inputValue)
        console.log('pp1', positions)
        const regex = /^[A-J]\d$/;
        if (shipType === 'Battleship'){
            setEndPointBattle(inputValue)
            setErrorLogs([])
            if(inputValue.length === 2){
                if (startPointBattle.length !== 2){
                    error_logs.push('Check start point input length')
                }
                if (!regex.test(startPointBattle)|| !regex.test(inputValue)){
                    error_logs.push("Input value must start with a letter from A to J followed by a number from 0 to 9.")
                }
                if((startPointBattle[0]!== inputValue[0]) && startPointBattle[1] !== inputValue[1]){
                error_logs.push("You should have either vertical or horizontal ship.")
            }
                if(startPointBattle[0] === inputValue[0] && Math.abs((+startPointBattle[1]) - (+inputValue[1])) !== 3){
                error_logs.push("You want to put horizontal battleship, but your input squares is not 4!")
            }
                 if(startPointBattle[1] === inputValue[1] && Math.abs((startPointBattle[0].charCodeAt(0) - 65) - (inputValue[0].charCodeAt(0) - 65)) !== 3){
                error_logs.push("You want to put vertical battleship, but your input squares is not 4!")
            }
            }
            else{
                error_logs.push("Make sure input start with a letter from A to J followed by a number from 0 to 9, eg. A3")
            }
            if(error_logs.length > 0){
                setErrorLogs(error_logs)
            } else if (inputValue.length === 2 && startPointBattle.length === 2){
                positions['battleShip'] = [startPointBattle, inputValue];
                if(startPointCarrier && endPointCarrier) {positions['carrier'] = [startPointCarrier, endPointCarrier]}
                if(startPointCruiser && endPointCruiser){positions['cruiser'] = [ startPointCruiser, endPointCruiser]}
                if(startPointDestroyer && endPointDestroyer ){positions['destroyer']=[startPointDestroyer, endPointDestroyer]}
                if(startPointSubmarine && endPointSubmarine ){positions['submarine']=[startPointSubmarine, endPointSubmarine]}
                props.onShipPlacement(positions);
                setErrorLogs([])
            }
        }
         else {
            if (shipType === 'Carrier') {
                setEndPointCarrier(inputValue)
                setErrorLogs([])
                if(inputValue.length === 2){
                    if (startPointCarrier.length !== 2){
                    error_logs.push('Check start point input length')
                }
                    if (!regex.test(startPointCarrier)|| !regex.test(inputValue)){
                    error_logs.push("Input value must start with a letter from A to J followed by a number from 0 to 9.")
                }
                if((startPointCarrier[0]!== inputValue[0]) && startPointCarrier[1] !== inputValue[1]){
                error_logs.push("You should have either vertical or horizontal ship.")
            }
                if(startPointCarrier[0] === inputValue[0] && Math.abs((+startPointCarrier[1]) - (+inputValue[1])) !== 4){
                error_logs.push("You want to put horizontal carrier, but your input squares is not 5!")
            }
                 if(startPointCarrier[1] === inputValue[1] && Math.abs((startPointCarrier[0].charCodeAt(0) - 65) - (inputValue[0].charCodeAt(0) - 65)) !== 4){
                error_logs.push("You want to put vertical carrier, but your input squares is not 5!")
            }
            }
            if(error_logs.length > 0){
                setErrorLogs(error_logs)
            } else if (inputValue.length === 2 && startPointCarrier.length === 2){
                positions['carrier'] = [startPointCarrier, inputValue];
                if(startPointBattle && endPointBattle) {positions['battle'] = [startPointBattle, endPointBattle]}
                if(startPointCruiser && endPointCruiser){positions['cruiser'] = [ startPointCruiser, endPointCruiser]}
                if(startPointDestroyer && endPointDestroyer ){positions['destroyer']=[startPointDestroyer, endPointDestroyer]}
                if(startPointSubmarine && endPointSubmarine ){positions['submarine']=[startPointSubmarine, endPointSubmarine]}
                props.onShipPlacement(positions);
                setErrorLogs([])
            }


            }
            if (shipType === 'Cruiser') {
                setEndPointCruiser(inputValue)
                setErrorLogs([])
                if(inputValue.length === 2){
                    if (startPointCruiser.length !== 2){
                    error_logs.push('Check start point input length')
                }
                    if (!regex.test(startPointCruiser)|| !regex.test(inputValue)){
                    error_logs.push("Input value must start with a letter from A to J followed by a number from 0 to 9.")
                }
                if((startPointCruiser[0]!== inputValue[0]) && startPointCruiser[1] !== inputValue[1]){
                error_logs.push("You should have either vertical or horizontal ship.")
            }
                if(startPointCruiser[0] === inputValue[0] && Math.abs((+startPointCruiser[1]) - (+inputValue[1])) !== 2){
                error_logs.push("You want to put horizontal cruiser, but your input squares is not 3!")
            }
                 if(startPointCruiser[1] === inputValue[1] && Math.abs((startPointCruiser[0].charCodeAt(0) - 65) - (inputValue[0].charCodeAt(0) - 65)) !== 2){
                error_logs.push("You want to put vertical cruiser, but your input squares is not 3!")
            }
            }
            if(error_logs.length > 0){
                setErrorLogs(error_logs)
            } else if (inputValue.length === 2 && startPointCruiser.length === 2){
                positions['cruiser'] = [startPointCruiser, inputValue];
                if(startPointBattle && endPointBattle) {positions['battle'] = [startPointBattle, endPointBattle]}
                if(startPointCarrier && endPointCarrier){positions['carrier'] = [ startPointCarrier, endPointCarrier]}
                if(startPointDestroyer && endPointDestroyer ){positions['destroyer']=[startPointDestroyer, endPointDestroyer]}
                if(startPointSubmarine && endPointSubmarine ){positions['submarine']=[startPointSubmarine, endPointSubmarine]}
                props.onShipPlacement(positions);
                setErrorLogs([])
            }
            }
            if (shipType === 'Destroyer') {
                setEndPointDestroyer(inputValue)
                setErrorLogs([])
                if(inputValue.length === 2){
                    if (startPointDestroyer.length !== 2){
                    error_logs.push('Check start point input length')
                }
                    if (!regex.test(startPointDestroyer)|| !regex.test(inputValue)){
                    error_logs.push("Input value must start with a letter from A to J followed by a number from 0 to 9.")
                }
                if((startPointDestroyer[0]!== inputValue[0]) && startPointDestroyer[1] !== inputValue[1]){
                error_logs.push("You should have either vertical or horizontal ship.")
            }
                if(startPointDestroyer[0] === inputValue[0] && Math.abs((+startPointDestroyer[1]) - (+inputValue[1])) !== 1){
                error_logs.push("You want to put horizontal destroyer, but your input squares is not 2!")
            }
                 if(startPointDestroyer[1] === inputValue[1] && Math.abs((startPointDestroyer[0].charCodeAt(0) - 65) - (inputValue[0].charCodeAt(0) - 65)) !== 1){
                error_logs.push("You want to put vertical destroyer, but your input squares is not 2!")
            }
            }
            if(error_logs.length > 0){
                setErrorLogs(error_logs)
            } else if (inputValue.length === 2 && startPointDestroyer.length === 2){
                positions['destroyer'] = [startPointDestroyer, inputValue];
                if(startPointBattle && endPointBattle) {positions['battle'] = [startPointBattle, endPointBattle]}
                if(startPointCruiser && endPointCruiser){positions['cruiser'] = [ startPointCruiser, endPointCruiser]}
                if(startPointCarrier && endPointCarrier ){positions['carrier']=[startPointCarrier, endPointCarrier]}
                if(startPointSubmarine && endPointSubmarine ){positions['submarine']=[startPointSubmarine, endPointSubmarine]}
                props.onShipPlacement(positions);
                setErrorLogs([])
            }
            }
            if (shipType === 'Submarine') {
                setEndPointSubmarine(inputValue)
                setErrorLogs([])
                if(inputValue.length === 2){
                    if (startPointSubmarine.length !== 2){
                    error_logs.push('Check start point input length')
                }
                    if (!regex.test(startPointSubmarine)|| !regex.test(inputValue)){
                    error_logs.push("Input value must start with a letter from A to J followed by a number from 0 to 9.")
                }
                if((startPointSubmarine[0]!== inputValue[0]) && startPointSubmarine[1] !== inputValue[1]){
                error_logs.push("You should have either vertical or horizontal ship.")
            }
                if(startPointSubmarine[0] === inputValue[0] && Math.abs((+startPointSubmarine[1]) - (+inputValue[1])) !== 2){
                error_logs.push("You want to put horizontal submarine, but your input squares is not 3!")
            }
                 if(startPointSubmarine[1] === inputValue[1] && Math.abs((startPointSubmarine[0].charCodeAt(0) - 65) - (inputValue[0].charCodeAt(0) - 65)) !== 2){
                error_logs.push("You want to put vertical submarine, but your input squares is not 3!")
            }
            }
            if(error_logs.length > 0){
                setErrorLogs(error_logs)
            } else if (inputValue.length === 2 && startPointSubmarine.length === 2){
                positions['submarine'] = [startPointSubmarine, inputValue];
                if(startPointBattle && endPointBattle) {positions['battle'] = [startPointBattle, endPointBattle]}
                if(startPointCruiser && endPointCruiser){positions['cruiser'] = [ startPointCruiser, endPointCruiser]}
                if(startPointDestroyer && endPointDestroyer ){positions['destroyer']=[startPointDestroyer, endPointDestroyer]}
                if(startPointCarrier && endPointCarrier ){positions['carrier']=[startPointCarrier, endPointCarrier]}
                props.onShipPlacement(positions);
                setErrorLogs([])
            }
            }
        }
    }

    const handleRemove =(event, shipType) =>{
        if(shipType === 'Battleship'){
            setStartPointBattle('');
            setEndPointBattle('');
            if(startPointCarrier && endPointCarrier) {positions['carrier'] = [startPointCarrier, endPointCarrier]}
            if(startPointCruiser && endPointCruiser){positions['cruiser'] = [ startPointCruiser, endPointCruiser]}
            if(startPointDestroyer && endPointDestroyer ){positions['destroyer']=[startPointDestroyer, endPointDestroyer]}
            if(startPointSubmarine && endPointSubmarine ){positions['submarine']=[startPointSubmarine, endPointSubmarine]}
            props.onShipPlacement(positions);
        }
        if(shipType === 'Carrier'){
            setStartPointCarrier('');
            setEndPointCarrier('');
            if(startPointBattle && endPointBattle) {positions['battle'] = [startPointBattle, endPointBattle]}
            if(startPointCruiser && endPointCruiser){positions['cruiser'] = [ startPointCruiser, endPointCruiser]}
            if(startPointDestroyer && endPointDestroyer ){positions['destroyer']=[startPointDestroyer, endPointDestroyer]}
            if(startPointSubmarine && endPointSubmarine ){positions['submarine']=[startPointSubmarine, endPointSubmarine]}
            props.onShipPlacement(positions);
        }
        if(shipType === 'Cruiser'){
            setStartPointCruiser('');
            setEndPointCruiser('');
            if(startPointCarrier && endPointCarrier) {positions['carrier'] = [startPointCarrier, endPointCarrier]}
            if(startPointBattle && endPointBattle) {positions['battle'] = [startPointBattle, endPointBattle]}
            if(startPointDestroyer && endPointDestroyer ){positions['destroyer']=[startPointDestroyer, endPointDestroyer]}
            if(startPointSubmarine && endPointSubmarine ){positions['submarine']=[startPointSubmarine, endPointSubmarine]}
            props.onShipPlacement(positions);
        }
        if(shipType === 'Destroyer'){
            setStartPointDestroyer('');
            setEndPointDestroyer('');
            if(startPointCarrier && endPointCarrier) {positions['carrier'] = [startPointCarrier, endPointCarrier]}
            if(startPointBattle && endPointBattle) {positions['battle'] = [startPointBattle, endPointBattle]}
            if(startPointCruiser && endPointCruiser){positions['cruiser'] = [ startPointCruiser, endPointCruiser]}
            if(startPointSubmarine && endPointSubmarine ){positions['submarine']=[startPointSubmarine, endPointSubmarine]}
            props.onShipPlacement(positions);
        }
        if(shipType === 'Submarine'){
            setStartPointSubmarine('');
            setEndPointSubmarine('');
            if(startPointCarrier && endPointCarrier) {positions['carrier'] = [startPointCarrier, endPointCarrier]}
            if(startPointBattle && endPointBattle) {positions['battle'] = [startPointBattle, endPointBattle]}
            if(startPointCruiser && endPointCruiser){positions['cruiser'] = [ startPointCruiser, endPointCruiser]}
            if(startPointDestroyer && endPointDestroyer ){positions['destroyer']=[startPointDestroyer, endPointDestroyer]}
            props.onShipPlacement(positions);
        }
    }


    const renderShipBoard = () => {
        return (<div className="container">
            {errorLogs.length > 0 && <h3>Following error in ship positions:</h3>}
            {errorLogs.length > 0 &&
                <Stack spacing={3}>
                {errorLogs.map(error => {
                return(
                <Alert status='error'>
                <AlertIcon />
            {error}
                </Alert>
                );
            })}
            </Stack>
                }
            <table className="shipBoard">
                <caption className="caption">Ships to be placed</caption>
                <tr>
                    <th>ShipName</th>
                    <th>TotalSquares</th>
                    <th>ShipsAllowed</th>
                    <th>StartPoint</th>
                    <th>EndPoint</th>
                    <th>ShipClear & NewInputs</th>
                    <th>Submit Ships</th>
                </tr>
                <tr>
                    <td>BattleShip</td>
                    <td><center>4</center></td>
                    <td><center>1</center></td>
                    <td> <input type="text" maxLength={2} value={startPointBattle} onChange={(event)=>handleStartPoint(event,'Battleship')}/>
                        </td>
                    <td><input type="text" maxLength={2} value={endPointBattle} onChange={(event)=>handleEndPoint(event, 'Battleship')}/>
                        </td>
                    <td><button className="place" onClick={(event) => handleRemove(event, 'Battleship')}>Remove</button></td>
                    <td><button className="place" onClick={() => handleSubmit('Battleship')}>Submit</button></td>
                </tr>


                <tr>
                    <td>Carrier</td>
                    <td><center>5</center></td>
                    <td><center>1</center></td>
                    <td><input type="text" maxLength={2} value={startPointCarrier} onChange={(event)=>handleStartPoint(event,'Carrier')}/></td>
                    <td><input type="text" maxLength={2} value={endPointCarrier} onChange={(event)=>handleEndPoint(event, 'Carrier')}/></td>
                    <td><button className="place" onClick={(event) => handleRemove(event, 'Carrier')}>Remove</button></td>
                    <td><button className="place" onClick={() => handleSubmit('Carrier')}>Submit</button></td>
                </tr>
                <tr>
                    <td>Cruiser</td>
                    <td><center>3</center></td>
                    <td><center>1</center></td>
                    <td><input type="text" maxLength={2} value={startPointCruiser} onChange={(event)=>handleStartPoint(event,'Cruiser')}/></td>
                    <td><input type="text" maxLength={2} value={endPointCruiser} onChange={(event)=>handleEndPoint(event, 'Cruiser')}/></td>
                    <td><button className="place" onClick={(event) => handleRemove(event, 'Cruiser')}>Remove</button></td>
                    <td><button className="place" onClick={() => handleSubmit('Cruiser')}>Submit</button></td>
                </tr>
                <tr>
                    <td>Destroyer</td>
                    <td><center>2</center></td>
                    <td><center>1</center></td>
                    <td><input type="text" maxLength={2} value={startPointDestroyer} onChange={(event)=>handleStartPoint(event,'Destroyer')}/></td>
                    <td><input type="text" maxLength={2} value={endPointDestroyer} onChange={(event)=>handleEndPoint(event, 'Destroyer')}/></td>
                    <td><button className="place" onClick={(event) => handleRemove(event, 'Destroyer')}>Remove</button></td>
                    <td><button className="place" onClick={() => handleSubmit('Destroyer')}>Submit</button></td>
                </tr>
                <tr>
                    <td>Submarine</td>
                    <td><center>3</center></td>
                    <td><center>1</center></td>
                    <td><input type="text" maxLength={2} value={startPointSubmarine} onChange={(event)=>handleStartPoint(event,'Submarine')}/></td>
                    <td><input type="text" maxLength={2} value={endPointSubmarine} onChange={(event)=>handleEndPoint(event, 'Submarine')}/></td>
                    <td><button className="place" onClick={(event) => handleRemove(event, 'Submarine')}>Remove</button></td>
                    <td><button className="place" onClick={() => handleSubmit('Submarine')}>Submit</button></td>
                </tr>
            </table>
        </div>)
    }
    return (renderShipBoard())
}

export default ShipBoard;

