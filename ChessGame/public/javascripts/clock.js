
// @ts-check
"use strict";

//This contains all code used to manage the chess timer
class Clock{
    constructor(DOMparent, time1, time2, gameManager){
        console.log(DOMparent)

        // time left in milliseconds
        this.initalTimeLeftPlayer1 = time1 * 60 * 1000
        this.initalTimeLeftPlayer2 = time2 * 60 * 1000

        // 0 = nothing, 1 = counting down player 1, 2 = counting down player 2
        this.coutingState = 0 

        //moment when the current timer started
        this.endTime = null

        // interval function
        this.timer = null

        //dom elements
        this.DOMparent = DOMparent

        this.DOMlabelPlayer1 = DOMparent.children[0]
        this.DOMlabelPlayer2 = DOMparent.children[2]
        this.DOMclockPlayer1 = DOMparent.children[1].children[0].children[0]
        this.DOMclockPlayer2 = DOMparent.children[1].children[1].children[0]
        
        this.gameManager = gameManager

        this.displayTimer(1, this.initalTimeLeftPlayer1)
        this.displayTimer(2, this.initalTimeLeftPlayer2)


    }

    /**
     * Starts the timer for one player, if the timer was already running for the other player that is stoped
     * @param {number} player what player, 1 = this player, 2 = the other player
     */
    startTimer(player){
        //There is already a timer running for the other player, stop that now
        if((this.coutingState != 0) && (this.coutingState != player)){
            this.stopTimer()
        }

        this.endTime = new Date().getTime() + (player == 1 ? this.initalTimeLeftPlayer1 : this.initalTimeLeftPlayer2)

        this.timer = setInterval(() => {this.timerEvent()}, 10)
        this.coutingState = player
    }

    /**
     * This event is called 100 times each seccond
     */
    timerEvent(){

        let timeLeft = this.endTime - new Date().getTime()

        // the timer has reached 0
        if(timeLeft < 0){
            this.displayTimer(this.coutingState,  0)
            clearInterval(this.timer)

            // this player has lost
            if(this.coutingState == 1){
                console.log("Time is up")

                console.log(this.gameManager)
                this.gameManager.sendGameOver(!this.gameManager.is_white)
                this.gameManager.gameOver(!this.gameManager.is_white)
            }
            return
        }else{
            this.displayTimer(this.coutingState,  timeLeft)
        }
    }

    /**
     * Sets the time for a player
     * @param {number} player what player, 1 = this player, 2 = the other player
     * @param {number} timeLeft how much time is left in ms
     */
    setTimer(player, timeLeft){
        let now = new Date().getTime()

        if(this.coutingState == player){
            this.stopTimer() // pause and reset the timer
            if(player == 1)
                this.initalTimeLeftPlayer1 = timeLeft
            else
                this.initalTimeLeftPlayer2 = timeLeft
            this.startTimer(player) // continue the timer from the new time
        }else{
            if(player == 1)
                this.initalTimeLeftPlayer1 = timeLeft
            else
                this.initalTimeLeftPlayer2 = timeLeft
        }

        this.displayTimer(player, timeLeft)
    }

    /**
     * Returns the time left for a specific player
     * @param {number} player  what player, 1 = this player, 2 = the other player
     */
    getTimer(player){
        if(this.coutingState == player){
            return this.endTime - new Date().getTime()
        }else{
            return (player == 1) ? this.initalTimeLeftPlayer1 : this.initalTimeLeftPlayer2;
        }
    }

    /**
     * Function to display the time on the clock
     * @param {number} player what player, 1 = this player, 2 = the other player
     * @param {number} time how much time to display
     */
    displayTimer(player, time){
        if(player == 1){
            this.DOMclockPlayer1.innerText = this.formatTime(time)
        }else {
            this.DOMclockPlayer2.innerText = this.formatTime(time)
        }
    }

    /**
     * Stop any timer that is running
     */
    stopTimer(){
        let now = new Date().getTime()

        if(this.coutingState == 1)
            this.initalTimeLeftPlayer1 = (this.endTime - now)
        else if(this.coutingState == 2)
            this.initalTimeLeftPlayer2 = (this.endTime - now)
        
        console.log(`TIme left: ${this.endTime - now}`)
        this.coutingState = 0
        this.endTime = null

        clearInterval(this.timer)
    }

    /**
     * Helper funcion that returns a nice string from a time in ms
     * @param {number} milliseconds 
     */
    formatTime(milliseconds){
        let min = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60))
        let sec = Math.floor((milliseconds % (1000 * 60)) / (1000))
        let mill = Math.floor((milliseconds % 1000) / (10))

        if(!min){
            return `${sec.toString().padStart(2, "0")}.${mill.toString().padStart(2, "0")}`
        }else{
            return `${min}:${sec.toString().padStart(2, "0")}`
        }
    }
}
