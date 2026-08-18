let score = 0;
let lives = 3;
let gameRunning = false;
let targetInterval;


function startGaming() {

    document.getElementById("games").scrollIntoView({
        behavior: "smooth"
    });

}


function openBattleArena() {

    document.getElementById("battleArena").scrollIntoView({
        behavior: "smooth"
    });

}


function startBattleGame() {

    score = 0;
    lives = 3;
    gameRunning = true;

    document.getElementById("score").textContent = score;
    document.getElementById("lives").textContent = lives;

    const gameArea = document.getElementById("gameArea");

    gameArea.innerHTML = "";

    createTarget();

    clearInterval(targetInterval);

    targetInterval = setInterval(() => {

        if (gameRunning) {
            createTarget();
        }

    }, 1200);

}


function createTarget() {

    if (!gameRunning) return;

    const gameArea = document.getElementById("gameArea");

    const target = document.createElement("div");

    target.classList.add("target");

    const maxX = gameArea.clientWidth - 60;
    const maxY = gameArea.clientHeight - 60;

    target.style.left =
        Math.random() * maxX + "px";

    target.style.top =
        Math.random() * maxY + "px";


    target.onclick = function(event) {

        event.stopPropagation();

        score++;

        document.getElementById("score").textContent = score;

        target.remove();

    };


    gameArea.appendChild(target);

}


document.getElementById("gameArea").onclick = function() {

    if (!gameRunning) return;

    lives--;

    document.getElementById("lives").textContent = lives;

    if (lives <= 0) {

        gameOver();

    }

};


function gameOver() {

    gameRunning = false;

    clearInterval(targetInterval);

    const gameArea = document.getElementById("gameArea");

    gameArea.innerHTML = `
        <div id="gameMessage">
            🎮 GAME OVER<br><br>
            🏆 Your Score: ${score}
        </div>
    `;

}


function restartBattleGame() {

    clearInterval(targetInterval);

    score = 0;
    lives = 3;
    gameRunning = false;

    document.getElementById("score").textContent = score;
    document.getElementById("lives").textContent = lives;

    document.getElementById("gameArea").innerHTML = `
        <div id="gameMessage">
            Click START GAME to begin
        </div>
    `;

}


function comingSoon(gameName) {

    alert("🎮 " + gameName + " is coming soon!");

}


function contactUs() {

    alert("📩 Thanks for contacting Shahzaib Gaming!");

}