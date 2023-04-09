import React, {useState} from "react";
import "./ShipBoard.css";

const ShipBoard = ()=> {

    const renderShipBoard = () => {
        return (<div>
            <table className="shipBoard">
                <caption className="caption">Ships to be placed</caption>
                <tr>
                    <th>ShipName</th>
                    <th>Allowed</th>
                    <th>StartPoint</th>
                    <th>EndPoint</th>
                </tr>
                <tr>
                    <td>BattleShip</td>
                    <td>1</td>
                    <td></td>
                    <td></td>
                </tr>
                <tr>
                    <td>Carrier</td>
                    <td>1</td>
                    <td></td>
                    <td></td>
                </tr>
                <tr>
                    <td>Cruiser</td>
                    <td>1</td>
                    <td></td>
                    <td></td>
                </tr>
                <tr>
                    <td>Destroyer</td>
                    <td>1</td>
                    <td></td>
                    <td></td>
                </tr>
                <tr>
                    <td>Submarine</td>
                    <td>1</td>
                    <td></td>
                    <td></td>
                </tr>
            </table>
        </div>)
    }
    return (renderShipBoard())

}

export default ShipBoard;
