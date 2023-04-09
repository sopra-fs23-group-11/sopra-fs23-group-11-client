import React, { useState } from "react";
import "./Game.css"


const Cell = ()=> {
    const [status, setStatus] = useState('EMPTY')
    const [shiptype, setShiptype] = useState('EMPTY')
    const [coordinate, setCoordinate] = useState([])
    console.log('hel')

    const renderCell = () => {
        let statusValue;
        let shipTypevalue;
        if (status === 'EMPTY'){
            statusValue = ''
        } else if (status === 'OCCUPIED'){
            statusValue = 'O'
        } else ( statusValue = 'D')

        if(shiptype === '')

        return(
        <button className="cell" type="button" > {statusValue}
        </button>)
    }

    return (

        renderCell()

    );


}

export default Cell;
