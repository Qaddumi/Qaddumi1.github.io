const symbols = [
  "🇺🇸", "🇺🇸",
  "🇬🇧", "🇬🇧",
  "🇧🇩", "🇧🇩",
  "🇸🇦", "🇸🇦",
  "🇯🇴", "🇯🇴",
  "🇲🇽", "🇲🇽"
];

let cards = [];
let firstCard = null;
let secondCard = null;
let currentPlayer = 1;
let player1Score = 0;
let player2Score = 0;
let canClick = true;

const board = document.getElementById("board");
const turnText = document.getElementById("turn");
const scoreText = document.getElementById("score");
const messageText = document.getElementById("message");

window.onload = startGame;


function startGame() {
  cards = shuffle(symbols.slice());
  firstCard = null;
  secondCard = null;
  currentPlayer = 1;
  player1Score = 0;
  player2Score = 0;
  canClick = true;

  messageText.textContent = "Find matching pairs!";
  updateText();
  drawBoard();
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let randomIndex = Math.floor(Math.random() * (i + 1));
    let temp = array[i];
    array[i] = array[randomIndex];
    array[randomIndex] = temp;
  }
  return array;
}

function drawBoard() {
  board.innerHTML = "";

  for (let i = 0; i < cards.length; i++) {
    let card = document.createElement("div");
    card.className = "card";
    card.dataset.index = i;

    if (cards[i] === "") {
      card.classList.add("matched");
      card.textContent = "";
    } else if (i === firstCard || i === secondCard) {
      card.classList.add("flipped");
      card.textContent = cards[i];
    } else {
      card.textContent = "?";
    }

    card.addEventListener("click", flipCard);
    board.appendChild(card);
  }
}

function flipCard(event) {
  if (!canClick) return;

  let index = Number(event.currentTarget.dataset.index);

  if (cards[index] === "") return;
  if (index === firstCard) return;

  if (firstCard === null) {
    firstCard = index;
    drawBoard();
    return;
  }

  if (secondCard === null) {
    secondCard = index;
    canClick = false;
    drawBoard();
    checkMatch();
  }
}

function checkMatch() {
  if (cards[firstCard] === cards[secondCard]) {
    if (currentPlayer === 1) {
      player1Score++;
    } else {
      player2Score++;
    }

    messageText.textContent = "Match! Player " + currentPlayer + " goes again.";

    setTimeout(function () {
      cards[firstCard] = "";
      cards[secondCard] = "";
      firstCard = null;
      secondCard = null;
      canClick = true;

      updateText();
      drawBoard();
      checkWinner();
    }, 500);
  } else {
    messageText.textContent = "No match.";

    setTimeout(function () {
      firstCard = null;
      secondCard = null;
      currentPlayer = currentPlayer === 1 ? 2 : 1;
      canClick = true;

      updateText();
      drawBoard();
    }, 1000);
  }
}

function updateText() {
  turnText.textContent = "Player " + currentPlayer + "'s Turn";
  scoreText.textContent =
    "Player 1: " + player1Score + " | Player 2: " + player2Score;
}

function checkWinner() {
  let gameOver = true;

  for (let i = 0; i < cards.length; i++) {
    if (cards[i] !== "") {
      gameOver = false;
      break;
    }
  }

  if (gameOver) {
    turnText.textContent = "Game Over";

    if (player1Score > player2Score) {
      messageText.textContent = "Player 1 Wins!";
    } else if (player2Score > player1Score) {
      messageText.textContent = "Player 2 Wins!";
    } else {
      messageText.textContent = "Tie Game!";
    }
  }
}