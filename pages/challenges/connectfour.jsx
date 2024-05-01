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
  const [gameState, setGameState] = useState('Red to start...');
  const [cpuEnabled, setCpuEnabled] = useState(false);

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
      player1Go ? setGameState('Green turn...') : setGameState('Red turn...');
    }

    checkWin(board);

    if (cpuEnabled && !player1Go) {
      setTimeout(() => {
        const randomColIndex = Math.floor(Math.random() * 6);
        handleColumnClick(randomColIndex);
      }, 1000);
    }
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
      setGameState('Red wins!');
    } else {
      setPlayer2WinCount(player2WinCount + 1);
      setGameState('Green wins!');
    }
    setTimeout(() => {
      resetBoard();
    }, 1500);
  };

  const resetBoard = () => {
    setBoard(
      Array.from({ length: COLUMN_COUNT }, () =>
        new Array(ROW_COUNT).fill(null)
      )
    );
    if (player1Go) {
      setGameState('Red to start...');
    } else {
      setGameState('Green to start...');
    }
  };

  const checkWin = (array) => {
    horizontalWinCheck(array);
    verticalWinCheck(array);
    diagonalWinCheckAsc(array);
    diagonalWinCheckDesc(array);
  };

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

  const handleCpu = () => {
    setCpuEnabled(!cpuEnabled);
  };

  const switchTurns = () => {
    setPlayer1Go(!player1Go);
    if (player1Go) {
      setGameState('Green to start...');
    } else {
      setGameState('Red to start...');
    }
  };

  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  console.log(board);

  return (
    <div>
      <div>
        <Navbar />
        <div className={styles.main_container}>
          <div className={styles.test_board}></div>
          <div className={styles.board}>
            {board.map((column, colIndex) => (
              <div
                key={colIndex}
                className={styles.column}
                onClick={async () => {
                  await handleColumnClick(colIndex);
                  await discAnimationControls.start({
                    y: 0,
                    transition: {
                      duration: 0.5,
                      ease: [0.39, 0.575, 0.565, 1],
                    },
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
          <div className={styles.game_information}>
            <h1 className={styles.game_state}>{gameState}</h1>
            <h1 className={styles.player_state}>Red: {player1WinCount}</h1>
            <h1 className={styles.player_state}>Green: {player2WinCount}</h1>
            <div className={styles.button_group}>
              <Button size="small" sx={buttonStyle.Button} onClick={resetBoard}>
                Reset Board
              </Button>
              {!cpuEnabled ? (
                <Button
                  size="small"
                  sx={buttonStyle.Button}
                  onClick={handleCpu}
                >
                  Enable CPU
                </Button>
              ) : (
                <Button
                  size="small"
                  sx={buttonStyle.Button}
                  onClick={handleCpu}
                >
                  Disable CPU
                </Button>
              )}
              {gameState == 'Red to start...' ||
              gameState == 'Green to start...' ? (
                <Button
                  size="small"
                  sx={buttonStyle.Button}
                  onClick={switchTurns}
                >
                  Switch Turns
                </Button>
              ) : (
                <Button
                  size="small"
                  sx={buttonStyle.Button}
                  onClick={switchTurns}
                  disabled
                >
                  Switch Turns
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
      <NavbarBottom />
    </div>
  );
};

export default ConnectFour;
