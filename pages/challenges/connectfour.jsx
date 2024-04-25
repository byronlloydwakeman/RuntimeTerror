import React, { useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import styles from './connectfour.module.scss'; // Importing SCSS module
import { array } from '@google/maps/lib/internal/validate';
import Navbar from '../../components/Navbars/Navbar';
import NavbarBottom from '../../components/Navbars/NavbarBottom';
import { Button } from '@mui/material';

const COLUMN_COUNT = 7;
const ROW_COUNT = 6;
const CELL_SIZE = 50; // Size of each cell in pixels

const ConnectFour = () => {
  const [player1Go, setPlayer1Go] = useState(true);
  const [board, setBoard] = useState(
    Array.from({ length: COLUMN_COUNT }, () => new Array(ROW_COUNT).fill(null))
  );
  const [discColors, setDiscColors] = useState(
    Array.from({ length: COLUMN_COUNT }, () => new Array(ROW_COUNT).fill(null))
  );
  const [player1WinCount, setPlayer1WinCount] = useState(0);
  const [player2WinCount, setPlayer2WinCount] = useState(0);
  const [gameState, setGameState] = useState('Match in progress...');

  const discAnimationControls = useAnimation(); // Animation controls for the disc

  const handleColumnClick = async (col) => {
    // Find the lowest available row in the clicked column
    const rowIndex = board[col].indexOf(null);
    if (rowIndex !== -1) {
      // Update the board with the disc dropped in the clicked column
      const newBoard = [...board];
      newBoard[col][rowIndex] = player1Go ? '1' : '2'; // Set player1 or player2 depending on the turn
      setBoard(newBoard);

      // Update the color of the disc in the corresponding cell
      const newDiscColors = [...discColors];
      newDiscColors[col][rowIndex] = player1Go ? styles.red : styles.green;
      setDiscColors(newDiscColors);

      setPlayer1Go(!player1Go); // Toggle player's turn
    }

    checkWin(board);
  };

  const horizontalWinCheck = (array) => {
    for (let i = 0; i < array.length - 3; i++) {
      for (let j = 0; j < 5; j++)
        if (
          array[i][j] == array[i + 1][j] &&
          array[i][j] == array[i + 2][j] &&
          array[i][j] == array[i + 3][j] &&
          array[i][j]
        ) {
          playerWinLogic(player1Go);
        }
    }
  };

  const verticalWinCheck = (array) => {
    for (let i = 0; i < array.length - 1; i++) {
      for (let j = 0; j < 2; j++)
        if (
          array[i][j] == array[i][j + 1] &&
          array[i][j] == array[i][j + 2] &&
          array[i][j] == array[i][j + 3] &&
          array[i][j]
        ) {
          playerWinLogic(player1Go);
        }
    }
  };

  const diagonalWinCheckAsc = (array) => {
    for (let i = 0; i < array.length - 3; i++) {
      for (let j = 0; j < 2; j++)
        if (
          array[i][j] == array[i + 1][j + 1] &&
          array[i][j] == array[i + 2][j + 2] &&
          array[i][j] == array[i + 3][j + 3] &&
          array[i][j]
        ) {
          playerWinLogic(player1Go);
        }
    }
  };

  const diagonalWinCheckDesc = (array) => {
    for (let i = 0; i < array.length - 3; i++) {
      for (let j = 5; j >= 3; j--)
        if (
          array[i][j] == array[i + 1][j - 1] &&
          array[i][j] == array[i + 2][j - 2] &&
          array[i][j] == array[i + 3][j - 3] &&
          array[i][j]
        ) {
          playerWinLogic(player1Go);
        }
    }
  };

  const playerWinLogic = (player1Go) => {
    if (player1Go) {
      setPlayer1WinCount(player1WinCount + 1);
      setGameState('Player 1 wins!');
    } else {
      setPlayer2WinCount(player2WinCount + 1);
      setGameState('Player 2 wins!');
    }
    setTimeout(() => {
      resetBoard();
    }, 1000);
  };

  const resetBoard = () => {
    setBoard(
      Array.from({ length: COLUMN_COUNT }, () =>
        new Array(ROW_COUNT).fill(null)
      )
    );
    setGameState('Match in progress...');
  };

  const checkWin = (array) => {
    horizontalWinCheck(array);
    verticalWinCheck(array);
    diagonalWinCheckAsc(array);
    diagonalWinCheckDesc(array);
  };

  console.log(board);

  const buttonStyle = {
    Button: {
      color: '#045149',
      border: '1px solid #045149',
      backgroundColor: 'white',
      padding: '5px 10px',
      '&:hover': {
        backgroundColor: '#045149 !important',
        boxShadow: 'none !important',
        borderColor: 'white',
        color: 'white',
      },
    },
  };

  return (
    <div>
      <div>
        <Navbar />
        <div className={styles.mainContainer}>
          <div className={styles.board}>
            {board.map((column, colIndex) => (
              <div
                key={colIndex}
                className={styles.column}
                onClick={async () => {
                  await handleColumnClick(colIndex);
                  await discAnimationControls.start({
                    y: 0,
                    transition: { duration: 1 },
                  });
                }}
              >
                {column.map((cell, rowIndex) => (
                  <div key={rowIndex} className={styles.cell}>
                    {cell && (
                      <motion.div
                        className={`${styles.disc} ${discColors[colIndex][rowIndex]}`} // Use discColors to determine the color class
                        initial={{ y: -CELL_SIZE * ROW_COUNT }} // Start disc above the board
                        animate={discAnimationControls} // Use animation controls
                        onAnimationComplete={() => {}}
                      />
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
          <div className={styles.gameInformation}>
            <p>{gameState}</p>
            <p>Player 1: {player1WinCount}</p>
            <p>Player 2: {player2WinCount}</p>
            <Button size="small" sx={buttonStyle.Button} onClick={resetBoard}>
              Reset Board
            </Button>
          </div>
        </div>
      </div>
      <NavbarBottom />
    </div>
  );
};

export default ConnectFour;
