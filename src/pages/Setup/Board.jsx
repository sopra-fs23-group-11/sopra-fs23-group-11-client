import React, { useState} from "react";
import "./Setup.css";
import Cell from "./Cell";



const Board = (props) => {
  const [board, setBoard] = useState(Array(10).fill(Array(10).fill("")));
  const [hits, setHits] = useState([]);
  const [shipStatus, setShipStatus] = useState({
    battleShip: "OK", carrier: "OK", cruiser: "OK", destroyer: "OK", submarine: "OK"
  })
  const [showHits, setShowHits] = useState(false)



  const handleCellClick = (row, col) => {
    // Add clicked cell to hits array

    console.log("cell", row,col)
    const cell = {row, col}
    const updateHits = [...hits, cell];
    console.log("hits1", hits)
    console.log(updateHits)
    setHits(updateHits)
    console.log("hits2", hits)


    // Check if cell is a hit or a miss
    const isHit = Object.keys(props.shipPositions).some(ship => (
        props.shipPositions[ship].some(shipCell => (
        shipCell.row === cell.row && shipCell.col === cell.col))))

    if (isHit){
      // Update board with hit
      board[row][col] = "H"
      // check if ship is destroyed
      const ship = Object.keys(props.shipPositions).find(ship => (
          props.shipPositions[ship].every(shipCell=> (hits.some(hit => (
              hit.row === shipCell.row && hit.col === shipCell.col
          ))))
      ))
      if(ship){
        // Update ship status
        setShipStatus(prevShipStatus => ({
          ...prevShipStatus, [ship]: "DESTROYED"
        }))
      }
    } else{
      // update board with miss
      return board[row][col] = "M";
    }
  };

  const renderBoard = () => {
    const rows = [];
    // Render the ship positions
    const shipCells = [];
    for (const ship in props.shipPositions) {
      const [start, end] = props.shipPositions[ship];
      const [startRow, startCol] = start.split("");
      const [endRow, endCol] = end.split("");
      let [newStartRow, newEndRow] = [startRow.charCodeAt(0) - 65, endRow.charCodeAt(0) - 65];
      let [newStartCol, newEndCol] = [parseInt(startCol), parseInt(endCol)];
      // Swap start and end points if necessary to make sure row or column is in increasing order
      if (newStartRow > newEndRow || newStartCol > newEndCol) {
        [newStartRow, newEndRow] = [newEndRow, newStartRow];
        [newStartCol, newEndCol] = [newEndCol, newStartCol];
      }
      // Add each cell of the ship to the shipCells Array
      for (let row = newStartRow; row <= newEndRow; row++) {
        for (let col = newStartCol; col <= newEndCol; col++) {
          shipCells.push({row, col});
        }
      }
    }

   // Render each row of the board
   for (let row = -1; row < board.length; row++) {
      const cols = [];
      // Render each cell in the row
      for (let col = -1; col < board.length; col++) {
        const cell = {x:row, y:col};
        let isShip = shipCells.some(
            (shipCell) => (shipCell.row === cell.x && shipCell.col === cell.y)
        );
        if (row === -1 && col === -1) {
          cols.push(
            <td key={col} className="corner-cell"></td>
          );} else if (row === -1) {
          cols.push(
            <th key={col} className="top-label">{col}</th>
          );} else if (col === -1) {
          cols.push(
            <th key={col} className="side-label">{String.fromCharCode(65+row)}</th>
          );} else if(isShip){
          cols.push(
              <td className="ship-cell">
              </td>
          );} else {
          cols.push(
            <td key={`${row},${col}`} className="cell" >
            </td>
          );}
      }
        rows.push(<tr key={row}>{cols}</tr>);
      }
  return rows;
  }
  return (
    <table className="board">
      <tbody>{renderBoard()}</tbody>
    </table>
  );
}



export default Board;
