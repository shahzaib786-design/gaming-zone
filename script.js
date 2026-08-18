let currentGame = "";
let gameRunning = false;

let score = 0;
let lives = 3;

let gameLoop;
let keys = {};

const gameScreen = document.getElementById("game-screen");
const gameArea = document.getElementById("game-area");

document.addEventListener("keydown", function (e) {
    keys[e.key.toLowerCase()] = true;

    if (
        e.key === "ArrowLeft" ||
        e.key === "ArrowRight" ||
        e.key === " "
    ) {
        e.preventDefault();
    }
});

document.addEventListener("keyup", function (e) {
    keys[e.key.toLowerCase()] = false;
});


/* =========================
   WEBSITE
========================= */

function goToGames() {

    document.getElementById("games").scrollIntoView({
        behavior: "smooth"
    });

}


function openGame(game) {

    currentGame = game;

    gameScreen.classList.add("active");

    if (game === "battle") {

        document.getElementById("game-title").textContent =
            "🎯 BATTLE ARENA";

        document.getElementById("game-instructions").textContent =
            "Click the targets. Misses cost a life. No timer.";

    }

    if (game === "racing") {

        document.getElementById("game-title").textContent =
            "🏎️ SPEED RACING";

        document.getElementById("game-instructions").textContent =
            "Use A/D or ←/→ to move your car and avoid enemy cars.";

    }

    if (game === "war") {

        document.getElementById("game-title").textContent =
            "⚔️ WAR LEGENDS";

        document.getElementById("game-instructions").textContent =
            "Move with A/D or ←/→ and press SPACE to attack.";

    }

    gameScreen.scrollIntoView({
        behavior: "smooth"
    });

    startGame();
}


function closeGame() {

    gameRunning = false;

    clearInterval(gameLoop);

    gameArea.innerHTML = `
        <div id="game-message">
            🎮 Choose a game and press
            <strong>START GAME</strong>
        </div>
    `;

    gameScreen.classList.remove("active");

}


function startGame() {

    clearInterval(gameLoop);

    gameRunning = true;

    score = 0;
    lives = 3;

    updateStats();

    gameArea.innerHTML = "";

    if (currentGame === "battle") {
        startBattle();
    }

    if (currentGame === "racing") {
        startRacing();
    }

    if (currentGame === "war") {
        startWar();
    }

}


function restartGame() {

    startGame();

}


function updateStats() {

    document.getElementById("score").textContent = score;

    document.getElementById("lives").textContent = lives;

}


/* =========================
   BATTLE ARENA
========================= */

let battleTarget;
let battleMisses = 0;


function startBattle() {

    gameArea.innerHTML = "";

    createBattleTarget();

    battleMisses = 0;

}


function createBattleTarget() {

    if (!gameRunning) return;

    if (battleTarget) {
        battleTarget.remove();
    }

    battleTarget = document.createElement("div");

    battleTarget.className = "target";

    const maxX = gameArea.clientWidth - 65;
    const maxY = gameArea.clientHeight - 65;

    battleTarget.style.left =
        Math.random() * maxX + "px";

    battleTarget.style.top =
        Math.random() * maxY + "px";


    battleTarget.onclick = function (event) {

        event.stopPropagation();

        score++;

        updateStats();

        createBattleTarget();

    };


    gameArea.appendChild(battleTarget);

}


/* Clicking empty space = miss */

gameArea.addEventListener("click", function (event) {

    if (!gameRunning) return;

    if (currentGame !== "battle") return;

    if (event.target === gameArea) {

        lives--;

        updateStats();

        if (lives <= 0) {

            gameOver();

        }

    }

});


/* =========================
   SPEED RACING
========================= */

let playerCar;
let enemyCars = [];

let racingPosition = 0;
let racingFrames = 0;


function startRacing() {

    gameArea.innerHTML = "";

    enemyCars = [];

    racingPosition = 0;

    racingFrames = 0;


    const road = document.createElement("div");

    road.className = "road";

    gameArea.appendChild(road);


    playerCar = document.createElement("div");

    playerCar.className = "player-car";

    playerCar.style.left = "calc(50% - 22px)";

    playerCar.style.bottom = "25px";

    gameArea.appendChild(playerCar);


    gameLoop = setInterval(racingLoop, 30);

}


function racingLoop() {

    if (!gameRunning) return;


    racingFrames++;

    /* Player movement */

    let currentLeft =
        parseFloat(playerCar.style.left);


    if (keys["a"] || keys["arrowleft"]) {

        currentLeft -= 7;

    }


    if (keys["d"] || keys["arrowright"]) {

        currentLeft += 7;

    }


    const roadLeft =
        gameArea.clientWidth * 0.225;

    const roadRight =
        gameArea.clientWidth * 0.775 - 45;


    currentLeft =
        Math.max(
            roadLeft,
            Math.min(roadRight, currentLeft)
        );


    playerCar.style.left =
        currentLeft + "px";


    /* Spawn enemy */

    if (racingFrames % 35 === 0) {

        createEnemyCar();

    }


    /* Move enemies */

    enemyCars.forEach(function (enemy) {

        let top =
            parseFloat(enemy.style.top);

        top += 6;

        enemy.style.top =
            top + "px";


        /* Collision */

        if (checkCollision(playerCar, enemy)) {

            enemy.remove();

            enemyCars =
                enemyCars.filter(e => e !== enemy);

            lives--;

            updateStats();

            if (lives <= 0) {

                gameOver();

            }

        }


        /* Passed enemy */

        if (top > gameArea.clientHeight) {

            enemy.remove();

            enemyCars =
                enemyCars.filter(e => e !== enemy);

            score++;

            updateStats();

        }

    });

}


