const gameOverModal = document.querySelector('.gameOver-modal');
const gameOverText = document.querySelector('.gameOver-text');
const newGameButton = document.querySelector('.newGame-button');
let playerTurn = true;

const player1Name = document.querySelector('.player1-name');
const player1Type = document.querySelector('.player1-type');
const player2Name = document.querySelector('.player2-name');
const player2Type = document.querySelector('.player2-type');
player1Name.value = 'Player';
player2Name.value = 'Bob';

const playerGenerator = (() => {
    function playerFactory(type, name, marker) {
        return{type, name, marker};
    }
    player1 = playerFactory('human', player1Name.value, 'X');
    player2 = playerFactory('CPU', player2Name.value, 'O');
    return{player1, player2};
})();

const gameBoard = (() => {
    const gameContainer = document.querySelector('.game-container');
    const boardArray = [];

    function cellFactory(row, column, status) {
        return{row, column, status};
    }

    function generate() {
        while(gameContainer.lastChild) {
            gameContainer.removeChild(gameContainer.lastChild);
        }
        boardArray.length = 0;
        for (let i=0; i<3; i++) {
            const newRow = document.createElement('div');
            newRow.className = 'row';
            boardArray.push([]);
            for (let j=0; j<3; j++) {
                const cell = cellFactory(i,j,null);
                boardArray[i].push(cell);
                const newCell = document.createElement('div');
                newCell.dataset.index = `${i}${j}`
                newCell.className = 'cell';
                newRow.appendChild(newCell);
            }
            gameContainer.appendChild(newRow);
        }
    }
    return{gameContainer, generate, boardArray};
})();

gameBoard.generate();

const game = (() => {
    gameBoard.gameContainer.addEventListener('click', (event) => {
        if (event.target.className !== 'cell') { //reject touch event if not on cell object
            return;
        }
        if(checkStatus(event.target) === 'empty' && gameOverModal.dataset.shown === 'false') {
            if (playerTurn) {
                updateStatus(event.target, player1.name);
                event.target.innerHTML = player1.marker;
            } else {
                updateStatus(event.target, player2.name);
                event.target.innerHTML = player2.marker;
            }
            playerTurn = !playerTurn;
            checkWin();
        }
        let escapeIter = 0;
        while(!playerTurn && player2.type === 'CPU' && escapeIter < 1000) {
            let randomI = Math.floor(Math.random() * 2);
            let randomJ = Math.floor(Math.random() * 2);
            let clickedCell = document.querySelector(`[data-index= '${randomI}${randomJ}']`);
            if(clickedCell.innerHTML === '' && gameOverModal.dataset.shown === 'false') {
                updateStatus(clickedCell);
                clickedCell.innerHTML = player2.marker;
                playerTurn = !playerTurn;
                checkWin();
            }
            console.log(escapeIter);
            escapeIter++;
        }
        escapeIter = 0;
        event.stopPropagation;
    });
    
    function updateStatus(clickedCell, newStatus) {
        const clickedRow = clickedCell.dataset.index[0];
        const clickedColumn = clickedCell.dataset.index[1];
        
        if (gameBoard.boardArray[clickedRow][clickedColumn].status === null) {
            gameBoard.boardArray[clickedRow][clickedColumn].status = newStatus;
        }
    }
    
    function checkStatus(clickedCell) {
        const clickedRow = clickedCell.dataset.index[0];
        const clickedColumn = clickedCell.dataset.index[1];
    
        if(gameBoard.boardArray[clickedRow][clickedColumn].status === null) {
            return('empty');
        }
    }

    return{playerTurn};
})();

function checkWin() {
    const board = gameBoard.boardArray;

    if (board[0][0].status !== null && board[1][1].status === board[0][0].status && board[2][2].status === board[0][0].status) {
        gameOverModal.style.animation = 'slideIn 1s forwards';
        gameOverModal.dataset.shown = 'true';
        gameOverText.innerHTML = `${board[0][0].status} WINS`;
        return;  
    }
    if (board[2][0].status !== null && board[1][1].status === board[2][0].status && board[0][2].status === board[2][0].status) {
        gameOverModal.style.animation = 'slideIn 1s forwards';
        gameOverModal.dataset.shown = 'true';
        gameOverText.innerHTML = `${board[2][0].status} WINS`;
        return;       
    }
    for (let i = 0; i < 3; i++) {
        if (board[i][0].status !== null && board[i][1].status === board[i][0].status && board[i][2].status === board[i][0].status) {
            gameOverModal.style.animation = 'slideIn 1s forwards';
            gameOverModal.dataset.shown = 'true';
            gameOverText.innerHTML = `${board[i][0].status} WINS`;
            return;
        }
        if (board[0][i].status !== null && board[1][i].status === board[0][i].status && board[2][i].status === board[0][i].status) {
            gameOverModal.style.animation = 'slideIn 1s forwards';
            gameOverModal.dataset.shown = 'true';
            gameOverText.innerHTML = `${board[0][i].status} WINS`;
            return;
        }
    }
    let emptyCell = false;
    outerLoop:
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if(board[i][j].status === null) {
                emptyCell = true;
                break outerLoop;
            }
        }
    }
    if (emptyCell === false) {
        gameOverModal.style.animation = 'slideIn 1s forwards';
        gameOverModal.dataset.shown = 'true';
        gameOverText.innerHTML = 'It\'s a Tie'; 
        return;
    }
}

newGameButton.addEventListener('click', () => {
    gameOverModal.style.animation = 'slideOut 1s forwards';
    gameBoard.generate();
    gameOverModal.dataset.shown = 'false';
    playerTurn = true;
});

player1Name.addEventListener('input', (event) => {
    playerGenerator.player1.name = player2Name.value;
    gameBoard.generate();
    gameOverModal.dataset.shown = 'false';
    playerTurn = true;
});
player2Name.addEventListener('input', (event) => {
    playerGenerator.player2.name = player2Name.value;
    gameBoard.generate();
    gameOverModal.dataset.shown = 'false';
    playerTurn = true;
});
player2Type.addEventListener('input', () => {
    if (player2Type.checked) {
        playerGenerator.player2.type = 'CPU';
    } else {
        playerGenerator.player2.type = 'human';
    }
    gameBoard.generate();
    gameOverModal.dataset.shown = 'false';
    playerTurn = true;
});





