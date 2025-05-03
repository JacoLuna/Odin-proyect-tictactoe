const game = Game();
let playerTurn;
function Gameboard(){
    //rows and columns are equal, so i can just do a line const
    const lines = 3;
    const board = [];

    const initBoard = () =>{
        let table = document.getElementById("table-container").children.item('table');
        table.children.item('tbody').innerHTML = "";
        for (let i = 0; i < lines; i++) {
            board[i] = [];
            table.children.item('tbody').innerHTML += printRow(i);
            for (let j = 0; j < lines; j++) {
                board[i].push(0);
            }
        }
    }

    const setSquare = (x, y, player, showPlay = false) => {
        board[x][y] = player
        if(showPlay)
            console.log(getBoard());
    }

    const getBoard = () => {
        let gameBoard = board.map((row) => row.map( (square) => square));
        return gameBoard;
    };

    const checkStatus = (playerNumber) => {
        let lines = 3;
        let winningValue = playerNumber * lines;
        let boardGame = getBoard(); 
        let winner = 0;
        
        if(
        checkStatusByRow(boardGame, playerNumber, winningValue) || 
        checkStatusByColumn(boardGame, playerNumber, winningValue) || 
        checkStatusByDiagonal(boardGame, playerNumber, winningValue) || 
        checkStatusByReversedDiagonal(boardGame, playerNumber, winningValue)){
            winner =  playerNumber;
        }
        return winner;
    }
    return {setSquare, getBoard, checkStatus, initBoard};
}

function Game(){
    const players = [CreatePlayer(1, "jugador 1"), CreatePlayer(2, "jugador 2")];
    const gameboard = Gameboard();
    let started = false;
    let finish;
    let player;
    let winner; //0 draw
    
    const startGame = () => {
        finish = false;
        playerTurn = Math.floor(Math.random() * 2) + 1;
        player = players[playerTurn-1];
        winner = 0; //0 draw
        gameboard.initBoard();

        document.getElementById("turno").innerHTML = "Le toca a " + playerTurn;
        
        Array.from(document.getElementsByClassName("square")).forEach( (e) =>{
            e.disabled = false;
        })
        
        return playerTurn;
    }
    const setFinish = (status) => {
        finish = status;
    }
    const getGameData = () => {
        return {players, playerTurn, finish}
    }

    return {gameboard, startGame, getGameData, setFinish};
}

function CreatePlayer (playerNumber, name) {
    let score = 0;
    const getName = () => name;
    const getPlayerNumber = () => playerNumber;
    const getScore = () => score;
    const addScore = () => score++;

    const play = (board, row, column, showPlay = false) => {
        board.setSquare(row,column, getPlayerNumber(), showPlay);
        if( board.checkStatus(getPlayerNumber()) ){
            game.setFinish(true);

            document.getElementById("turno").innerHTML = "ganó el jugador " +  getPlayerNumber();
            
            Array.from(document.getElementsByClassName("square")).forEach( (e) =>{
                e.disabled = true;
            });

        }
        
        return getPlayerNumber() == 1?2:1;
    }

    return { getName, getPlayerNumber, getScore, addScore, play};
}
function checkStatusByRow(board, player, winningValue){
    let flattenBoard = board.flat();
    let breakPoint = [0,2,5];
    let winner = false;
    for(let i = 0; i < breakPoint.length ; i++){
        let startingPoint = breakPoint[i];
        let acc = 0;
        for(let j = startingPoint; j <= startingPoint + 3 ; j++){
            if(flattenBoard[j] == player){
                acc += flattenBoard[j];
            }
        }
        if(acc == winningValue){
            winner = true;
            break
        }
    
    }
    return winner;
}
function checkStatusByColumn(board, player, winningValue){
    board = transposeMatrix(board);
    return checkStatusByRow(board, player, winningValue);
}
function checkStatusByDiagonal(board, player, winningValue){
    let acum = 0;
    board.forEach( (arrayRow, row) => {
        acum += arrayRow.filter( (val, column) => (val == player && column == row) )[0];
    })
    return acum == winningValue
}
function checkStatusByReversedDiagonal(board, player, winningValue){
    let acum = 0;
    board.forEach( (arrayRow, row) => {
        acum += parseInt(arrayRow.filter( (val, column) => (val == player && row + column == 2)));
    })
    return acum == winningValue
}
function transposeMatrix(matrix){

    let transposeMatrix = [
        [0,0,0],
        [0,0,0],
        [0,0,0]
    ]

    matrix.forEach( (arrayRow, row) => arrayRow.forEach( (value, column) => transposeMatrix[column][row] = value))
    return transposeMatrix;
}

window.addEventListener('load', () => {
    game.startGame();
})

function squareClicked(btn, player){
    let row = btn.getAttribute('data-row');
    let column = btn.getAttribute('data-column');
    
    playerTurn = game.getGameData().players[player-1].play(game.gameboard, row, column);
console.log(game.getGameData());
    if(!game.getGameData().finish){
        document.getElementById("turno").innerHTML = "Le toca a " + playerTurn;
    }

    btn.innerHTML = player == 1?'X':'O';
}
function printRow(row){
    let board = "<tr>";
    for(let i = 0 ; i < 3 ; i++){
        board += printData(row, i);
    }
    return board;
}
function printData(row, column){
    return `<td><button class="square" data-row = "${row}" data-column = "${column}" onclick="squareClicked(this, playerTurn)"><p></p></button></td>`;
}

function restartGame(){
   game.startGame(); 
}