function createEnemyCar() {

    const enemy =
        document.createElement("div");

    enemy.className = "enemy-car";

    const roadLeft =
        gameArea.clientWidth * 0.225;

    const roadWidth =
        gameArea.clientWidth * 0.55;


    enemy.style.left =
        roadLeft +
        Math.random() *
        (roadWidth - 45) +
        "px";


    enemy.style.top = "-80px";


    gameArea.appendChild(enemy);

    enemyCars.push(enemy);

}


function checkCollision(a, b) {

    const aRect =
        a.getBoundingClientRect();

    const bRect =
        b.getBoundingClientRect();


    return !(
        aRect.right < bRect.left ||
        aRect.left > bRect.right ||
        aRect.bottom < bRect.top ||
        aRect.top > bRect.bottom
    );

}


/* =========================
   WAR LEGENDS
========================= */

let player;
let enemies = [];
let bullets = [];

let warFrame = 0;


function startWar() {

    gameArea.innerHTML = "";

    enemies = [];

    bullets = [];

    warFrame = 0;


    player =
        document.createElement("div");

    player.className = "player";

    player.style.left =
        "calc(50% - 20px)";

    player.style.bottom =
        "20px";


    gameArea.appendChild(player);


    gameLoop =
        setInterval(warLoop, 30);

}


function warLoop() {

    if (!gameRunning) return;


    warFrame++;


    /* Player movement */

    let left =
        parseFloat(player.style.left);


    if (keys["a"] || keys["arrowleft"]) {

        left -= 6;

    }


    if (keys["d"] || keys["arrowright"]) {

        left += 6;

    }


    left =
        Math.max(
            0,
            Math.min(
                gameArea.clientWidth - 40,
                left
            )
        );


    player.style.left =
        left + "px";


    /* Attack */

    if (
        keys[" "] &&
        warFrame % 10 === 0
    ) {

        createBullet();

    }


    /* Spawn enemies */

    if (warFrame % 35 === 0) {

        createEnemy();

    }


    moveBullets();

    moveEnemies();

    checkWarCollisions();

}


function createBullet() {

    const bullet =
        document.createElement("div");

    bullet.className = "bullet";

    bullet.style.left =
        (
            parseFloat(player.style.left) +
            17
        ) + "px";


    bullet.style.top =
        (
            parseFloat(player.style.top) ||
            gameArea.clientHeight - 60
        ) + "px";


    gameArea.appendChild(bullet);

    bullets.push(bullet);

}


function moveBullets() {

    bullets.forEach(function (bullet) {

        let top =
            parseFloat(bullet.style.top);

        top -= 9;

        bullet.style.top =
            top + "px";


        if (top < -20) {

            bullet.remove();

            bullets =
                bullets.filter(
                    b => b !== bullet
                );

        }

    });

}


function createEnemy() {

    const enemy =
        document.createElement("div");

    enemy.className = "enemy";

    enemy.style.left =
        Math.random() *
        (gameArea.clientWidth - 40) +
        "px";


    enemy.style.top =
        "-50px";


    gameArea.appendChild(enemy);

    enemies.push(enemy);

}


function moveEnemies() {

    enemies.forEach(function (enemy) {

        let top =
            parseFloat(enemy.style.top);

        top += 3;

        enemy.style.top =
            top + "px";


        if (top >
            gameArea.clientHeight) {

            enemy.remove();

            enemies =
                enemies.filter(
                    e => e !== enemy
                );

            lives--;

            updateStats();


            if (lives <= 0) {

                gameOver();

            }

        }

    });

}


function checkWarCollisions() {

    bullets.forEach(function (bullet) {

        enemies.forEach(function (enemy) {

            if (
                checkCollision(
                    bullet,
                    enemy
                )
            ) {

                bullet.remove();

                enemy.remove();


                bullets =
                    bullets.filter(
                        b => b !== bullet
                    );


                enemies =
                    enemies.filter(
                        e => e !== enemy
                    );


                score += 10;

                updateStats();

            }

        });

    });


    enemies.forEach(function (enemy) {

        if (
            checkCollision(
                player,
                enemy
            )
        ) {

            enemy.remove();

            enemies =
                enemies.filter(
                    e => e !== enemy
                );


            lives--;

            updateStats();


            if (lives <= 0) {

                gameOver();

            }

        }

    });

}


/* =========================
   GAME OVER
========================= */

function gameOver() {

    gameRunning = false;

    clearInterval(gameLoop);


    gameArea.innerHTML = `

        <div id="game-message">

            <h2 style="color:#00ffcc;">
                🎮 GAME OVER
            </h2>

            <br>

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


/* =========================
   CONTACT
========================= */

function contactUs() {

    alert(
        "🎮 Thanks for visiting Shahzaib Gaming!"
    );

}