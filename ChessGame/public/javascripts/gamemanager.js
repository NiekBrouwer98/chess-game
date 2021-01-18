// @ts-check"
"use strict";
class GameManager {

    constructor(is_white) {
        this.chess = new Chess()  // Chess.js library providing valid moves and piece positions
        this.board = new Board(document.getElementById("board"), true)
        this.board.setupPieces(this.chess.board())
        this.audio = new AudioManager()
        this.clock = new Clock(document.getElementsByClassName("chessboard-header")[0], 5, 5)
        this.currentPiece = null
        this.legalMovesCurrentPiece = []
        document.getElementById("main").classList.toggle("is_white", is_white)
    }

    pressedSquare(square) {
        this.legalMovesCurrentPiece = this.chess.moves({ square: square.id })
        // console.log(square.id)
        // console.log(this.legalMovesCurrentPiece)
        this.legalMovesCurrentPiece.forEach(move => {
            let { x, y } = this.board.id2squareData(move)
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

    releasedSquare(square) {
        // console.log("releasing")
        // console.log(square.id)

        if(this.currentPiece)
            this.currentPiece.stopAnimation()
      
        let moveMade = null
        this.legalMovesCurrentPiece.forEach(move => {
            let { x, y } = this.board.id2squareData(move)
            if (x == null || y == null) {
                console.error("Can't generate position for move " + move)
            } else {
                this.board.squares[y][x].toggleHighlight(false)
                if (this.board.squares[y][x] == square)
                    moveMade = move
            }
        });

        if (moveMade != null) {
            let capture = false

            console.log(moveMade)
            console.log(`moving ${this.currentPiece.type} from ${this.currentPiece.onSquare.id} to ${square.id}`)
            let move = this.chess.move(moveMade)
            // console.log(move)
            if (!move) {
                console.error(`Making move ${moveMade} did not succeed`)
                return
            }

            //Flip the timer
            if(gameManager.chess.turn() == 'w'){ // did white just move
                this.clock.startTimer(this.is_white ? 2 : 1) // other payer (2) is black if not is_white
            }else{
                this.clock.startTimer(this.is_white ? 1 : 2) // this payer (1) is white if is_white
            }

            if(square.piece)
                capture = true

            //enpasant
            if(moveMade.substring(1,2) == "x" && square.piece == null){
                if(square.y == 2)
                    this.board.squares[4][square.x].removePiece()
                if(square.y == 5)
                    this.board.squares[3][square.x].removePiece()
                
                capture = true
            }

            console.log(this.chess.ascii())
            this.currentPiece.moveTo(square)

            if(capture)
                this.audio.Capture()
            else
                this.audio.Move()
        }
    }
}