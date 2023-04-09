import React from 'react';
import Board from './Board.jsx';
import ShipBoard from "./ShipBoard.jsx";

import './Game.css';


function Game() {
  return (
    <div className="float-container">
      <div className="float-child1"><Board /></div>
      <div className="float-child2"><ShipBoard/></div>
    </div>
  );
}

export default Game;
