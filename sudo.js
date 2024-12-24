// Function to check if a number can be placed in a specific cell
function isValidPlacement(board, row, col, num) {
    // Check row
    for (let c = 0; c < 9; c++) {
        if (board[row][c] === num) return false;
    }

    // Check column
    for (let r = 0; r < 9; r++) {
        if (board[r][col] === num) return false;
    }

    // Check 3x3 subgrid
    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(col / 3) * 3;
    for (let r = startRow; r < startRow + 3; r++) {
        for (let c = startCol; c < startCol + 3; c++) {
            if (board[r][c] === num) return false;
        }
    }

    return true;
}

// Function to find the next empty cell (denoted by 0)
function findEmptyCell(board) {
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            if (board[row][col] === 0) {
                return { row, col };
            }
        }
    }
    return null; // No empty cell found
}

// Function to solve the Sudoku puzzle using backtracking
function solveSudoku(board) {
    const emptyCell = findEmptyCell(board);

    // No empty cell means the puzzle is solved
    if (!emptyCell) {
        return true;
    }

    const { row, col } = emptyCell;

    // Try numbers from 1 to 9
    for (let num = 1; num <= 9; num++) {
        if (isValidPlacement(board, row, col, num)) {
            board[row][col] = num;

            // Recurse to solve the rest of the puzzle
            if (solveSudoku(board)) {
                return true;
            }

            // Backtrack if placing num didn't lead to a solution
            board[row][col] = 0;
        }
    }

    return false; // Trigger backtracking
}

// Function to print the board
function printBoard(board) {
    for (let row = 0; row < 9; row++) {
        let rowString = '';
        for (let col = 0; col < 9; col++) {
            rowString += board[row][col] + ' ';
        }
        console.log(rowString);
    }
}

// Function to get user input for Sudoku board
function getUserInput() {
    const board = [];
    const readline = require('readline');

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    let rowIndex = 0;

    console.log("Please enter the Sudoku puzzle row by row, with numbers separated by spaces.");

    // Function to ask user for the next row input
    function askForRow() {
        if (rowIndex < 9) {
            rl.question(`Enter row ${rowIndex + 1} (9 numbers separated by spaces): `, (input) => {
                const row = input.split(' ').map(num => parseInt(num));

                // Debugging log for input
                console.log(`Row ${rowIndex + 1}:`, row);

                if (row.length === 9 && row.every(num => !isNaN(num))) {
                    board.push(row);
                    rowIndex++;
                    askForRow(); // Recursively ask for the next row
                } else {
                    console.log('Invalid input. Please enter exactly 9 numbers separated by spaces.');
                    askForRow(); // Re-ask the same row if invalid input
                }
            });
        } else {
            rl.close(); // Close the interface after 9 rows are collected
        }
    }

    askForRow(); // Start the input loop

    rl.on('close', () => {
        console.log("All rows collected.");
        if (solveSudoku(board)) {
            console.log("Solved Sudoku:");
            printBoard(board);
        } else {
            console.log("No solution exists.");
        }
    });
}

// Start the user input process
getUserInput();
