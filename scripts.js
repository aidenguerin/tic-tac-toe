function Gameboard() {
    const rows = 3;
    const columns = 3;
    const board = [];

    for (let i = 0; i < rows; i++) {
        board[i] = [];
        for (let j = 0; j < columns; j++) {
            board[i].push(Cell());
        }
    }

    const getBoard = () => board;

    const placeToken = (row, column, player) => {
        if (!board[row][column].getValue() == 0) {
            throw new Error('Cell is taken');
        };
        board[row][column].addToken(player);
    }

    const printBoard = () => {
        const boardWithCellValues = board.map((row) => row.map((cell) => cell.getValue()));
        console.log(boardWithCellValues);
    }

    return {getBoard, placeToken, printBoard}
}

function Cell() {
    let value = 0;

    const addToken = (player) => {
        value = player;
    }

    const getValue = () => value;

    return {
        addToken,
        getValue
    }
}

function GameController(playerOneName = "Player One", playerTwoName = "Player Two") {
    const board = Gameboard();
    const players = [
        {
            name: playerOneName,
            token: 1
        },
        {
            name:playerTwoName,
            token: 2
        }
    ]

    let activePlayer = players[0];

    const switchPlayerTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0]; 
    };

    const getActivePlayer = () => activePlayer;

    const printNewRound = () => {
        board.printBoard();
        console.log(`${getActivePlayer().name}'s turn.`)
    };

    const checkWin = () => {
        // win function 
    }

    const playRound = (row, column) => {
        console.log(`Adding ${getActivePlayer().name}'s token to cell [${row}, ${column}]`)
        board.placeToken(row, column, getActivePlayer().token);

        checkWin();
        
        switchPlayerTurn();
        printNewRound();
    };

    return {playRound, getActivePlayer, getBoard: board.getBoard};
}