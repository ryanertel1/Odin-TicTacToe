const gameOverModal = document.querySelector('.gameOver-modal');
const newGameButton = document.querySelector('.newGame-button');
let playerTurn = true;

const gameBoard = (() => {
    const gameContainer = document.querySelector('.game-container');
    const boardArray = [];

    function cellFactory(row, column, status) {
        return{row, column, status};
    }
    function playerFactory(type, name, marker) {
        return{type, name, marker};
    }

    player1 = playerFactory('human', 'Ryan', 'X');
    player2 = playerFactory('computer', 'AI:Bob', 'O');

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
                updateStatus(event.target, 'player1');
                event.target.innerHTML = player1.marker;
            } else {
                updateStatus(event.target, 'player2');
                event.target.innerHTML = player2.marker;
            }
            playerTurn = !playerTurn;
            checkWin();
        }
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
    for (let i = 0; i < 3; i++) {
        if (board[i][0].status !== null && board[i][1].status === board[i][0].status && board[i][2].status === board[i][0].status) {
            console.log('Win by row');
            gameOverModal.style.animation = 'slideIn 1s forwards';
            gameOverModal.dataset.shown = 'true';
        }
        if (board[0][i].status !== null && board[1][i].status === board[0][i].status && board[2][i].status === board[0][i].status) {
            console.log('Win by column');
            gameOverModal.style.animation = 'slideIn 1s forwards';
            gameOverModal.dataset.shown = 'true';
        }
    }
}

newGameButton.addEventListener('click', () => {
    gameOverModal.style.animation = 'slideOut 1s forwards';
    gameBoard.generate();
    gameOverModal.dataset.shown = 'false';
    playerTurn = true;
});





