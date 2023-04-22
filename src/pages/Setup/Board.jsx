import React, { useState, useContext } from "react";
import "./Setup.css";
import Cell from "./Cell";



const Board = (props) => {
  const [board, setBoard] = useState(Array(10).fill(Array(10).fill("")));

  const handleChange = (event, row, col) => {
    const value = event.target.value;
    console.log(row, col, value)
    setBoard(prevBoard => {
      console.log(prevBoard)
      const newBoard = [...prevBoard];
      console.log(newBoard)
      newBoard[row][col] = value;
      console.log(newBoard)
      return newBoard;
    });
  };

  const handleCellClick = (row, col) => {
    // pass row and col to backend to check if valid move
    // if valid, update board with new move
  }

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
            <td key={`${row},${col}`} className="cell" onClick={()=> handleCellClick(row,col)}>
             <Cell></Cell>
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
