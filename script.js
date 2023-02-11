const gameBoard = (() => {
    const gameContainer = document.querySelector('.game-container');
    const boardArray = [];

    function cellFactory(row, column, status) {
        return{row, column, status};
    }

    function generate() {
        for (let i=0; i<3; i++) {
            const newRow = document.createElement('div');
            newRow.className = 'row';
            boardArray.push([]);
            for (let j=0; j<3; j++) {
                const cell = cellFactory(i,j,'');
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
    let playerTurn = true;

    gameBoard.gameContainer.addEventListener('click', (event) => {
        if(checkStatus(event.target) === 'empty') {
            if (playerTurn) {
                updateStatus(event.target, 'player');
                event.target.classList.add('playerSelect');
                playerTurn = !playerTurn;
            } else {
                updateStatus(event.target, 'computer');
                event.target.classList.add('computerSelect');
                playerTurn = !playerTurn;
            }
        }
    });
    
    function updateStatus(clickedCell, newStatus) {
        const clickedRow = clickedCell.dataset.index[0];
        const clickedColumn = clickedCell.dataset.index[1];
        
        if (gameBoard.boardArray[clickedRow][clickedColumn].status === '') {
            gameBoard.boardArray[clickedRow][clickedColumn].status = newStatus;
        }
    }
    
    function checkStatus(clickedCell) {
        const clickedRow = clickedCell.dataset.index[0];
        const clickedColumn = clickedCell.dataset.index[1];
    
        if(gameBoard.boardArray[clickedRow][clickedColumn].status === '') {
            return('empty');
        }
    }
})();





