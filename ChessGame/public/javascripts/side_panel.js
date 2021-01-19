class Sidepanel{

    constructor(DOMelement){
        this.DOMelement = DOMelement
    }

    addMove(move){
        var element = document.createElement('li')
        element.classList.toggle('controlpanel-content-move', true)
        element.innerText = move

        this.DOMelement.appendChild(element)
    }

}