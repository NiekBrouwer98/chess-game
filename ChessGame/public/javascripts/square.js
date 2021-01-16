
// @ts-check

class Square{
    constructor(object, x, y, id){
        this.DOMelement = object
        this.x = x
        this.y = y
        this.id = id
        this.piece = null

        //
        this.DOMelement.addEventListener("mousedown", this.squarePressed.bind(this))
        this.DOMelement.addEventListener("mouseup", this.squareReleased.bind(this))
    }

    removePiece(){
        if(this.piece === null){
            console.error("this square doesn't have a piece")
            return
        }

        console.log(`removing ${this.piece.type} from ${this.id}`)

        this.piece.destroyPiece()
        this.piece = null
    }

    toggleHighlight(force){
        this.DOMelement.classList.toggle('highlight', force)
    }

    squarePressed(){
        console.log(this)
        gameManager.pressedSquare(this)
    }

    squareReleased(){
        console.log(this)
        gameManager.releasedSquare(this)
    }
}