//ts-check

/**
 * This code manages the pieces
 */

 class Piece {
     /**
      * 
      * @param {string} type What piece is this? one of 'pnbrqk' for pawn, (k)night, bishop, rook, queen, king
      * @param {string} color What color is this piece? 'b': black, 'w': white
      * @param {Square} startSquare 
      */
     constructor(type, color, startSquare){

        if(startSquare.piece != null){
            console.error("The square already contained a piece")
            return
        }

        this.type = type
        this.color = color
        this.onSquare = startSquare
        this.DOMelement = this.createPiece()
     }

     /**
      * creates a new DOM element, namely the svg, on the current square with the right type and color
      */
     createPiece(){

        let shorthand = this.type + this.color
        var pieceElement = document.createElement('div')
        pieceElement.classList.toggle('piece', true)
        pieceElement.classList.toggle(shorthand, true)

        this.onSquare.DOMelement.appendChild(pieceElement)

        return pieceElement
     }

     moveTo(toSquare){
         if(toSquare.piece != null){
            toSquare.removePiece()
         }

         toSquare.piece = this
         this.onSquare.piece = null
         this.onSquare = toSquare
         toSquare.DOMelement.appendChild(this.DOMelement)
     }

     destroyPiece(){
         this.DOMelement.remove()
     }

     animationFrame(){}
 }

 console.log("piece.js has loaded")