const cells = document.querySelectorAll("[data-cell]");
const message = document.getElementById("message");
const winnerText = document.getElementById("winnerText");
const restartBtn = document.getElementById("restartBtn");
const undoBtn = document.getElementById("undoBtn");
const historyBtn = document.getElementById("historyBtn");
const historyPanel = document.getElementById("historyPanel");
const historyList = document.getElementById("historyList");
const clearHistoryBtn = document.getElementById("clearHistory");

let isOTurn = false;
let moveHistory = []; // track moves for undo

const winningCombinations = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

startGame();

function startGame() {
  isOTurn = false;
  moveHistory = [];
  cells.forEach(cell => {
    cell.classList.remove("x", "o");
    cell.textContent = "";
    cell.addEventListener("click", handleClick, { once: true });
  });
  message.style.display = "none";
}

function handleClick(e) {
  const cell = e.target;
  const currentClass = isOTurn ? "o" : "x";
  placeMark(cell, currentClass);
  moveHistory.push({ cell, player: currentClass });

  if (checkWin(currentClass)) {
    endGame(false);
  } else if (isDraw()) {
    endGame(true);
  } else {
    isOTurn = !isOTurn;
  }
}

function placeMark(cell, currentClass) {
  cell.classList.add(currentClass);
  cell.textContent = currentClass.toUpperCase();
}

function checkWin(currentClass) {
  return winningCombinations.some(combination =>
    combination.every(index => cells[index].classList.contains(currentClass))
  );
}

function isDraw() {
  return [...cells].every(cell =>
    cell.classList.contains("x") || cell.classList.contains("o")
  );
}

function endGame(draw) {
  let resultText;
  if (draw) {
    resultText = "It's a Draw!";
  } else {
    resultText = `${isOTurn ? "O" : "X"} Wins! 🎉`;
  }
  winnerText.textContent = resultText;
  message.style.display = "block";

  // Add result to history
  const li = document.createElement("li");
  li.textContent = resultText;
  historyList.appendChild(li);

  // Auto restart after 2 seconds
  setTimeout(startGame, 500);
}

// Restart button
restartBtn.addEventListener("click", startGame);

// Undo button
undoBtn.addEventListener("click", () => {
  if (moveHistory.length === 0) return;
  const lastMove = moveHistory.pop();
  lastMove.cell.classList.remove("x", "o");
  lastMove.cell.textContent = "";
  lastMove.cell.addEventListener("click", handleClick, { once: true });
  isOTurn = lastMove.player === "o"; // revert turn
});

// Toggle history panel
historyBtn.addEventListener("click", () => {
  historyPanel.style.display =
    historyPanel.style.display === "none" || historyPanel.style.display === ""
      ? "block"
      : "none";
});

// Clear history
clearHistoryBtn.addEventListener("click", () => {
  historyList.innerHTML = "";
  historyPanel.style.display = "none"; // auto close history panel
});

