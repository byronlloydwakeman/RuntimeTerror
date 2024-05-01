const AI = "2";
const USER = "1";

function checkWinner(board: string[][], player: string): boolean {
    // Check horizontal
    for (let row of board) {
        for (let i = 0; i < row.length - 3; i++) {
            if (row[i] === player && row[i+1] === player && row[i+2] === player && row[i+3] === player) {
                return true;
            }
        }
    }
    // Check vertical
    for (let col = 0; col < board[0].length; col++) {
        for (let row = 0; row < board.length - 3; row++) {
            if (board[row][col] === player && board[row+1][col] === player && board[row+2][col] === player && board[row+3][col] === player) {
                return true;
            }
        }
    }
    // Check diagonal (top-left to bottom-right)
    for (let row = 0; row < board.length - 3; row++) {
        for (let col = 0; col < board[0].length - 3; col++) {
            if (board[row][col] === player && board[row+1][col+1] === player && board[row+2][col+2] === player && board[row+3][col+3] === player) {
                return true;
            }
        }
    }
    // Check diagonal (bottom-left to top-right)
    for (let row = 3; row < board.length; row++) {
        for (let col = 0; col < board[0].length - 3; col++) {
            if (board[row][col] === player && board[row-1][col+1] === player && board[row-2][col+2] === player && board[row-3][col+3] === player) {
                return true;
            }
        }
    }
    return false;
}

function evaluate(board: string[][]): number {
    if (checkWinner(board, AI)) {
        return 100;
    } else if (checkWinner(board, USER)) {
        return -100;
    } else {
        return 0;
    }
}

function minimax(board: string[][], depth: number, maximizingPlayer: boolean): number {
    if (depth === 0 || checkWinner(board, AI) || checkWinner(board, USER)) {
        return evaluate(board);
    }
    if (maximizingPlayer) {
        let maxEval = -Infinity;
        for (let col = 0; col < board[0].length; col++) {
            if (board[0][col] === null) {
                const newBoard = board.map(row => row.slice());
                for (let row = board.length - 1; row >= 0; row--) {
                    if (newBoard[row][col] === null) {
                        newBoard[row][col] = AI;
                        break;
                    }
                }
                const evaluate = minimax(newBoard, depth - 1, false);
                maxEval = Math.max(maxEval, evaluate);
            }
        }
        return maxEval;
    } else {
        let minEval = Infinity;
        for (let col = 0; col < board[0].length; col++) {
            if (board[0][col] === null) {
                const newBoard = board.map(row => row.slice());
                for (let row = board.length - 1; row >= 0; row--) {
                    if (newBoard[row][col] === null) {
                        newBoard[row][col] = USER;
                        break;
                    }
                }
                const evaluate = minimax(newBoard, depth - 1, true);
                minEval = Math.min(minEval, evaluate);
            }
        }
        return minEval;
    }
}

export function findBestMove(board: string[][], depth: number): number {
    console.log(board);
    let bestMove = -1;
    let bestEval = -Infinity;
    for (let col = 0; col < board[0].length; col++) {
        if (board[0][col] === null) {
            const newBoard = board.map(row => row.slice());
            for (let row = board.length - 1; row >= 0; row--) {
                if (newBoard[row][col] === null) {
                    newBoard[row][col] = AI;
                    break;
                }
            }
            const evaluation = minimax(newBoard, depth - 1, false);
            if (evaluation > bestEval) {
                bestEval = evaluation;
                bestMove = col;
            }
        }
    }
    return bestMove;
}



