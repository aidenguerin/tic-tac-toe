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

    const getCellToken = (row, column) => {
        return board[row][column].getValue();
    }

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

    return {getBoard, placeToken, printBoard, getCellToken}
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

    const getPlayers = () => players;
    const getActivePlayer = () => activePlayer;
    
    let activePlayer = players[0]; // set inital player turn as player 1
    let winningCoordinates = [];

    const isWinningCell = (row, column) => {
        return winningCoordinates.some(coordinate => coordinate[0] === row && coordinate[1] === column);
    }  

    const switchPlayerTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0]; 
    };

    const printNewRound = () => {
        board.printBoard();
        console.log(`${getActivePlayer().name}'s turn.`)
    };

    const checkThreeInARow = () => {
        // Check rows
        for (let i = 0; i < 3; i++) {
            if (board.getCellToken(i, 0) === board.getCellToken(i, 1) &&
                board.getCellToken(i, 1) === board.getCellToken(i, 2) &&
                board.getCellToken(i, 0) !== 0) {
                return [[i, 0], [i, 1], [i, 2]];
            }
        }
    
        // Check columns
        for (let j = 0; j < 3; j++) {
            if (board.getCellToken(0, j) === board.getCellToken(1, j) &&
                board.getCellToken(1, j) === board.getCellToken(2, j) &&
                board.getCellToken(0, j) !== 0) {
                return [[0, j], [1, j], [2, j]];
            }
        }
    
        // Check diagonals
        if (board.getCellToken(0, 0) === board.getCellToken(1, 1) &&
            board.getCellToken(1, 1) === board.getCellToken(2, 2) &&
            board.getCellToken(0, 0) !== 0) {
            return [[0, 0], [1, 1], [2, 2]];
        }
    
        if (board.getCellToken(0, 2) === board.getCellToken(1, 1) &&
            board.getCellToken(1, 1) === board.getCellToken(2, 0) &&
            board.getCellToken(0, 2) !== 0) {
            return [[0, 2], [1, 1], [2, 0]];
        }
    
        // No winner
        return [];
    } 
    
    const playRound = (row, column) => {
        console.log(`Adding ${getActivePlayer().name}'s token to cell [${row}, ${column}]`)
        board.placeToken(row, column, getActivePlayer().token);

        winningCoordinates = checkThreeInARow();
        if (winningCoordinates.length > 0) {
            console.log(`winning coordinates : ${winningCoordinates}`)
        }
        
        switchPlayerTurn();
        printNewRound();
    };

    return {playRound, getActivePlayer, getBoard: board.getBoard, getPlayers, isWinningCell};
}

function DisplayController() {
    const game = GameController();
    const gameboardDiv = document.querySelector(".gameboard")
    const scoresDiv = document.querySelector(".scores")

    const updateDisplay = () => {
        clearDisplay();

        const board = game.getBoard();
        const players = game.getPlayers();
        const activePlayer = game.getActivePlayer();

        // render scoreboard
        players.forEach(player => {
           const playerScoreDiv = document.createElement("div");
           playerScoreDiv.innerText = `${player.name}`;

           if (player === activePlayer) {
            playerScoreDiv.classList.add("active-player");
           }

           scoresDiv.appendChild(playerScoreDiv)
        });

        // render cells 
        board.forEach((row, i) => {
            row.forEach((cell, j) => {
                const cellDiv = document.createElement("div");
                cellDiv.classList.add("cell");

                cellDiv.dataset.row =  i;
                cellDiv.dataset.column = j;

                if (game.isWinningCell(i,j)) {
                    cellDiv.classList.add("win")
                }

                switch (cell.getValue()) {
                    case 0: break;
                    case 1: cellDiv.innerText = "x"; break;
                    case 2: cellDiv.innerText = "o"; break;
                    default: break;
                }

                gameboardDiv.appendChild(cellDiv);
            });
        });
    }  

    function clickHandler(e) {
        const cellDiv = e.target;
        if (!cellDiv) { // check if clicked on cell, not gap
            return
        }

        const row = cellDiv.dataset.row; 
        const column = cellDiv.dataset.column;

        game.playRound(row, column);
        updateDisplay();
    } 

    const clearDisplay = () => {
        gameboardDiv.innerHTML = "";
        scoresDiv.innerHTML = "";
    }

    gameboardDiv.addEventListener('click', (e) => clickHandler(e))

    updateDisplay(); // initial render
}

const displayController = DisplayController();
