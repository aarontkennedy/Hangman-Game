$(document).ready(function () {

    var playerInfo = {
        numWins: 0,
        numLosses: 0,
        incrementWins: function() {
            this.numWins++;
            $("#numWins").text(this.numWins);
        },
        incrementLosses: function() {
            this.numLosses++;
            $("#numLosses").text(this.numLosses);
        }
    };

    var gameGuesses = {
        numBadGuesses: 9,
        guessesTaken: "",
        init: function() {
            this.numBadGuesses = 9;
            this.guessesTaken = "";
            $("#lettersGuessed").text(this.guessesTaken);
            $("#numGuessesLeft").text(this.numBadGuesses);
        },
        decrementGuesses: function () {
            this.numBadGuesses--;
            $("#numGuessesLeft").text(this.numBadGuesses);
        },
        isLetterChosenAlready: function(letter) {
            if (this.guessesTaken.indexOf(letter) == -1) {
                // the letter is not found - add to list
                this.guessesTaken += letter;
                //console.log(this.guessesTaken);
                $("#lettersGuessed").text(this.guessesTaken);
                return false;
            }
            // else - letter already existed
            //console.log(letter +" already guessed");
            return true;
        } 
    };

    var hangmanGame = {
        
    };    

    $(document).keyup(function (event) {
        var charTyped = event.key.toLowerCase();
        
        if (charTyped.length == 1 && /[a-z]/i.test(charTyped)) {
            //console.log(charTyped + " pressed - play the game");
            gameGuesses.isLetterChosenAlready(charTyped);
        }
        else {
            //console.log(charTyped + " pressed - not a letter");
        }
        // else not a letter
    });


});