let currentGame = "";
let gameRunning = false;
let score = 0;
let lives = 3;
let gameLoop = null;
let keys = {};

const gameScreen = document.getElementById("game-screen");
const gameArea = document.getElementById("game-area");

document.addEventListener("keydown", e => {
    keys[e.key.toLowerCase()] = true;

    if (e.key === " " || e.key === "ArrowLeft" || e.key === "ArrowRight") {
        e.preventDefault();
    }
});

document.addEventListener("keyup", e => {
    keys[e.key.toLowerCase()] = false;
});

function goToGames() {
    document.getElementById("games").scrollIntoView({
        behavior: "smooth"
    });
}

function openGame(game) {
    currentGame = game;
    gameScreen.classList.add("active");

    const titles = {
        battle: "🎯 BATTLE ARENA",
        racing: "🏎️ SPEED RACING",
        war: "⚔️ WAR LEGENDS"
    };

    const instructions = {
        battle: "Move the mouse to aim. Click to shoot the target.",
        racing: "Use A/D or ←/→ to move. Avoid cars and rocks.",
        war: "Move with A/D or ←/→. Move mouse to aim and click to shoot."
    };

    document.getElementById("game-title").textContent = titles[game];
    document.getElementById("game-instructions").textContent = instructions[game];

    gameScreen.scrollIntoView({
        behavior: "smooth"
    });

    startGame();
}

function closeGame() {
    stopGame();

    gameArea.innerHTML = `
        <div id="game-message">
            🎮 Choose a game and press START GAME
        </div>
    `;

    gameScreen.classList.remove("active");
}

function startGame() {
    stopGame();

    gameRunning = true;
    score = 0;
    lives = 3;

    updateStats();
    gameArea.innerHTML = "";

    if (currentGame === "battle") startBattle();
    if (currentGame === "racing") startRacing();
    if (currentGame === "war") startWar();
}

function restartGame() {
    startGame();
}

function stopGame() {
    gameRunning = false;

    if (gameLoop) {
        clearInterval(gameLoop);
        gameLoop = null;
    }

    gameArea.onmousemove = null;
    gameArea.onclick = null;
}

function updateStats() {
    document.getElementById("score").textContent = score;
    document.getElementById("lives").textContent = lives;
}

/* =================================
   BATTLE ARENA
================================= */

let battleTarget;

function startBattle() {
    gameArea.innerHTML = `
        <div class="battle-arena">
            <div class="aim"></div>

            <div class="gun">
                🔫
            </div>

            <div class="target">
                🎯
            </div>
        </div>
    `;

    battleTarget = gameArea.querySelector(".target");

    moveBattleTarget();

    gameArea.onmousemove = e => {
        const rect = gameArea.getBoundingClientRect();

        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const aim = gameArea.querySelector(".aim");
        const gun = gameArea.querySelector(".gun");

        aim.style.left = x + "px";
        aim.style.top = y + "px";

        const gunX = 65;
        const gunY = gameArea.clientHeight - 45;

        const angle =
            Math.atan2(y - gunY, x - gunX) * 180 / Math.PI;

        gun.style.transform = `rotate(${angle}deg)`;
    };

    gameArea.onclick = e => {
        if (!gameRunning) return;

        if (e.target === battleTarget) {
            score += 10;
            updateStats();

            battleTarget.style.transform = "scale(1.4)";

            setTimeout(() => {
                if (gameRunning) {
                    battleTarget.style.transform = "scale(1)";
                    moveBattleTarget();
                }
            }, 120);

        } else if (
            !e.target.classList.contains("aim") &&
            !e.target.classList.contains("gun")
        ) {
            lives--;
            updateStats();

            if (lives <= 0) {
                gameOver();
            }
        }
    };
}

function moveBattleTarget() {
    if (!battleTarget) return;

    const maxX = Math.max(
        10,
        gameArea.clientWidth - 80
    );

    const maxY = Math.max(
        80,
        gameArea.clientHeight - 130
    );

    battleTarget.style.left =
        Math.random() * maxX + "px";

    battleTarget.style.top =
        40 + Math.random() * maxY + "px";
}

