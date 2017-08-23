function generateWinningNumber() {
	return Math.floor(Math.random() * 100) + 1;
}

function shuffle(array) {
  var m = array.length, t, i;

  // While there remain elements to shuffle…
  while (m) {

    // Pick a remaining element…
    i = Math.floor(Math.random() * m--);

    // And swap it with the current element.
    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }

  return array;
}

function Game() {
  this.playersGuess = null;
  this.pastGuesses = [];
  this.winningNumber = generateWinningNumber();
}

Game.prototype.difference = function() {
  return Math.abs(this.playersGuess - this.winningNumber);
}

Game.prototype.isLower = function() {
	if (this.playersGuess < this.winningNumber) {
		return true;
	} else {
		return false;
	}
}

Game.prototype.playersGuessSubmission = function(n) {
	if (n < 1 || n > 100 || typeof n !== "number") {
		throw "That is an invalid guess.";
	} 
      	this.playersGuess = n;
      	return this.checkGuess();
}

Game.prototype.checkGuess = function() {
    if (this.playersGuess === this.winningNumber) {
    	$('#hint, #submit').prop("disabled", true);
    	$('#subtitle').text("Press the reset button to play again!");
		return "You Win!";
	} else {
		if (this.pastGuesses.includes(this.playersGuess)) {
			return "You have already guessed that number.";
		} else {
			this.pastGuesses.push(this.playersGuess);
			$('#guesses li:nth-child('+ this.pastGuesses.length +')').text(this.playersGuess);
		} if (this.pastGuesses.length === 5) {
			 $('#hint, #submit').prop("disabled", true);
    	     $('#subtitle').text("Press the reset button to play again!");
		      return "You Lose.";
			  } else {
			  	if(this.isLower()) {
                   $('#subtitle').text("Guess Higher!");
                } else {
                   $('#subtitle').text("Guess Lower!");
                }
				} if (this.difference() < 10) {
				      return "You\'re burning up!";
				} else if (this.difference() < 25) {
				      return "You\'re lukewarm.";
				} else if (this.difference() < 50) {
				      return "You\'re a bit chilly.";
				} else {
				      return "You\'re ice cold!";
				}
	}
};

var newGame = function() {
	return new Game();
}

Game.prototype.provideHint = function() {
	return shuffle([this.winningNumber,generateWinningNumber(),generateWinningNumber()]);
}


function makeAGuess(game) {
    var guess = $('#player-input').val();
    $('#player-input').val("");
    var output = game.playersGuessSubmission(parseInt(guess,10));
    $('#title').text(output);
}


$(document).ready(function() {
	var game = new Game();
    $('#submit').click(function(e) {
       makeAGuess(game);
    })
    $('#player-input').keypress(function(event) {
        if (event.which == 13) {
        	makeAGuess(game);
        }  
    })
    $('#hint').click(function() {
    	var hints = game.provideHint();
    	$('#title').text('The winning number is ' + hints[0] + ', ' + hints[1] + ', or ' + hints[2]);
    });
    $('#reset').click(function() {
        game = new Game();
        $('#title').text('Can you guess the number?');
        $('#subtitle').text('Enter a number between 1-100!');
        $('.guess').text('-');
        $('#hint, #submit').prop("disabled", false);
    })
})
