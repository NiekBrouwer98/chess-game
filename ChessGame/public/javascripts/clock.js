
// @ts-check
"use strict";

//This file contains all code used to manage the timer

class Clock{
    constructor(DOMparent, time1, time2){
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
        

        this.displayTimer(1, this.initalTimeLeftPlayer1)
        this.displayTimer(2, this.initalTimeLeftPlayer2)
    }

    startTimer(player){
        //There is already a timer running for the other player, stop that now
        if((this.coutingState != 0) && (this.coutingState != player)){
            this.stopTimer()
        }

        this.endTime = new Date().getTime() + (player == 1 ? this.initalTimeLeftPlayer1 : this.initalTimeLeftPlayer2)

        this.timer = setInterval(() => {this.timerEvent()}, 10)
        this.coutingState = player
    }

    timerEvent(){

        let timeLeft = this.endTime - new Date().getTime()
        this.displayTimer(this.coutingState,  timeLeft)
        if(timeLeft < 0){
            this.stopTimer()
        }
    }

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

    getTimer(player){
        if(this.coutingState == player){
            return this.endTime - new Date().getTime()
        }else{
            return (player == '1') ? this.initalTimeLeftPlayer1 : this.initalTimeLeftPlayer2;
        }
    }

    displayTimer(player, time){
        if(player == 1){
            this.DOMclockPlayer1.innerText = this.formatTime(time)
        }else {
            this.DOMclockPlayer2.innerText = this.formatTime(time)
        }
    }

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
