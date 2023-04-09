import React, { useState } from "react";
import "./Game.css";
import Cell from "./Cell";

const Board = () => {
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
    for (let row = -1; row < board.length; row++) {
      const cols = [];
      for (let col = -1; col < board.length; col++) {
        if (row === -1 && col === -1) {
          cols.push(
            <td key={col} className="corner-cell"></td>
          );
        } else if (row === -1) {
          cols.push(
            <th key={col} className="top-label">{String.fromCharCode(65 + col)}</th>
          );
        } else if (col === -1) {
          cols.push(
            <th key={col} className="side-label">{row + 1}</th>
          );
        } else {
          cols.push(
            <td key={`${row},${col}`} className="cell" onClick={()=> handleCellClick(row,col)}>
              {/*<input type="text" style={{width: "40px", height: "40px"}}*/}
              {/*       value={board[row][col]} onChange={(e) => handleChange(e, row, col)} />*/}
              <Cell></Cell>
            </td>
          );
        }
      }
      rows.push(<tr key={row}>{cols}</tr>);
    }
    return rows;
  };

  return (
    <table className="board">
      <tbody>{renderBoard()}</tbody>
    </table>
  );
};

export default Board;