/* =================================
   SPEED RACING
================================= */

let playerCar;
let trafficCars = [];
let racingRocks = [];

function startRacing() {
    trafficCars = [];
    racingRocks = [];

    gameArea.innerHTML = `
        <div class="race-game">

            <div class="road">
                <div class="road-mark mark1"></div>
                <div class="road-mark mark2"></div>
                <div class="road-mark mark3"></div>
            </div>

            <div class="player-car">
                🏎️
            </div>

        </div>
    `;

    playerCar =
        gameArea.querySelector(".player-car");

    playerCar.style.left = "50%";

    gameLoop =
        setInterval(racingLoop, 30);
}

function racingLoop() {
    if (!gameRunning) return;

    let left =
        parseFloat(playerCar.style.left) || 50;

    if (keys["a"] || keys["arrowleft"]) {
        left -= 1.3;
    }

    if (keys["d"] || keys["arrowright"]) {
        left += 1.3;
    }

    left = Math.max(27, Math.min(73, left));

    playerCar.style.left = left + "%";

    if (Math.random() < 0.025) {
        createTrafficCar();
    }

    if (Math.random() < 0.012) {
        createRock();
    }

    moveTraffic();
    moveRocks();
}

function createTrafficCar() {
    const car = document.createElement("div");

    car.className = "traffic-car";
    car.textContent =
        Math.random() > 0.5 ? "🚗" : "🚙";

    car.style.left =
        (27 + Math.random() * 46) + "%";

    car.style.top = "-70px";

    gameArea.appendChild(car);
    trafficCars.push(car);
}

function createRock() {
    const rock = document.createElement("div");

    rock.className = "rock";
    rock.textContent = "🪨";

    rock.style.left =
        (27 + Math.random() * 46) + "%";

    rock.style.top = "-60px";

    gameArea.appendChild(rock);
    racingRocks.push(rock);
}

function moveTraffic() {
    trafficCars.forEach((car, index) => {

        let top =
            parseFloat(car.style.top);

        top += 5;

        car.style.top = top + "px";

        if (checkCollision(playerCar, car)) {

            car.remove();
            trafficCars.splice(index, 1);

            lives--;
            updateStats();

            if (lives <= 0) {
                gameOver();
            }

            return;
        }

        if (top > gameArea.clientHeight) {

            car.remove();
            trafficCars.splice(index, 1);

            score += 5;
            updateStats();
        }
    });
}

function moveRocks() {
    racingRocks.forEach((rock, index) => {

        let top =
            parseFloat(rock.style.top);

        top += 6;

        rock.style.top = top + "px";

        if (checkCollision(playerCar, rock)) {

            rock.remove();
            racingRocks.splice(index, 1);

            lives--;
            updateStats();

            if (lives <= 0) {
                gameOver();
            }

            return;
        }

        if (top > gameArea.clientHeight) {

            rock.remove();
            racingRocks.splice(index, 1);

            score += 3;
            updateStats();
        }
    });
}

/* =================================
   WAR LEGENDS
================================= */

let warPlayer;
let warEnemies = [];
let warBullets = [];

function startWar() {
    warEnemies = [];
    warBullets = [];

    gameArea.innerHTML = `
        <div class="war-game">

            <div class="war-player">
                🪖
            </div>

            <div class="war-gun">
                🔫
            </div>

            <div class="war-crosshair"></div>

        </div>
    `;

    warPlayer =
        gameArea.querySelector(".war-player");

    warPlayer.style.left = "50%";

    gameArea.onmousemove = e => {

        const rect =
            gameArea.getBoundingClientRect();

        const x =
            e.clientX - rect.left;

        const y =
            e.clientY - rect.top;

        const crosshair =
            gameArea.querySelector(".war-crosshair");

        crosshair.style.left = x + "px";
        crosshair.style.top = y + "px";

        const px =
            warPlayer.offsetLeft + 25;

        const py =
            warPlayer.offsetTop + 25;

        const angle =
            Math.atan2(y - py, x - px);

        const gun =
            gameArea.querySelector(".war-gun");

        gun.style.left =
            (warPlayer.offsetLeft + 20) + "px";

        gun.style.top =
            (warPlayer.offsetTop - 5) + "px";

        gun.style.transform =
            `rotate(${angle}rad)`;
    };

    gameArea.onclick = e => {

        if (!gameRunning) return;

        if (
            e.target.classList.contains("war-crosshair") ||
            e.target.closest(".war-game")
        ) {
            shootWar();
        }
    };

    gameLoop =
        setInterval(warLoop, 30);
}

