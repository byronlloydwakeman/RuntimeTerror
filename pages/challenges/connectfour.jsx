import React, { useState } from "react";
import { motion, useAnimation } from "framer-motion";
import styles from "./connectfour.module.scss"; // Importing SCSS module

const COLUMN_COUNT = 7;
const ROW_COUNT = 6;
const CELL_SIZE = 50; // Size of each cell in pixels

const ConnectFour = () => {
    const [board, setBoard] = useState(Array.from({ length: COLUMN_COUNT }, () => new Array(ROW_COUNT).fill(null)));
    const discAnimationControls = useAnimation(); // Animation controls for the disc
  
    const handleColumnClick = async (col) => {
        console.log(board)
        // Find the lowest available row in the clicked column
        const rowIndex = board[col].indexOf(null);
        if (rowIndex !== -1) {
        // Update the board with the disc dropped in the clicked column
        const newBoard = [...board];
        newBoard[col][rowIndex] = "player1"; // For demonstration, you can change "red" to any color you prefer
        setBoard(newBoard);
      }
    };

    return (
      <div className={styles.board}>
        {board.map((column, colIndex) => (
          <div key={colIndex} className={styles.column} onClick={async () => {
                await handleColumnClick(colIndex)
                await discAnimationControls.start({ y: 0, transition: { duration: 1 } });
            }}>
            {column.map((cell, rowIndex) => (
              <div key={rowIndex} className={styles.cell}>
                {cell && (
                  <motion.div
                    className={styles.disc}
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
    );
  };

export default ConnectFour
