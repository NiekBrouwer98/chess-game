// @ts-check
class GameManager {

    constructor() {
        this.chess = new Chess()  // Chess.js library providing valid moves and piece positions
        this.board = new Board(document.getElementById("board"), true)
        this.board.setupPieces(this.chess.board())
        this.currentPiece = null
        this.legalMovesCurrentPiece = []
    }

    makeMove() {
        console.log("Move from " + this.startSquare.id + " to " + this.endSquare.id)
    }


    pressedSquare(square) {
        this.legalMovesCurrentPiece = this.chess.moves({ square: square.id })
        console.log(square.id)
        console.log(this.legalMovesCurrentPiece)
        this.legalMovesCurrentPiece.forEach(move => {
            let { x, y } = this.board.id2squareData(move)
            if (x == null || y == null || x < 0 || x > 7 || y < 0 || y > 7) {
                console.error("Can't generate position for move " + move)
            } else {
                this.board.squares[y][x].toggleHighlight(true)
            }
        });

        this.currentPiece = square.piece
    }

    releasedSquare(square) {
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
            console.log(`moving ${this.currentPiece.type} from ${this.currentPiece.onSquare.id} to ${square.id}`)
            if (!this.chess.move(moveMade)) {
                console.error(`Making move ${moveMade} did not succeed`)
            }
            this.currentPiece.moveTo(square)
        }
    }

}