import React, {useState, useEffect} from "react";
import "./ShipBoard.css";


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
    let positions = {};


    const handleStartPoint = (event, shipType) => {
        const inputValue = event.target.value;
        const regex = /^[A-J]\d$/;
        if(!regex.test(inputValue)){
            alert("Input value must start with a letter from A to J followed by a number from 0 to 9")
        }else{
            if (shipType === 'Battleship') {setStartPointBattle(inputValue)}
            if (shipType === 'Carrier'){setStartPointCarrier(inputValue)}
            if (shipType === 'Cruiser'){setStartPointCruiser(inputValue)}
            if (shipType === 'Destroyer'){setStartPointDestroyer(inputValue)}
            if (shipType === 'Submarine'){setStartPointSubmarine(inputValue)}
        }
    }

   const handlePlace = () => {
        const positions = {};
        if(startPointBattle && endPointBattle){
            positions['battleShip'] = [startPointBattle, endPointBattle];
        } if (startPointCarrier && endPointCarrier){
            positions['carrier'] = [startPointCarrier, endPointCarrier]
        } if (startPointCruiser && endPointCruiser){
            positions['cruiser'] = [ startPointCruiser, endPointCruiser]
        } if (startPointDestroyer && endPointDestroyer){
            positions['destroyer']=[startPointDestroyer, endPointDestroyer]
        } if (startPointSubmarine && endPointDestroyer){
            positions['submarine']=[startPointSubmarine, endPointSubmarine]
        }
        props.onShipPlacement(positions)
    }

    const handleSubmit = () => {
        if(startPointBattle && endPointBattle && startPointCarrier && endPointCarrier && startPointCruiser && endPointCruiser
        && startPointDestroyer && endPointDestroyer && startPointSubmarine && endPointSubmarine){
            const positions = {
            battleShip: [startPointBattle, endPointBattle],
            carrier: [startPointCarrier, endPointCarrier],
            cruiser: [startPointCruiser,endPointCruiser],
            destroyer: [startPointDestroyer, endPointDestroyer],
            submarine: [startPointSubmarine, endPointSubmarine]
            };
        //props.getPosition(positions);
            console.log('props', props)
            console.log('positions', positions)
            props.onShipPlacement(positions);
        } else{
            alert("Please enter start and end points for all ships.")
        }
    }

    const handleEndPoint = (event, shipType) => {
        let isVertical = false;
        let isHorizontal = false;
        const inputValue = event.target.value;
        console.log(inputValue)
        console.log('pp1', positions)
        const regex = /^[A-J]\d$/;
        if (!regex.test(inputValue)) {
            alert("Input value must start with a letter from A to J followed by a number from 0 to 9")
        }
        if (shipType === 'Battleship' && startPointBattle === '') {
            alert(`For ${shipType}, you should have input in StartPoint first!`)
        }
        if (shipType === 'Carrier' && startPointCarrier === '') {
            alert(`For ${shipType}, you should have input in StartPoint first!`)
        }
        if (shipType === 'Cruiser' && startPointCruiser === '') {
            alert(`For ${shipType}, you should have input in StartPoint first!`)
        }
        if (shipType === 'Destroyer' && startPointDestroyer === '') {
            alert(`For ${shipType}, you should have input in StartPoint first!`)
        }
        if (shipType === 'Submarine' && startPointSubmarine === '') {
            alert(`For ${shipType}, you should have input in StartPoint first!`)
        } else {
            if (shipType === 'Battleship') {
                if (startPointBattle[0] === inputValue[0]) {
                    isHorizontal = true
                }
                if (startPointBattle[1] === inputValue[1]) {
                    isVertical = true
                }
                if (isVertical === false && isHorizontal === false) {
                    alert("You should have either vertical or horizontal ship.")
                } else if (isHorizontal && Math.abs((+startPointBattle[1]) - (+inputValue[1])) !== 3) {
                    alert("You want to put horizontal battleship, but your input squares is not 4!")
                } else if (isVertical && Math.abs((startPointBattle[0].charCodeAt(0) - 65) - (inputValue[0].charCodeAt(0) - 65)) !== 3) {
                    alert("You want to put vertical battleship, but your input squares is not 4!")
                } else {
                    setEndPointBattle(inputValue);
                positions['battleShip'] = [startPointBattle, inputValue];
                if(startPointCarrier && endPointCarrier) {positions['carrier'] = [startPointCarrier, endPointCarrier]}
                if(startPointCruiser && endPointCruiser){positions['cruiser'] = [ startPointCruiser, endPointCruiser]}
                if(startPointDestroyer && endPointDestroyer ){positions['destroyer']=[startPointDestroyer, endPointDestroyer]}
                if(startPointSubmarine && endPointSubmarine ){positions['submarine']=[startPointSubmarine, endPointSubmarine]}
                props.onShipPlacement(positions);
                console.log(positions)
                }
            }
            if (shipType === 'Carrier') {
                if (startPointCarrier[0] === inputValue[0]) {
                    isHorizontal = true
                }
                if (startPointCarrier[1] === inputValue[1]) {
                    isVertical = true
                }
                if (isVertical === false && isHorizontal === false) {
                    alert("You should have either vertical or horizontal ship.")
                } else if (isHorizontal && Math.abs((+startPointCarrier[1]) - (+inputValue[1])) !== 4) {
                    alert("You want to put horizontal carrier, but your input squares are not 5!")
                } else if (isVertical && Math.abs((startPointCarrier[0].charCodeAt(0) - 65) - (inputValue[0].charCodeAt(0) - 65)) !== 4) {
                    alert("You want to put vertical carrier, but your input squares are not 5!")
                } else {
                    setEndPointCarrier(inputValue);
                    positions['carrier'] = [startPointCarrier, inputValue]
                if(startPointBattle  && endPointBattle) {positions['battle'] = [startPointBattle, endPointBattle]}
                if(startPointCruiser  && endPointCruiser ){positions['cruiser'] = [ startPointCruiser, endPointCruiser]}
                if(startPointDestroyer && endPointDestroyer ){positions['destroyer']=[startPointDestroyer, endPointDestroyer]}
                if(startPointSubmarine && endPointSubmarine ){positions['submarine']=[startPointSubmarine, endPointSubmarine]}
                props.onShipPlacement(positions)
                }
            }
            if (shipType === 'Cruiser') {
                if (startPointCruiser[0] === inputValue[0]) {
                    isHorizontal = true
                }
                if (startPointCruiser[1] === inputValue[1]) {
                    isVertical = true
                }
                if (isVertical === false && isHorizontal === false) {
                    alert("You should have either vertical or horizontal ship.")
                } else if (isHorizontal && Math.abs((+startPointCruiser[1]) - (+inputValue[1])) !== 2) {
                    alert("You want to put horizontal cruiser, but your input squares are not 3!")
                } else if (isVertical && Math.abs((startPointCruiser[0].charCodeAt(0) - 65) - (inputValue[0].charCodeAt(0) - 65)) !== 2) {
                    alert("You want to put vertical cruiser, but your input squares are not 3!")
                } else {
                    setEndPointCruiser(inputValue);
                    positions['cruiser'] = [startPointCruiser,inputValue];
                if(startPointCarrier && endPointCarrier){positions['carrier'] = [startPointCarrier, endPointCarrier]}
                if(startPointBattle&&endPointBattle){positions['battle'] = [ startPointBattle, endPointBattle]}
                if(startPointDestroyer && endPointDestroyer){positions['destroyer']=[startPointDestroyer, endPointDestroyer]}
                if(startPointSubmarine&&endPointSubmarine){positions['submarine']=[startPointSubmarine, endPointSubmarine]}
                props.onShipPlacement(positions)
                }
            }
            if (shipType === 'Destroyer') {
                if (startPointDestroyer[0] === inputValue[0]) {
                    isHorizontal = true
                }
                if (startPointDestroyer[1] === inputValue[1]) {
                    isVertical = true
                }
                if (isVertical === false && isHorizontal === false) {
                    alert("You should have either vertical or horizontal ship.")
                } else if (isHorizontal && Math.abs((+startPointDestroyer[1]) - (+inputValue[1])) !== 1) {
                    alert("You want to put horizontal destroyer, but your input squares are not 2!")
                } else if (isVertical && Math.abs((startPointDestroyer[0].charCodeAt(0) - 65) - (inputValue[0].charCodeAt(0) - 65)) !== 1) {
                    alert("You want to put vertical destroyer, but your input squares are not 2!")
                } else {
                    setEndPointDestroyer(inputValue)
                positions['destroyer'] = [startPointDestroyer, inputValue];
                if(startPointCarrier&&endPointCarrier){positions['carrier'] = [startPointCarrier, endPointCarrier]}
                if(startPointCruiser&&endPointCruiser){positions['cruiser'] = [ startPointCruiser, endPointCruiser]}
                if(startPointBattle && endPointBattle){positions['battle']=[startPointBattle, endPointBattle]}
                if(startPointSubmarine && endPointSubmarine){positions['submarine']=[startPointSubmarine, endPointSubmarine]}
                props.onShipPlacement(positions)
                }
            }
            if (shipType === 'Submarine') {
                if (startPointSubmarine[0] === inputValue[0]) {
                    isHorizontal = true
                }
                if (startPointSubmarine[1] === inputValue[1]) {
                    isVertical = true
                }
                if (isVertical === false && isHorizontal === false) {
                    alert("You should have either vertical or horizontal ship.")
                } else if (isHorizontal && Math.abs((+startPointSubmarine[1]) - (+inputValue[1])) !== 2) {
                    alert("You want to put horizontal submarine, but your input squares are not 3!")
                } else if (isVertical && Math.abs((startPointSubmarine[0].charCodeAt(0) - 65) - (inputValue[0].charCodeAt(0) - 65)) !== 2) {
                    alert("You want to put vertical submarine, but your input squares are not 3!")
                } else {
                    setEndPointSubmarine(inputValue)
                positions['submarine'] = [startPointSubmarine, inputValue];
                if(startPointCarrier && endPointCarrier){positions['carrier'] = [startPointCarrier, endPointCarrier]}
                if(startPointCruiser && endPointCruiser){positions['cruiser'] = [ startPointCruiser, endPointCruiser]}
                if(startPointDestroyer && endPointDestroyer){positions['destroyer']=[startPointDestroyer, endPointDestroyer]}
                if(startPointBattle && endPointBattle){positions['battle']=[startPointBattle, endPointBattle]}
                props.onShipPlacement(positions);
                console.log('ppd', positions)
                }
            }
        }
    }


    const renderShipBoard = () => {
        return (<div className="container">
            <table className="shipBoard">
                <caption className="caption">Ships to be placed</caption>
                <tr>
                    <th>ShipName</th>
                    <th>TotalSquares</th>
                    <th>ShipsAllowed</th>
                    <th>StartPoint</th>
                    <th>EndPoint</th>
                    <th>ShipClear</th>
                </tr>
                <tr>
                    <td>BattleShip</td>
                    <td><center>4</center></td>
                    <td><center>1</center></td>
                    <td><input type="text" onBlur={(event)=>handleStartPoint(event,'Battleship')}/></td>
                    <td><input type="text" onBlur={(event)=>handleEndPoint(event, 'Battleship')}/></td>
                    <td><button className="place" onClick={handlePlace}>Remove</button></td>
                </tr>
                <tr>
                    <td>Carrier</td>
                    <td><center>5</center></td>
                    <td><center>1</center></td>
                    <td><input type="text" onBlur={(event)=>handleStartPoint(event,'Carrier')}/></td>
                    <td><input type="text" onBlur={(event)=>handleEndPoint(event, 'Carrier')}/></td>
                    <td><button className="place" onClick={handlePlace}>Remove</button></td>
                </tr>
                <tr>
                    <td>Cruiser</td>
                    <td><center>3</center></td>
                    <td><center>1</center></td>
                    <td><input type="text" onBlur={(event)=>handleStartPoint(event,'Cruiser')}/></td>
                    <td><input type="text" onBlur={(event)=>handleEndPoint(event, 'Cruiser')}/></td>
                    <td><button className="place" onClick={handlePlace}>Remove</button></td>
                </tr>
                <tr>
                    <td>Destroyer</td>
                    <td><center>2</center></td>
                    <td><center>1</center></td>
                    <td><input type="text" onBlur={(event)=>handleStartPoint(event,'Destroyer')}/></td>
                    <td><input type="text" onBlur={(event)=>handleEndPoint(event, 'Destroyer')}/></td>
                    <td><button className="place" onClick={handlePlace}>Remove</button></td>
                </tr>
                <tr>
                    <td>Submarine</td>
                    <td><center>3</center></td>
                    <td><center>1</center></td>
                    <td><input type="text" onBlur={(event)=>handleStartPoint(event,'Submarine')}/></td>
                    <td><input type="text" onBlur={(event)=>handleEndPoint(event, 'Submarine')}/></td>
                    <td><button className="place" onClick={handlePlace}>Remove</button></td>
                </tr>
            </table>
            <button className="button" onClick={handleSubmit}>Submit</button>
        </div>)
    }
    return (renderShipBoard())
}

export default ShipBoard;
