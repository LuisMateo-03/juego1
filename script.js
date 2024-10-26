let cards = [];
let flippedCards = [];
let currentPlayerIndex = 0;
let players = [];
let scores = [];
let timer;
let time = 30;

// Agregar jugador
document.getElementById("addPlayerBtn").addEventListener("click", function() {
    const playerName = document.getElementById("playerName").value;
    if (playerName) {
        players.push(playerName);
        scores.push(0);
        document.getElementById("playerName").value = "";
        updateRanking();
    }
});

// Iniciar el juego
document.getElementById("startBtn").addEventListener("click", startGame);
document.getElementById("restartBtn").addEventListener("click", resetGame);
document.getElementById("backToStartBtn").addEventListener("click", backToStart);

function startGame() {
    if (players.length === 0) {
        alert("Por favor, añade al menos un jugador.");
        return;
    }

    time = parseInt(document.getElementById("timerInput").value) || 30; // Obtener tiempo del input
    document.getElementById("playerSection").style.display = "none"; // Ocultar sección de jugadores
    resetGame();
    shuffleCards();
    createBoard();
    startTimer();
    updateTurnIndicator();
}

function shuffleCards() {
    const cardValues = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    cards = [...cardValues, ...cardValues]; // Duplicar para pares
    cards.sort(() => Math.random() - 0.5); // Mezclar cartas
}

function createBoard() {
    const board = document.getElementById("board");
    board.innerHTML = ''; // Limpiar el tablero

    cards.forEach((value, index) => {
        const card = document.createElement("div");
        card.classList.add("card");
        card.setAttribute("data-value", value);
        card.addEventListener("click", () => flipCard(card));
        board.appendChild(card);
    });
}

function flipCard(card) {
    if (flippedCards.length < 2 && !card.classList.contains("flipped")) {
        card.classList.add("flipped");
        card.textContent = card.getAttribute("data-value");
        flippedCards.push(card);

        if (flippedCards.length === 2) {
            setTimeout(checkMatch, 1000);
        }
    }
}

function checkMatch() {
    const [firstCard, secondCard] = flippedCards;

    if (firstCard.getAttribute("data-value") === secondCard.getAttribute("data-value")) {
        scores[currentPlayerIndex]++;
        updateRanking();
        flippedCards = [];
    } else {
        firstCard.classList.remove("flipped");
        secondCard.classList.remove("flipped");
        firstCard.textContent = '?';
        secondCard.textContent = '?';
        flippedCards = [];
        currentPlayerIndex = (currentPlayerIndex + 1) % players.length; // Cambiar de jugador
        updateTurnIndicator();
    }
}

function updateRanking() {
    const ranking = document.getElementById("ranking");
    ranking.innerHTML = "<h2>Ranking</h2>";
    players.forEach((player, index) => {
        ranking.innerHTML += `<p>${player}: ${scores[index]} puntos</p>`;
    });
}

function updateTurnIndicator() {
    const turnIndicator = document.getElementById("turnIndicator");
    if (!turnIndicator) {
        const newIndicator = document.createElement("div");
        newIndicator.id = "turnIndicator";
        newIndicator.innerText = `Turno de: ${players[currentPlayerIndex]}`;
        document.querySelector(".game-container").insertBefore(newIndicator, document.getElementById("timer"));
    } else {
        turnIndicator.innerText = `Turno de: ${players[currentPlayerIndex]}`;
    }
}

function startTimer() {
    document.getElementById("timer").textContent = `Tiempo: ${time} segundos`;
    timer = setInterval(() => {
        time--;
        document.getElementById("timer").textContent = `Tiempo: ${time} segundos`;

        if (time <= 0) {
            clearInterval(timer);
            alert("¡Tiempo agotado!");
            endGame();
        }
    }, 1000);
}

function resetGame() {
    clearInterval(timer);
    time = parseInt(document.getElementById("timerInput").value) || 30; // Obtener nuevo tiempo
    currentPlayerIndex = 0;
    flippedCards = [];
    scores = Array(players.length).fill(0);
    updateRanking();
    createBoard();
    document.getElementById("restartBtn").style.display = "none";
    document.getElementById("backToStartBtn").style.display = "none"; // Ocultar botón de volver al inicio
    document.getElementById("timer").style.display = "block";
    updateTurnIndicator(); // Mostrar turno al reiniciar
}

function endGame() {
    clearInterval(timer);
    document.getElementById("restartBtn").style.display = "block";
    document.getElementById("backToStartBtn").style.display = "block"; // Mostrar botón de volver al inicio
    document.getElementById("timer").style.display = "none";
    const winnerIndex = scores.indexOf(Math.max(...scores));
    showModal(`${players[winnerIndex]} ha ganado con ${scores[winnerIndex]} puntos!`);
}

function backToStart() {
    // Volver a la pantalla de inicio
    document.getElementById("playerSection").style.display = "block";
    document.getElementById("restartBtn").style.display = "none";
    document.getElementById("backToStartBtn").style.display = "none";
    document.getElementById("turnIndicator").innerHTML = ""; // Limpiar indicador de turno
    document.getElementById("board").innerHTML = ""; // Limpiar el tablero
    document.getElementById("ranking").innerHTML = ""; // Limpiar el ranking
    document.getElementById("timer").innerHTML = ""; // Limpiar el temporizador
}

function showModal(message) {
    const modal = document.getElementById("modal");
    const modalMessage = document.getElementById("modalMessage");
    modalMessage.textContent = message;
    modal.style.display = "block";
}

document.querySelector(".close").addEventListener("click", function() {
    document.getElementById("modal").style.display = "none";
});
window.onclick = function(event) {
    if (event.target === document.getElementById("modal")) {
        document.getElementById("modal").style.display = "none";
    }
};
function showModal(message) {
    const modal = document.getElementById("modal");
    const modalMessage = document.getElementById("modalMessage");
    modalMessage.textContent = message;
    modal.style.display = "block";
    modal.classList.add("modal-animated");

    // Alert con un estilo mejorado
    alert(`¡${message}!`); // Esto muestra un alert estándar
}

document.querySelector(".close").addEventListener("click", function() {
    document.getElementById("modal").style.display = "none";
});

// Cerrar modal al hacer clic fuera de él
window.onclick = function(event) {
    if (event.target === document.getElementById("modal")) {
        document.getElementById("modal").style.display = "none";
    }
};
