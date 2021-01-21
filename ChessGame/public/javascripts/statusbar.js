class statusBar{

    constructor(DOMelement){
        this.DOMelement = DOMelement
    }

    setStatus(statusMessage){
        this.DOMelement.innerText = statusMessage;
    }

}
