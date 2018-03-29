$(document).ready(function () {

    // a puzzle object, essentially an array with the ability to return a 
    // random member of the list
    function Puzzles() {
        this.words = ["cat",
                      "chicken",
                      "elephant",
                      "butterfly",
                      "hippopotamus"];
    }

    Puzzles.prototype.getRandom = function () {
        return this.words[Math.floor(Math.random()*this.words.length)];
    };
    


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
            this.lettersGuessed += " " + letter;
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
            return true;
        }
        return false;
    };
    


    // this object will handle the updating of the scaffold image
    function ScaffoldImage () {
        this.imgPath = "assets/images/";
        this.total = 8; 
        this.reset();
    }

    ScaffoldImage.prototype.reset = function () {
        this.current = 0;
        this.changePicture();
    };

    ScaffoldImage.prototype.changePicture = function () {
        $("#scaffold").attr('src', this.imgPath + 'hangman' + this.current + '.jpg');
    };

    ScaffoldImage.prototype.nextPicture = function () {
        this.current++;
        this.changePicture();
    };


    // this is the over all game object that pulls all the pieces together
    function HangmanGame () {
        this.gamePuzzles = new Puzzles();  // only create once, no need to reset
        this.winsNLosses = new PlayerInfo(); // create once, don't reset and lose info

        this.reset();

    }

    // handles the rest of the initialization,
    // also resets variables at the end of a game for a new game
    HangmanGame.prototype.reset = function () {
        this.gameImages = new ScaffoldImage();
        this.guessingStats = new Guesses(this.gameImages.total);
        this.puzzle = this.gamePuzzles.getRandom();
        this.puzzleLetters = [];

        for(var i = 0; i < this.puzzle.length; i++) {
            this.puzzleLetters.push(new PuzzleLetter(this.puzzle[i]));
        }
        this.print();
    };

    // handles updating of the puzzle in the html, clears and
    // calls each letter to print itself
    HangmanGame.prototype.print = function() {
        // first clear the existing stuff that was already printed
        $("#wordLocation").html("");
        // now ask each letter to print itself if solved
        for(var i = 0; i < this.puzzleLetters.length; i++) {
            this.puzzleLetters[i].print();
        }
    };    

    // handles the guessing
    HangmanGame.prototype.guessed = function (c) {
        if (!this.guessingStats.isLetterChosenAlready(c)) {
            var correctGuess = false;
            // ask each letter if they match the guess
            for(var i = 0; i < this.puzzle.length; i++) {
                // it was a correct guess if even one was correct - use OR
                correctGuess = this.puzzleLetters[i].handleGuess(c) || correctGuess;
            }
            // if the letter isn't in the puzzle, punish them
            if (!correctGuess) {
                this.guessingStats.decrementGuesses();
                this.gameImages.nextPicture();
            }
            else { // if they were correct, then update the html
                this.print(); 
            }
        }
    };

    // this is probably a terribly inefficient method to determine if they 
    // have won, but it works and the for loops are limited in length
    // to the short length of the puzzle words
    HangmanGame.prototype.hasWon = function () {
        var result = true;
        // ANDing together the return values from isSolved on each letter
        // if they are all true then AND is true, if even one is false,
        // then the result is false and they haven't won
        for(var i = 0; i < this.puzzleLetters.length; i++) {
            result = this.puzzleLetters[i].isSolved && result;
        }
        return result;
    };

    // much easier to determine if they have lost, check the number of
    // available guesses
    HangmanGame.prototype.hasLost = function () {
        if (this.guessingStats.numBadGuesses < 1) {
            return true;
        }
        return false;
    };

    // this method checks if they have won or lost
    // also updates the screen if they have won or lost
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

    var game = new HangmanGame ();



    $(document).keyup(function (event) {
        // check they aren't being silly and using shift or caps lock
        var charTyped = event.key.toLowerCase();  
        
        // is it a letter
        if (charTyped.length == 1 && /[a-z]/i.test(charTyped)) {
            //console.log(charTyped + " pressed - play the game");
            game.guessed(charTyped);
            
            if (game.gameCompleted()) {
                if (game.hasLost()) {
                    alert("Game Over! " + "It was "+ game.puzzle + ".");
                }
                else {
                    alert("Congratulations! " + "It was "+ game.puzzle + ".");
                }
                game.reset();
            }
        }
        else { // else not a letter
            //console.log(charTyped + " pressed - not a letter");
        }
        
    });

});