export default function generateBoard() {
    const rows = 10
    const cols = 10
    const boardArray = []

    for (let i = 0; i < rows; i++) {
      boardArray[i] = []
      for (let j = 0; j < cols; j++) {
        boardArray[i][j] = {
          id: `${String.fromCharCode(65 + i)}${j}`,
          isShotAt: false,
          isOccupied: null,
          isHit: false
        }
      }
    }

    return boardArray
  }
