// @ts-check"
"use strict";
let debug = false
let gameManager = null

class GameManager {

    constructor(is_white, socket) {
        this.chess = new Chess()  // Chess.js library providing valid moves and piece positions
        this.is_white = is_white
        this.socket = socket
        this.board = new Board(document.getElementById("board"), is_white, this)
        this.board.setupPieces(this.chess.board())
        this.audio = new AudioManager()
        this.clock = new Clock(document.getElementsByClassName("chessboard-header")[0], 0.5, 0.5, this)
        this.currentPiece = null
        this.legalMovesCurrentPiece = []
        this.sidepanel = new Sidepanel(document.getElementsByClassName("controlpanel-content")[0])

        this.overlay = document.getElementsByClassName("overlay")[0]
        this.overlay.classList.toggle("hidden", true)

        document.getElementById("main").classList.toggle("is_white", is_white)

        gameManager = this
    }

    pressedSquare(square) {
        //return if the square does not contian a piece of the same color as this player
        if(((square.piece == null || (square.piece.color == 'b') == this.is_white)) && !debug)
            return

        this.legalMovesCurrentPiece = this.chess.moves({ square: square.id })
        // console.log(square.id)
        // console.log(this.legalMovesCurrentPiece)
        this.legalMovesCurrentPiece.forEach(move => {
            let { x, y } = this.board.id2squareData(move, this.chess.turn() == 'w')
            if (x == null || y == null || x < 0 || x > 7 || y < 0 || y > 7) {
                console.error("Can't generate position for move " + move)
            } else {
                this.board.squares[y][x].toggleHighlight(true)
            }
        });

        this.currentPiece = square.piece
        if(this.currentPiece)
            this.currentPiece.initiateAnimation()
    }

    /**
     * Function that is triggered when the mouse leaves the board,
     * preventing pieces to be placed outside the board
     */
    mouseLeftBoard() {
        if(!this.currentPiece)
            return
        
        this.currentPiece.stopAnimation()

        this.legalMovesCurrentPiece.forEach(move => {
            let { x, y } = this.board.id2squareData(move, this.chess.turn() == 'w')
            if (x == null || y == null) {
                console.error("Can't generate position for move " + move)
            } else {
                this.board.squares[y][x].toggleHighlight(false)
            }
        });

        this.currentPiece = null
    }

    releasedSquare(square) {

        if(!this.currentPiece)
            return
        
        this.currentPiece.stopAnimation()
      
        let moveMade = null
        this.legalMovesCurrentPiece.forEach(move => {
            let { x, y } = this.board.id2squareData(move, this.chess.turn() == 'w')
            if (x == null || y == null) {
                console.error("Can't generate position for move " + move)
            } else {
                this.board.squares[y][x].toggleHighlight(false)
                if (this.board.squares[y][x] == square)
                    moveMade = move
            }
        });

        if (moveMade == null){
            console.log("Invalid move :(")
            return
        }

        let square_from = this.currentPiece.onSquare.id
        let square_to = square.id
        let move_string = moveMade

        // move the piece on this board
        this.movePiece(square_from, square_to, move_string)

        //start the timer for the opponent
        this.clock.startTimer(2)

        let outgoingMsg = Messages.O_MAKE_A_MOVE
        outgoingMsg.square_from = square_from
        outgoingMsg.square_to = square_to
        outgoingMsg.move_string = move_string
        outgoingMsg.time = this.clock.getTimer(1)

        this.socket.send(JSON.stringify(outgoingMsg))

        this.currentPiece = null

        // Checkmate
        if(move_string.includes("#")){
            console.log(`Checkmate: ${move_string}`)
            this.sendGameOver(this.is_white)
            this.gameOver(this.is_white)
        }
    }

    receiveMove(from, to, move_string, time){
        this.movePiece(from, to, move_string)

        this.clock.startTimer(1)
        this.clock.setTimer(2, time)
    }

    movePiece(from, to, move_string) {
        let capture = false

        console.log(`moving from ${from} to ${to}`)

        let { x: fromX, y: fromY} = this.board.id2squareData(from, this.chess.turn() == 'w')
        console.log(`x ${fromX}, y ${fromY}`)
        let fromSquare = this.board.squares[fromY][fromX]

        let { x: toX, y: toY } = this.board.id2squareData(to, this.chess.turn() == 'w')
        console.log(`x ${toX}, y ${toY}`)
        let toSquare = this.board.squares[toY][toX]
        
        let move = this.chess.move({from: from, to: to} )

        // console.log(move)
        if (!move) {
            console.error(`Making move ${move} did not succeed`)
            return
        }

        console.log(this.chess.ascii())
        this.board.update_pieces(this.chess.board())

        this.sidepanel.addMove(move_string)

        if(move_string.includes('x'))
            this.audio.Capture()
        else
            this.audio.Move()
    }

    sendGameOver(white_won){
        let outgoingMsg = Messages.O_GAME_WON_BY
        outgoingMsg.data = white_won ? "WHITE" : "BLACK"
        if(this.socket)
            this.socket.send(JSON.stringify(outgoingMsg))
    }

    gameOver(white_won){
        console.log(`This game is over, and ${white_won? "white":"black"} won`)
        this.clock.stopTimer()

        this.overlay.classList.toggle("hidden", false)
        this.overlay.children[0].innerText = `${white_won ? "White" : "Black"} has won the game`
        this.overlay.classList.toggle("black_won", !white_won)
    }

    gameAborted(){
        let outgoingMsg = Messages.O_GAME_ABORTED
        if(this.socket)
            this.socket.send(outgoingMsg)

        this.overlay.classList.toggle("hidden", false)
        this.overlay.children[0].innerText = "The game has been aborted"
    }
}