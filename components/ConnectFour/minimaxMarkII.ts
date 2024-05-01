type Board = Array<Array<string | null>>;
interface AdjacentIndices {
    left: number[];
    right: number[];
}

var goesCompleted = 0;

function hasTwoAdjacentDiscs(board: Board): number {
    const bottomRow = board[board.length - 1];
    for (let i = 0; i < bottomRow.length - 1; i++) {
        if (bottomRow[i] === "1" && bottomRow[i + 1] === "1") {
            if (i - 1 >= 0){
                return i - 1
            }
            else if (i + 2 <= 6){
                return i + 2
            }
        }
    }
    return -1;
}

function getRandomEmptyColumn(board: Board): number | null {
    const nonFullColumns: number[] = [];

    for (let column = 0; column < board.length; column++) {
        // Check if column is not full
        if (board[column].includes(null)) {
            nonFullColumns.push(column);
        }
    }

    // If there are non-full columns, return a random index
    if (nonFullColumns.length > 0) {
        const randomIndex = Math.floor(Math.random() * nonFullColumns.length);
        return nonFullColumns[randomIndex];
    } else {
        return null; // No non-full columns
    }
}


function checkForBlock(board: Board): number {
    // Check vertically
    for (let column = 0; column < board.length; column++) {
        for (let row = 0; row <= board[column].length - 4; row++) {
            if (board[column][row] === "1" && board[column][row + 1] === "1" && board[column][row + 2] === "1" && board[column][row + 3] === null) {
                return column; // Next move can block the line
            }
        }
    }

    // Check horizontally
    for (let row = 0; row < board[0].length; row++) {
        for (let column = 0; column <= board.length - 4; column++) {
            if (board[column][row] === "1" && board[column + 1][row] === "1" && board[column + 2][row] === "1" && board[column + 3][row] === null) {
                return column + 3; // Next move can block the line
            }
            if (board[column][row] === null && board[column + 1][row] === "1" && board[column + 2][row] === "1" && board[column + 3][row] === "1") {
                return column; // Next move can block the line
            }
        }
    }

    // Check diagonally (from top-left to bottom-right)
    for (let column = 0; column <= board.length - 4; column++) {
        for (let row = 0; row <= board[column].length - 4; row++) {
            if (board[column][row] === "1" && board[column + 1][row + 1] === "1" && board[column + 2][row + 2] === "1" && board[column + 3][row + 3] === null) {
                if (column === board.length - 4 || (column < board.length - 4 && board[column + 4][row + 3] !== null)) {
                    return row + 3; // Next move can block the line
                }
            }
        }
    }

    // Check diagonally (from top-right to bottom-left)
    for (let column = 0; column <= board.length - 4; column++) {
        for (let row = 3; row < board[column].length; row++) {
            if (board[column][row] === "1" && board[column + 1][row - 1] === "1" && board[column + 2][row - 2] === "1" && board[column + 3][row - 3] === null) {
                if (column === board.length - 4 || (column < board.length - 4 && board[column + 4][row - 3] !== null)) {
                    return row - 3; // Next move can block the line
                }
            }
        }
    }

    return -1; // No line of 3 that can be blocked in the next move
}

function checkForWin(board: Board): number {
    // Check horizontally
    for (let row = 0; row < board.length; row++) {
        for (let column = 0; column <= board[row].length - 4; column++) {
            if (board[row][column] === "2" && board[row][column + 1] === "2" && board[row][column + 2] === "2" && board[row][column + 3] === null) {
                return column + 3; // Next move will win horizontally
            }
            if (board[row][column] === null && board[row][column + 1] === "2" && board[row][column + 2] === "2" && board[row][column + 3] === "2") {
                return column; // Next move will win horizontally
            }
        }
    }

    // Check vertically
    for (let column = 0; column < board[0].length; column++) {
        for (let row = 0; row <= board.length - 4; row++) {
            if (board[row][column] === "2" && board[row + 1][column] === "2" && board[row + 2][column] === "2" && board[row + 3][column] === null) {
                return column; // Next move will win vertically
            }
        }
    }

    // Check diagonally (from top-left to bottom-right)
    for (let row = 0; row <= board.length - 4; row++) {
        for (let column = 0; column <= board[row].length - 4; column++) {
            if (board[row][column] === "2" && board[row + 1][column + 1] === "2" && board[row + 2][column + 2] === "2" && board[row + 3][column + 3] === null) {
                if (row === board.length - 4 || (row < board.length - 4 && board[row + 4][column + 3] !== null)) {
                    return column + 3; // Next move will win diagonally (top-left to bottom-right)
                }
            }
        }
    }

    // Check diagonally (from top-right to bottom-left)
    for (let row = 0; row <= board.length - 4; row++) {
        for (let column = 3; column < board[row].length; column++) {
            if (board[row][column] === "2" && board[row + 1][column - 1] === "2" && board[row + 2][column - 2] === "2" && board[row + 3][column - 3] === null) {
                if (row === board.length - 4 || (row < board.length - 4 && board[row + 4][column - 3] !== null)) {
                    return column - 3; // Next move will win diagonally (top-right to bottom-left)
                }
            }
        }
    }

    return -1; // No winning move found
}

export function getBestColumn(board: Board, userGoesFirst: boolean): number | null {
    // Dominate the middle column
    if (goesCompleted == 0){
        goesCompleted += 1;
        return 3;
    }

    // Must go either side to stop the player
    var adjacentResult = hasTwoAdjacentDiscs(board)
    console.log(adjacentResult)
    if (adjacentResult != -1){
        return adjacentResult;
    }

    var aboutToWin = checkForWin(board);
    if(aboutToWin != -1){
        return aboutToWin;
    }

    var playerAboutToWin = checkForBlock(board);
    if (playerAboutToWin != -1)
    {
        return playerAboutToWin;
    }

    // If theres two in a row
    return getRandomEmptyColumn(board);
}