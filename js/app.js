/*
 * Create a list that holds all of your cards
 */

let cards = ['fa-diamond','fa-diamond','fa-paper-plane-o','fa-paper-plane-o','fa-anchor', 'fa-anchor','fa-bolt','fa-bolt','fa-cube','fa-cube','fa-leaf','fa-leaf','fa-bicycle','fa-bicycle','fa-bomb','fa-bomb'];
let _moveCounter = 0;
let matchedCards = [];
let _startTime = 0;
let _endTime = 0;
let openCards = []; 
let gameStarted = false;
let intervalId;
let locked = false;

function hideModal() {
	let modal = document.querySelector('.modal');
		modal.style.display = "none"; // should be none
}
/*
* Generate a document element representng a card
*	- the font-awesome class is passed in as a parameter
*/
function generateCard(card) {
	let liElement = document.createElement('li'); //
	liElement.classList.add('card');
	let iElement = document.createElement('i');
	iElement.classList.add('fa');
	iElement.classList.add(`${card}`);
	liElement.appendChild(iElement);

	let fragment = document.createDocumentFragment();
	let uiElement = document.querySelector('.deck');
	
	return liElement;
}
		
/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}


/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

/*
* Callback function to reset the playing board and variables
* used by the reset button 
*/
function reset() {
	createGameBoard();
	initGame();
}

//const restart = document.querySelector('.restart');
//restart.addEventListener('click', reset);

/*
* Function to remove all card elements from board.
*/
function clearBoard() {
	const _theBoard = document.querySelector('.deck');
	while (_theBoard.firstChild) {
		_theBoard.removeChild(_theBoard.firstChild);
	}
}

/*
* Updates the move counter and the stars
*	- a star is removed for ever 6 moves
*	- 1 stars reminds after 30 moves
*	- a move is considered choosing 2 cards
*/
function incrementCount() {
	_moveCounter = _moveCounter + .5;
	let moves = parseInt(_moveCounter);
	
	let moveCounter = document.querySelector('.moves');

	moveCounter.innerText = moves;

	let remainder = _moveCounter % 6;
	if(remainder === 0) {
		removeStar();
	}
}

/*
* Resets the move counter on the page
*/
function resetCounter() {
	_moveCounter = 0;
	let moveCounter = document.querySelector('.moves');
	moveCounter.innerText = 0;
}

/*
* Sets up the game board
*	- reset global variables
*	- 
*/
function createGameBoard() {

	openCards = [];
	matchedCards = [];
	_moveCounter = 0;
	_startTime = 0;
	_endTime = 0;
	gameStarted = false;
	let timeElement = document.querySelector('#time');
	timeElement.innerText = 0;
	if(intervalId) {
		clearInterval(intervalId);
	}
	hideModal(); //
	clearBoard(); //
	resetCounter();//
	setStars();//
}

/*
*
*/
function initGame() {

	createGameBoard();
	let deck = document.querySelector('.deck');

	let shuffledDeck = shuffle(cards);
	shuffledDeck.forEach(function (card) {
		deck.appendChild(generateCard(card));
	});

	const thedeck = document.querySelectorAll('.card');
	thedeck.forEach(function(card) {
		card.addEventListener('click', function(event) {

			if(locked) {
				return;
			}
			
			if(!gameStarted) {
				gameStarted = true;
				updateGameTimer();
			}
			
			if(!card.classList.contains('show') && !card.classList.contains('open') && !card.classList.contains('match')) {
				if(openCards.length < 2) {
					openCards.push(card);
					card.classList.add('open', 'show');
					if(openCards.length == 2) {
						locked = true;
					}
					incrementCount();
				}

				if(openCards.length == 2) {

					if(compareCards(openCards[0], openCards[1])) {
						openCards[0].classList.add('match');
						openCards[1].classList.add('match');

						matchedCards.push([0]);
						matchedCards.push([1]);
					}
					
					setTimeout(function() {
						openCards.forEach(function(card) {
							card.classList.remove('open', 'show');
						}); 

						openCards = [];
						locked = false;

					}, 800);
					gameOver();
				} 
			}
			
		});
	});
}

initGame();

/*
*
*/
function updateGameTimer() {
	if(gameStarted) {
		_startTime = performance.now();

		intervalId = setInterval(function() {
			let timeElement = document.querySelector('#time');
			let second = performance.now();
			timeElement.innerText = parseInt((second - _startTime) / 1000);
		}, 1000);
	}
}

/* 
* Resets the user ratings to 5 stars 
*/
function setStars() {
	clearStars();
	let fragment = document.createDocumentFragment();
	for(i = 0; i < 5; i++) {
		fragment.appendChild(createStar('fa-star'));
	}
	const review = document.querySelector('.stars');
	review.appendChild(fragment);

}

/*
* Creates a star element
*	- the font-awesone class is passed in to either create an close or open star
*/
function createStar(clazz){
	let liElement = document.createElement('li'); //
	let iElement = document.createElement('i');
	iElement.classList.add('fa');
	iElement.classList.add(`${clazz}`);
	liElement.appendChild(iElement);	
	return liElement;
}

/*
* Replaces the closed star with open star icon
* to represent the removal of a star.
*/
function removeStar() {
	const review = document.querySelector('.stars');
	let stars = document.querySelectorAll('.fa-star');
	if(stars.length > 1) {
		if(review.hasChildNodes()) {
		let firstChild = review.firstChild;
		firstChild.remove();
		review.appendChild(createStar('fa-star-o'));
		}
	}
}

/*
* Clears  all stars from the score panel in preparation
* of reseting it.
*/
function clearStars() {
	const _review = document.querySelector('.stars');
	while(_review.hasChildNodes()) {
		_review.lastChild.remove();
	}
}

/*
* Compares two cards. Equality is determined by the font-awesome icon.
*/
function compareCards(cardA, cardB) {
	if(cardA.firstChild.className == cardB.firstChild.className) {
		return true;
	}
	return false;
}

/*
* Checks if the user has matched all the cards. If so,
*	- stops the timer
*	- updates modal variables in modal window
*	- cal 
*/
function gameOver() {

	if (cards.length == matchedCards.length) {
		_endTime = performance.now();
		let modal = document.querySelector('.modal');
		modal.style.display = "block";

		const _finalmoves = document.querySelector('#final-score-moves');
		const _stars = document.querySelectorAll('.fa-star');
		const _starsCount = _stars.length;
		const _moveCounter = document.querySelector('.moves');
		const _finalStars = document.querySelector("#final-score-stars");
		const _finalTime = document.querySelector("#final-score-time");
		_finalmoves.innerText = _moveCounter.innerText;
		_finalStars.innerText = _starsCount;

		_finalTime.innerText = parseInt((_endTime - _startTime) / 1000);

		return true;
	}
	return false;
}

const _playagain = document.querySelector('#play-again-button');
_playagain.addEventListener('click', reset);

const restart = document.querySelector('.restart');
restart.addEventListener('click', reset);
