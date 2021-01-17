class AudioManager {
    constructor(){
        const move = new Audio("/data/move.wav");
        const capture = new Audio("/data/capture.wav");
        this.move = move
        this.capture = capture
    }

    Move(){
        this.move.play();
    }

    Capture(){
        this.capture.play();
    }
}