// @ts-check
class GameManager {

    constructor() {
        this.chess = new Chess()  // Chess.js library providing valid moves and piece positions
        this.board = new Board(document.getElementById("board"), true)
        this.board.setupPieces(this.chess.board())
        this.currentPiece = null
        this.legalMovesCurrentPiece = []
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
            console.log(moveMade)
            console.log(`moving ${this.currentPiece.type} from ${this.currentPiece.onSquare.id} to ${square.id}`)
            if (!this.chess.move(moveMade)) {
                console.error(`Making move ${moveMade} did not succeed`)
                return
            }
            console.log(this.chess.ascii())
            this.currentPiece.moveTo(square)

            //enpasant
            if(moveMade.substring(1,2) == "x"){
                if(square.y == 2)
                    this.board.squares[4][square.x].removePiece()
                if(square.y == 5)
                    this.board.squares[3][square.x].removePiece()
            }
        }
    }

}