function shootWar() {

    const bullet =
        document.createElement("div");

    bullet.className = "bullet";

    bullet.style.left =
        (warPlayer.offsetLeft + 25) + "px";

    bullet.style.top =
        (warPlayer.offsetTop - 10) + "px";

    gameArea.appendChild(bullet);

    warBullets.push(bullet);
}

function warLoop() {
    if (!gameRunning) return;

    let left =
        parseFloat(warPlayer.style.left) || 50;

    if (keys["a"] || keys["arrowleft"]) {
        left -= 1;
    }

    if (keys["d"] || keys["arrowright"]) {
        left += 1;
    }

    left = Math.max(5, Math.min(90, left));

    warPlayer.style.left = left + "%";

    if (Math.random() < 0.025) {
        createWarEnemy();
    }

    moveWarBullets();
    moveWarEnemies();
}

function createWarEnemy() {

    const enemy =
        document.createElement("div");

    enemy.className = "war-enemy";
    enemy.textContent = "👾";

    enemy.style.left =
        (5 + Math.random() * 85) + "%";

    enemy.style.top = "-60px";

    gameArea.appendChild(enemy);

    warEnemies.push(enemy);
}

function moveWarBullets() {

    warBullets.forEach((bullet, bi) => {

        let top =
            parseFloat(bullet.style.top);

        top -= 10;

        bullet.style.top =
            top + "px";

        warEnemies.forEach((enemy, ei) => {

            if (checkCollision(bullet, enemy)) {

                bullet.remove();
                enemy.remove();

                warBullets.splice(bi, 1);
                warEnemies.splice(ei, 1);

                score += 10;
                updateStats();
            }
        });

        if (top < -30) {

            bullet.remove();
            warBullets.splice(bi, 1);
        }
    });
}

function moveWarEnemies() {

    warEnemies.forEach((enemy, index) => {

        let top =
            parseFloat(enemy.style.top);

        top += 3;

        enemy.style.top =
            top + "px";

        if (checkCollision(warPlayer, enemy)) {

            enemy.remove();
            warEnemies.splice(index, 1);

            lives--;
            updateStats();

            if (lives <= 0) {
                gameOver();
            }

            return;
        }

        if (top > gameArea.clientHeight) {

            enemy.remove();
            warEnemies.splice(index, 1);

            lives--;
            updateStats();

            if (lives <= 0) {
                gameOver();
            }
        }
    });
}

/* =================================
   COLLISION
================================= */

function checkCollision(a, b) {

    if (!a || !b) return false;

    const r1 =
        a.getBoundingClientRect();

    const r2 =
        b.getBoundingClientRect();

    return !(
        r1.right < r2.left ||
        r1.left > r2.right ||
        r1.bottom < r2.top ||
        r1.top > r2.bottom
    );
}

/* =================================
   GAME OVER
================================= */

function gameOver() {

    gameRunning = false;

    clearInterval(gameLoop);

    gameLoop = null;

    gameArea.innerHTML = `
        <div id="game-message">

            <h2 style="color:#00ffcc;">
                🎮 GAME OVER
            </h2>

            <p>
                🏆 Final Score:
                <strong>${score}</strong>
            </p>

            <br>

            <button onclick="restartGame()">
                🔄 PLAY AGAIN
            </button>

        </div>
    `;
}

/* =================================
   CONTACT
================================= */

function contactUs() {

    window.location.href =
        "mailto:hjjbnjhgghh@gmail.com";
}
