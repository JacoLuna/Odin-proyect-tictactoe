const game = Game();

function Gameboard(){
    //rows and columns are equal, so i can just do a line const
    const lines = 3;
    const board = [];
    for (let i = 0; i < lines; i++) {
        board[i] = [];
        for (let j = 0; j < lines; j++) {
            board[i].push(0);
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

    const checkStatus = (player) => {
        let lines = 3;
        let winningValue = player.getPlayerNumber() * lines;
        let boardGame = getBoard(); 
        // let winner = 0;

        // checkStatusByRow(arrayTest, player);
        // checkStatusByColumn(arrayTest, player);
        // checkStatusByDiagonal(arrayTest, player);
        // checkStatusByReversedDiagonal(arrayTest, player);

        return pipe(checkStatusByRow,
             checkStatusByColumn,
             checkStatusByDiagonal,
             checkStatusByReversedDiagonal)({boardGame, winningValue});
    }
    return {setSquare, getBoard, checkStatus};
}

function Game(){
    const players = [CreatePlayer(1, "juan"), CreatePlayer(2, "tomas")];
    let playerIndex = Math.floor(Math.random() * 2) + 1; // random number beetween 1 and 2
    const gameboard = Gameboard();
    
    const startGame = () => {
        let finish = false;
        let player = players[playerIndex-1];
        let winner = 0; //0 draw

        //one play
        playerIndex = 1;
        player = players[playerIndex-1];
        gameboard.setSquare(0,0,playerIndex, true);
        gameboard.setSquare(0,1,playerIndex, true);

        console.log(`player ${playerIndex} turn`);

        playDone = player.play(gameboard, true);

        if(!playDone){
            finish = true;
        }

        winner = gameboard.checkStatus(player);
        /*
        do{
            //sim game
            playerIndex = playerIndex == 1?2:1;
            player = players[playerIndex-1];

            console.log(`player ${playerIndex} turn`);

            playDone = player.play(gameboard);

            if(!playDone){
                finish = true;
            }

            winner = gameboard.checkStatus(player);

            if(winner != 0){
                console.log(`${player.getName()} won!!!`);
                finish = true;
            }
            console.log(gameboard.getBoard());
        }while(!finish);
        */
        
    }

    return {gameboard, startGame};
}

function CreatePlayer (playerNumber, name) {
    let score = 0;
    const getName = () => name;
    const getPlayerNumber = () => playerNumber;
    const getScore = () => score;
    const addScore = () => score++;

    const play = (board, showPlay = false) => {
        let squareFound = false;
        board.getBoard().
            forEach( (array, row) => {
                array.forEach( (value, column) => {
                    //marca el primer valor disponible que hay
                    if(!squareFound && value == 0){
                        board.setSquare(row,column,playerNumber, showPlay);
                        squareFound = true;
                    }
                })
            });
        return squareFound;
    }

    return { getName, getPlayerNumber, getScore, addScore, play};
}

function checkStatusByRow(board, winningValue){
    return board
        .map( arrayRow => arrayRow.reduce( (acc, currentVal) => acc + currentVal))
            .some( acc => acc == winningValue);
}
function checkStatusByColumn(board, plawinningValueyer){
    board = transposeMatrix(board);
    checkStatusByRow(board, winningValue);
}
function checkStatusByDiagonal(board, winningValue){
    let acum = 0;
    board.forEach( (arrayRow, row) => {
        acum += arrayRow.filter( (value, column) => column == row )[0];
    })
    return acum == winningValue
}
function checkStatusByReversedDiagonal(board, winningValue){
    let acum = 0;
    board.forEach( (arrayRow, row) => {
        acum += arrayRow.find( (val, column) => row + column == 2)
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

    // game.startGame();
    let player = 1;
    const arrayTest = [
        [1, 1, 1],
        [0, 1, 0],
        [0, 0, 1]
    ]

    checkStatusByRow(arrayTest, player);
    checkStatusByColumn(arrayTest, player);
    checkStatusByDiagonal(arrayTest, player);
    checkStatusByReversedDiagonal(arrayTest, player);


    //reversed diagonal
    //2 - 4 - 6
            
    //check if there is any posible plays
    //there is
    //  1º player plays something rnd
    //  mark selected squares
    //  get posible squares
    //there isn't 
    // check if anyone won
    // someone did
    //      add schore to that player
    // no one did
    //      its a draw
    // restart game
})