// @ts-check
"use strict";

/**
 * THis code manages a square
 */
class Square{
    constructor(object, x, y, id, gameManager){
        this.DOMelement = object
        this.x = x
        this.y = y
        this.id = id
        this.piece = null
        this.gameManager = gameManager
        
        this.DOMelement.addEventListener("mousedown", () => {gameManager.pressedSquare(this)})
        this.DOMelement.addEventListener("mouseup", () => {gameManager.releasedSquare(this)})
    }

    removePiece(){
        if(this.piece === null){
            console.error(`this square (${this.id}) doesn't have a piece`)
            return
        }

        this.piece.destroyPiece()
        this.piece = null
    }

    toggleHighlight(force){
        this.DOMelement.classList.toggle('highlight', force)
    }
}