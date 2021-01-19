// @ts-check"
"use strict";
class GameManager {

    constructor(is_white, socket) {
        this.chess = new Chess()  // Chess.js library providing valid moves and piece positions
        this.socket = socket
        this.board = new Board(document.getElementById("board"), is_white, this)
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

        if (moveMade == null){
            console.log("Invalid move :(")
            return
        }

        let square_from = this.currentPiece.onSquare.id
        let square_to = square.id
        let move_string = moveMade

        this.movePiece(square_from, square_to)

        let outgoingMsg = Messages.O_MAKE_A_MOVE;
        outgoingMsg.square_from = square_from;
        outgoingMsg.square_to = square_to;
        outgoingMsg.move_string = move_string;
        outgoingMsg.time = this.clock.getTimer('1');

        this.socket.send(JSON.stringify(outgoingMsg));
    }

    movePiece(from, to) {
        let capture = false

        console.log(`moving from ${from} to ${to}`)

        let { x: fromX, y: fromY} = this.board.id2squareData(from)
        console.log(`x ${fromX}, y ${fromY}`)
        let fromSquare = this.board.squares[fromY][fromX]

        let { x: toX, y: toY } = this.board.id2squareData(to)
        console.log(`x ${toX}, y ${toY}`)
        let toSquare = this.board.squares[toY][toX]


        
        let move = this.chess.move({from: from, to: to} )

        // console.log(move)
        if (!move) {
            console.error(`Making move ${moveMade} did not succeed`)
            return
        }

        // //Flip the timer
        // if(this.gameManager.chess.turn() == 'w'){ // did white just move
        //     this.clock.startTimer(this.is_white ? 2 : 1) // other payer (2) is black if not is_white
        // }else{
        //     this.clock.startTimer(this.is_white ? 1 : 2) // this payer (1) is white if is_white
        // }

        // if(square.piece)
        //     capture = true

        //enpasant
        // if(moveMade.substring(1,2) == "x" && square.piece == null){
        //     if(square.y == 2)
        //         this.board.squares[4][square.x].removePiece()
        //     if(square.y == 5)
        //         this.board.squares[3][square.x].removePiece()
            
        //     capture = true
        // }

        console.log(this.chess.ascii())
        this.board.update_pieces(this.chess.board())

        // if(capture)
        //     this.audio.Capture()
        // else
        this.audio.Move()
    }
}