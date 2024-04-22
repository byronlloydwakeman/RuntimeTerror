import React, { useState } from "react";
import { motion, useAnimation } from "framer-motion";
import styles from "./connectfour.module.scss"; // Importing SCSS module

const COLUMN_COUNT = 7;
const ROW_COUNT = 6;
const CELL_SIZE = 50; // Size of each cell in pixels

const ConnectFour = () => {
    const [player1Go, setPlayer1Go] = useState(true);
    const [board, setBoard] = useState(Array.from({ length: COLUMN_COUNT }, () => new Array(ROW_COUNT).fill(null)));
    const [discColors, setDiscColors] = useState(Array.from({ length: COLUMN_COUNT }, () => new Array(ROW_COUNT).fill(null)));
    const discAnimationControls = useAnimation(); // Animation controls for the disc
  
    const handleColumnClick = async (col) => {
        // Find the lowest available row in the clicked column
        const rowIndex = board[col].indexOf(null);
        if (rowIndex !== -1) {
            // Update the board with the disc dropped in the clicked column
            const newBoard = [...board];
            newBoard[col][rowIndex] = player1Go ? "player1" : "player2"; // Set player1 or player2 depending on the turn
            setBoard(newBoard);

            // Update the color of the disc in the corresponding cell
            const newDiscColors = [...discColors];
            newDiscColors[col][rowIndex] = player1Go ? styles.red : styles.green;
            setDiscColors(newDiscColors);

            setPlayer1Go(!player1Go); // Toggle player's turn

        }
    };
  
    return (
        <div className={styles.board}>
            {board.map((column, colIndex) => (
                <div key={colIndex} className={styles.column} onClick={async () => {
                        await handleColumnClick(colIndex);
                        await discAnimationControls.start({ y: 0, transition: { duration: 1 } });
                    }}>
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
    );
};

export default ConnectFour;
