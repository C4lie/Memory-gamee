// JavaScript code for Memory Card Game

// DOM Elements
const gameBoard = document.getElementById('game-board');
const moveCount = document.getElementById('move-count');
const timeBar = document.getElementById('time-bar');
const timeLeft = document.getElementById('time-left');
const newGameButton = document.getElementById('new-game');
const peekButton = document.getElementById('peek');
const undoButton = document.getElementById('undo');
const hintButton = document.getElementById('hint');
const themeSelect = document.getElementById('theme-select');
const congratsMessage = document.getElementById('congratulations');
const playAgainButton = document.getElementById('play-again');

// Game variables
let cardArray = [];
let flippedCards = [];
let matchedCards = [];
let moves = 0;
let timerInterval;
let timeRemaining = 60; // Seconds
let hintUsed = false;
let undoStack = [];
let isPeeking = false;

// Card themes
const themes = {
  animals: ['🐶', '🐱', '🐭', '🐰', '🐻', '🐼', '🐨', '🐸'],
  superheroes: ['🦸‍♂️', '🦸‍♀️', '🦹‍♂️', '🦹‍♀️', '🦇', '🕷️', '🛡️', '⚡'],
  flags: ['🇺🇸', '🇬🇧', '🇮🇳', '🇯🇵', '🇨🇦', '🇧🇷', '🇩🇪', '🇫🇷'],
};

// Initialize game
function initGame() {
  // Reset all variables and UI
  moves = 0;
  moveCount.textContent = moves;
  timeRemaining = 60;
  timeLeft.textContent = `${timeRemaining}s`;
  timeBar.value = 100;
  clearInterval(timerInterval);
  matchedCards = [];
  flippedCards = [];
  undoStack = [];
  isPeeking = false;
  hintUsed = false;
  congratsMessage.classList.add('hidden');

  // Get selected theme and create card array
  const theme = themes[themeSelect.value];
  cardArray = shuffleCards([...theme, ...theme]); // Duplicate for pairs

  // Create card elements
  gameBoard.innerHTML = '';
  cardArray.forEach((symbol, index) => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.dataset.symbol = symbol;
    card.innerHTML = `
            <div class="card-inner">
                <div class="card-front">?</div>
                <div class="card-back">${symbol}</div>
            </div>
        `;
    card.addEventListener('click', () => flipCard(card, index));
    gameBoard.appendChild(card);
  });

  // Start timer
  startTimer();
}

// Shuffle cards
function shuffleCards(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Card flip logic
function flipCard(card, index) {
  if (
    flippedCards.length < 2 &&
    !card.classList.contains('flipped') &&
    !isPeeking
  ) {
    card.classList.add('flipped');
    flippedCards.push({ card, index });

    if (flippedCards.length === 2) {
      checkForMatch();
    }
  }
}

// Check if flipped cards match
function checkForMatch() {
  const [card1, card2] = flippedCards;

  if (card1.card.dataset.symbol === card2.card.dataset.symbol) {
    matchedCards.push(card1.index, card2.index);
    flippedCards = [];
    undoStack = [];
    if (matchedCards.length === cardArray.length) {
      endGame();
    }
  } else {
    undoStack.push([...flippedCards]);
    setTimeout(() => {
      card1.card.classList.remove('flipped');
      card2.card.classList.remove('flipped');
      flippedCards = [];
    }, 1000);
  }

  moves++;
  moveCount.textContent = moves;
}

// Start game timer
function startTimer() {
  timerInterval = setInterval(() => {
    timeRemaining--;
    timeLeft.textContent = `${timeRemaining}s`;
    timeBar.value = (timeRemaining / 60) * 100;

    if (timeRemaining <= 0) {
      clearInterval(timerInterval);
      alert('Time is up! You lost!');
      initGame();
    }
  }, 1000);
}

// End game and show congratulations
function endGame() {
  clearInterval(timerInterval);
  congratsMessage.classList.remove('hidden');
}

// Peek power-up: Show all cards for a short time
peekButton.addEventListener('click', () => {
  if (!isPeeking) {
    isPeeking = true;
    document
      .querySelectorAll('.card')
      .forEach((card) => card.classList.add('flipped'));
    setTimeout(() => {
      document.querySelectorAll('.card').forEach((card) => {
        if (!matchedCards.includes(card.dataset.index)) {
          card.classList.remove('flipped');
        }
      });
      isPeeking = false;
    }, 2000);
  }
});

// Undo power-up: Undo last mismatched pair
undoButton.addEventListener('click', () => {
  if (undoStack.length > 0) {
    const [card1, card2] = undoStack.pop();
    card1.card.classList.remove('flipped');
    card2.card.classList.remove('flipped');
    flippedCards = [];
  }
});

// Hint power-up: Reveal one matching pair
hintButton.addEventListener('click', () => {
  if (!hintUsed) {
    const unmatched = cardArray
      .map((symbol, index) => ({ symbol, index }))
      .filter((item) => !matchedCards.includes(item.index));

    if (unmatched.length >= 2) {
      const hintPair = unmatched.slice(0, 2);
      hintPair.forEach((item) => {
        const card = gameBoard.children[item.index];
        card.classList.add('flipped');
        setTimeout(() => card.classList.remove('flipped'), 1000);
      });
      hintUsed = true;
    }
  }
});

// Pop-Up DOM Elements
const popup = document.getElementById('popup');
const popupMessage = document.getElementById('popup-message');
const restartGameButton = document.getElementById('restart-game');
const newGamePopupButton = document.getElementById('new-game-popup');

// Show Pop-Up
function showPopup(message) {
  popupMessage.textContent = message;
  popup.classList.remove('hidden');
}

// Hide Pop-Up
function hidePopup() {
  popup.classList.add('hidden');
}

// End game and show pop-up
function endGame() {
  clearInterval(timerInterval);
  showPopup('Congratulations! You Won!');
}

// Time is up function
function timeIsUp() {
  clearInterval(timerInterval);
  showPopup('Time is up! You lost!');
}

// Restart game button
restartGameButton.addEventListener('click', () => {
  hidePopup();
  initGame();
});

// New Game button
newGamePopupButton.addEventListener('click', () => {
  hidePopup();
  initGame();
});

// Update the existing function to show popup on time over
function startTimer() {
  timerInterval = setInterval(() => {
    timeRemaining--;
    timeLeft.textContent = `${timeRemaining}s`;
    timeBar.value = (timeRemaining / 60) * 100;

    if (timeRemaining <= 0) {
      timeIsUp();
    }
  }, 1000);
}

// Reset game when 'New Game' button is clicked
newGameButton.addEventListener('click', initGame);

// Play again button in congratulations message
playAgainButton.addEventListener('click', initGame);

// Initialize the game for the first time
initGame();
