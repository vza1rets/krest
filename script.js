document.addEventListener('DOMContentLoaded', () => {
    const board = document.getElementById('board');
    const cells = document.querySelectorAll('.cell');
    const status = document.getElementById('status');
    const restartBtn = document.getElementById('restartBtn');
    
    let gameState = ['', '', '', '', '', '', '', '', ''];
    let currentPlayer = 'X';
    let gameActive = true;
    
    const winningConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // горизонтали
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // вертикали
        [0, 4, 8], [2, 4, 6]             // диагонали
    ];
    
    // Обработчик клика по клетке
    function handleCellClick(e) {
        const clickedCell = e.target;
        const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));
        
        // Если клетка уже занята или игра неактивна, ничего не делаем
        if (gameState[clickedCellIndex] !== '' || !gameActive) {
            return;
        }
        
        // Ход игрока
        makeMove(clickedCell, clickedCellIndex, currentPlayer);
        
        // Проверка на победу игрока
        if (checkWin()) {
            status.textContent = `Вы победили!`;
            gameActive = false;
            return;
        }
        
        // Проверка на ничью
        if (checkDraw()) {
            status.textContent = `Ничья!`;
            gameActive = false;
            return;
        }
        
        // Смена игрока
        currentPlayer = 'O';
        status.textContent = `Ход компьютера (O)`;
        
        // Ход компьютера с небольшой задержкой для лучшего UX
        setTimeout(computerMove, 500);
    }
    
    // Ход игрока или компьютера
    function makeMove(cell, index, player) {
        gameState[index] = player;
        cell.textContent = player;
        cell.classList.add(player.toLowerCase());
    }
    
    // Ход компьютера
    function computerMove() {
        if (!gameActive) return;
        
        // Сначала проверяем, может ли компьютер выиграть
        let move = findWinningMove('O');
        
        // Если нет, проверяем, может ли игрок выиграть следующим ходом (блокировка)
        if (move === -1) {
            move = findWinningMove('X');
        }
        
        // Если нет выигрышных или блокирующих ходов, выбираем случайную клетку
        if (move === -1) {
            const emptyCells = gameState.map((cell, index) => cell === '' ? index : null).filter(val => val !== null);
            if (emptyCells.length > 0) {
                move = emptyCells[Math.floor(Math.random() * emptyCells.length)];
            }
        }
        
        if (move !== -1) {
            makeMove(cells[move], move, 'O');
            
            // Проверка на победу компьютера
            if (checkWin()) {
                status.textContent = `Компьютер победил!`;
                gameActive = false;
                return;
            }
            
            // Проверка на ничью
            if (checkDraw()) {
                status.textContent = `Ничья!`;
                gameActive = false;
                return;
            }
            
            // Смена игрока
            currentPlayer = 'X';
            status.textContent = `Ваш ход (X)`;
        }
    }
    
    // Поиск выигрышного хода для указанного игрока
    function findWinningMove(player) {
        for (let i = 0; i < winningConditions.length; i++) {
            const [a, b, c] = winningConditions[i];
            const cellsInLine = [gameState[a], gameState[b], gameState[c]];
            
            // Если в линии уже есть две клетки игрока и одна пустая
            if (cellsInLine.filter(cell => cell === player).length === 2) {
                const emptyIndex = winningConditions[i][cellsInLine.indexOf('')];
                if (gameState[emptyIndex] === '') {
                    return emptyIndex;
                }
            }
        }
        return -1;
    }
    
    // Проверка на победу
    function checkWin() {
        for (let i = 0; i < winningConditions.length; i++) {
            const [a, b, c] = winningConditions[i];
            if (gameState[a] && gameState[a] === gameState[b] && gameState[a] === gameState[c]) {
                return true;
            }
        }
        return false;
    }
    
    // Проверка на ничью
    function checkDraw() {
        return !gameState.includes('');
    }
    
    // Перезапуск игры
    function restartGame() {
        gameState = ['', '', '', '', '', '', '', '', ''];
        currentPlayer = 'X';
        gameActive = true;
        status.textContent = `Ваш ход (X)`;
        
        cells.forEach(cell => {
            cell.textContent = '';
            cell.classList.remove('x', 'o');
        });
    }
    
    // Добавляем обработчики событий
    cells.forEach(cell => cell.addEventListener('click', handleCellClick));
    restartBtn.addEventListener('click', restartGame);
});