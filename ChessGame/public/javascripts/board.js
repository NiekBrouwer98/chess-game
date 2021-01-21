'use strict';
// @ts-check


/**
 * The object managing the overall board
 * Note that, when dealing with boardstates, we always use the white side prespective (A1 = bottom left)
 * and we just setup the square positions accordingaly
 */

class Board {

    /**
     * @constructor
     * @param {object} DOMelement The Dom reference to the board
     * @param {boolean} is_white If the player is white or black
     */
    constructor(DOMelement, is_white, gameManager) {
        this.DOMelement = DOMelement
        this.DOMelement.addEventListener("mouseleave", () => {gameManager.mouseLeftBoard()})

        this.is_white = is_white
        console.log(`board set up as ${is_white? 'white':'black'}`)
        this.gameManager = gameManager

        this.squares = null
        this.setupBoard();
        // this.SetupPieces();
    }

    /**
     * Populate this.squares with new squares
     */
    setupBoard() {
        //create the squares array
        this.squares = new Array(8);
        for (let i = 0; i < 8; i++) {
            this.squares[i] = new Array(8);
        }

        let children = this.DOMelement.children;
        // console.log(children);
        for(let i = 0; i < 8*8; i++){
            let squareData = this.n2squareData(i)
            let square = new Square(children[i], squareData.x, squareData.y, squareData.id, this.gameManager)

            //Add the square object to the 2d array (from the perspective of white)
            this.squares[7 - squareData.y][squareData.x] = square

            // let letter = String.fromCharCode(97 + i%8 ) // Ascii letter start at 97
            // let number = Math.floor(i / 8)

            if((this.is_white && squareData.x == 0) || (!this.is_white && squareData.x == 7)){
                var newtext = document.createTextNode(String(squareData.y + 1))
                children[i].appendChild(newtext)
            }
            if((this.is_white && squareData.y == 0) || (!this.is_white && squareData.y == 7)){
                var newtext = document.createTextNode(String.fromCharCode(97 + squareData.x))
                children[i].appendChild(newtext)
            }
        }
        // console.log(this.squares)
    }

    /**
     * Creates and sets up all the pieces
     * @param {array} board An 2D array with what piece is in what positon as returned by the Chess library
     */
    setupPieces(board){
        for(let x = 0; x < 8; x++){
            for(let y = 0; y < 8; y++){
                // console.log(board[y][x])
                if(board[y][x]){
                    let {type, color} = board[y][x]
                    let piece = new Piece(type, color, this.squares[y][x])
                    this.squares[y][x].piece = piece
                }
            }
        }
    }

    /**
     * brings the board to a new boardstate
     * @param {array} board An 2D array with what piece is in what positon as returned by the Chess library
     */
    update_pieces(board){

        //Quick and dirty way
        this.clear()
        this.setupPieces(board)

    }

    /**
     * Clears the complete board
     */
    clear(){
        console.log("Clearing board")
        this.squares.forEach(squareRow => {
            squareRow.forEach(square => {   
                if(square.piece != null)
                    square.removePiece()
            })
        });
    }

    /**
     * Getter if the board is completely empty
     */
    isClear(){
        this.squares.forEach(squareRow => {
            squareRow.forEach(square => {
                if(square.piece != null)
                    return false
            })
        });
        return true
    }


    /**
     * Helper function to get the square data for the n'th square
     * @param {number} n - The nth square in the 
     */
    n2squareData(n){
        if(this.is_white)
            return{
                x: n%8,
                y: 7 - Math.floor(n / 8),
                id: String.fromCharCode(97 + n%8) + (8 - Math.floor(n / 8))
            }
        else
            return{
                x: 7 - n%8,
                y: Math.floor(n / 8),
                id: String.fromCharCode(97 + 7 - n%8) + (Math.floor(n / 8) + 1)
            }
    }


    /**
     * Helper function to get the square position from an id
     * @param {string} id - The id of the square eg 'a1' or 'd4' or and move like 'Nh3'
     */
    id2squareData(id, is_white){
        // console.log(id)

        //Remove the + sign if the king is in check
        if(id[id.length - 1] == "+")
            id = id.substring(0, id.length - 1)
        if(id[id.length - 1] == "#")
            id = id.substring(0, id.length - 1)

        //castleing king side
        if(id == 'O-O'){
            return is_white ? {x: 6, y: 7} : {x: 6, y: 0}
        }
        //castleing queen side
        if(id == 'O-O-O'){
            return is_white ? {x: 2, y: 7} : {x: 2, y: 0}
        }

        return{
            x: id.charCodeAt(id.length - 2) - 97,
            y: 8 - Number(id[id.length - 1]),
        }
    }
}
