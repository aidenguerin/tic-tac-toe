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

    const resetBoard = () => {
        board = [];
    }

    return {getBoard, placeToken, printBoard, resetBoard}
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

    const getPlayers = () => players;
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

    return {playRound, getActivePlayer, getBoard: board.getBoard, getPlayers};
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
        if (!cellDiv) { // did not click on cell
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

    // add click handler to buttons
    gameboardDiv.addEventListener('click', (e) => clickHandler(e))

    // initial render
    updateDisplay();
}

const displayController = DisplayController();
