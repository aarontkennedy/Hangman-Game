$(document).ready(function () {

    var puzzles = [
        "cat",
        "chicken",
        "elephant",
        "butterfly",
        "hippopotamus"
    ];

    // playerInfo object will keep track of wins, losses, and printing them
    function PlayerInfo() {
        this.numWins = 0;
        this.numLosses = 0;
    }

    PlayerInfo.prototype.incrementWins = function() {
        this.numWins++;
        $("#numWins").text(this.numWins);
    };

    PlayerInfo.prototype.incrementLosses = function() {
        this.numLosses++;
        $("#numLosses").text(this.numLosses);
    };


    // Guesses will take care of the number of guesses and keeping track of letters
    function Guesses(numberOfGuesses) {
        this.numBadGuesses = numberOfGuesses;
        this.lettersGuessed = "";
        $("#lettersGuessed").text(this.lettersGuessed);
        $("#numGuessesLeft").text(this.numBadGuesses);
    }        
    
    Guesses.prototype.decrementGuesses = function () {
        this.numBadGuesses--;
        $("#numGuessesLeft").text(this.numBadGuesses);
    };
        
    Guesses.prototype.isLetterChosenAlready = function(letter) {
        if (this.lettersGuessed.indexOf(letter) == -1) {
            // the letter is not found - add to list
            this.lettersGuessed += letter;
            // update the letters guessed to the screen
            $("#lettersGuessed").text(this.lettersGuessed);
            return false;  // return false, wasn't chosen already
        }
        // else - letter already existed
        return true;
    };


    // this class will take care of each letter in the puzzle
    // much easier to have each letter to be responsible for 
    // whether or not it is solved and how it should be printed
    function PuzzleLetter (c) {
        this.character = c;
        this.isSolved = false;
    }
        
    PuzzleLetter.prototype.print = function(){
        if (this.isSolved) {
            $("#wordLocation").append("<span>"+ this.character +" </span>");
        }
        else {
            $("#wordLocation").append("<span>_ </span>");
        }
    };

    PuzzleLetter.prototype.handleGuess = function(guess) {
        if (guess == this.character) {
            this.isSolved = true;
            this.print();
            return true;
        }
        this.print();
        return false;
    };
    

    // this is the over all game object that pulls all the pieces together
    function HangmanGame (puzzleString) {
        //console.log(puzzleString);
        this.winsNLosses = new PlayerInfo();
        this.reset(puzzleString);

    }

    HangmanGame.prototype.reset = function (puzzleString) {
        this.guessingStats = new Guesses(9);
        this.puzzle = puzzleString;
        this.puzzleLetters = [];

        for(var i = 0; i < this.puzzle.length; i++) {
            this.puzzleLetters.push(new PuzzleLetter(this.puzzle[i]));
        }
        this.print();
    };

    HangmanGame.prototype.print = function() {
        // first clear the existing stuff that was already printed
        $("#wordLocation").html("");
        // now ask each letter to print itself if solved
        for(var i = 0; i < this.puzzleLetters.length; i++) {
            this.puzzleLetters[i].print();
        }
    };    

    HangmanGame.prototype.guessed = function (c) {
        if (!this.guessingStats.isLetterChosenAlready(c)) {
            var correctGuess = false;
            for(var i = 0; i < this.puzzle.length; i++) {
                correctGuess = this.puzzleLetters[i].handleGuess(c) || correctGuess;
            }
            if (!correctGuess) {
                this.guessingStats.decrementGuesses();
            }
            this.print();
        }
    };
    HangmanGame.prototype.hasWon = function () {
        console.log("starting to check if hasWon");
        var result = true;
        for(var i = 0; i < this.puzzleLetters.length; i++) {
            console.log(this.puzzleLetters[i] + ": " + this.puzzleLetters[i].isSolved);
            result = this.puzzleLetters[i].isSolved && result;
        }
        return result;
    };
    HangmanGame.prototype.hasLost = function () {
        if (this.guessingStats.numBadGuesses < 1) {
            return true;
        }
        return false;
    };
    HangmanGame.prototype.gameCompleted = function () {
        if (this.hasLost()) {
            this.winsNLosses.incrementLosses();
            return true;
        }
        else if (this.hasWon()) {
            this.winsNLosses.incrementWins();
            return true;
        }
        return false;
    };

    var game = new HangmanGame (puzzles[Math.floor(Math.random()*puzzles.length)]);



    $(document).keyup(function (event) {
        var charTyped = event.key.toLowerCase();
        
        if (charTyped.length == 1 && /[a-z]/i.test(charTyped)) {
            //console.log(charTyped + " pressed - play the game");
            game.guessed(charTyped);
            
            if (game.gameCompleted()) {
                alert("game over!")
                game.reset(puzzles[Math.floor(Math.random()*puzzles.length)]);
            }
        }
        else {
            //console.log(charTyped + " pressed - not a letter");
        }
        // else not a letter
    });

});