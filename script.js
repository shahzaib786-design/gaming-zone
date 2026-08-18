let currentGame = "";
let gameRunning = false;
let score = 0;
let lives = 3;
let gameLoop = null;
let keys = {};

let battleTarget = null;
let playerCar = null;
let trafficCars = [];
let racingRocks = [];

let warPlayer = null;
let warGun = null;
let warEnemies = [];
let warBullets = [];

let mouseX = 0;
let mouseY = 0;

const gameScreen = document.getElementById("game-screen");
const gameArea = document.getElementById("game-area");

document.addEventListener("keydown", (e) => {
    keys[e.key.toLowerCase()] = true;

    if (
        e.key === " " ||
        e.key === "ArrowLeft" ||
        e.key === "ArrowRight" ||
        e.key === "ArrowUp" ||
        e.key === "ArrowDown"
    ) {
        e.preventDefault();
    }
});

document.addEventListener("keyup", (e) => {
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
        battle: "Move your mouse to aim and click the target.",
        racing: "Use A/D or ←/→ to move your car. Avoid traffic!",
        war: "Move with A/D or ←/→. Aim with mouse and click to shoot."
    };

    document.getElementById("game-title").textContent =
        titles[game] || "🎮 GAME";

    document.getElementById("game-instructions").textContent =
        instructions[game] || "";

    gameScreen.scrollIntoView({
        behavior: "smooth"
    });

    startGame();
}

function closeGame() {
    stopGame();

    gameArea.innerHTML = `
        <div id="game-message">
            🎮 Choose a game and press <strong>START GAME</strong>
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

function stopGame() {
    gameRunning = false;

    if (gameLoop) {
        clearInterval(gameLoop);
        gameLoop = null;
    }

    gameArea.onmousemove = null;
    gameArea.onclick = null;

    battleTarget = null;
    playerCar = null;
    warPlayer = null;
    warGun = null;

    trafficCars = [];
    racingRocks = [];
    warEnemies = [];
    warBullets = [];
}

function updateStats() {
    document.getElementById("score").textContent = score;
    document.getElementById("lives").textContent = lives;
}

/* =================================
   BATTLE ARENA
================================= */

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

    gameArea.onmousemove = function (e) {

        if (!gameRunning) return;

        const rect = gameArea.getBoundingClientRect();

        mouseX = e.clientX - rect.left;
        mouseY = e.clientY - rect.top;

        const aim =
            gameArea.querySelector(".aim");

        const gun =
            gameArea.querySelector(".gun");

        aim.style.left = mouseX + "px";
        aim.style.top = mouseY + "px";

        const gunX = 70;
        const gunY =
            gameArea.clientHeight - 50;

        const angle =
            Math.atan2(
                mouseY - gunY,
                mouseX - gunX
            ) * 180 / Math.PI;

        gun.style.transform =
            `rotate(${angle}deg)`;
    };

    gameArea.onclick = function (e) {

        if (!gameRunning) return;

        if (
            e.target === battleTarget ||
            e.target.closest(".target")
        ) {

            score += 10;

            updateStats();

            battleTarget.style.transform =
                "scale(1.35)";

            setTimeout(() => {

                if (!gameRunning) return;

                battleTarget.style.transform =
                    "scale(1)";

                moveBattleTarget();

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

    if (!battleTarget || !gameRunning) return;

    const width =
        gameArea.clientWidth;

    const height =
        gameArea.clientHeight;

    const targetSize = 65;

    const x =
        Math.random() *
        Math.max(1, width - targetSize);

    const y =
        50 +
        Math.random() *
        Math.max(
            1,
            height - 160
        );

    battleTarget.style.left =
        x + "px";

    battleTarget.style.top =
        y + "px";
}

/* =================================
   SPEED RACING
================================= */

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
        gameArea.querySelector(
            ".player-car"
        );

    playerCar.style.left = "50%";

    gameLoop =
        setInterval(
            racingLoop,
            30
        );
}

function racingLoop() {

    if (!gameRunning || !playerCar) {
        return;
    }

    let left =
        parseFloat(
            playerCar.style.left
        ) || 50;

    if (
        keys["a"] ||
        keys["arrowleft"]
    ) {
        left -= 1.6;
    }

    if (
        keys["d"] ||
        keys["arrowright"]
    ) {
        left += 1.6;
    }

    left =
        Math.max(
            27,
            Math.min(73, left)
        );

    playerCar.style.left =
        left + "%";

    if (Math.random() < 0.035) {
        createTrafficCar();
    }

    if (Math.random() < 0.01) {
        createRock();
    }

    moveTraffic();
    moveRocks();
}

function createTrafficCar() {

    if (!gameRunning) return;

    const car =
        document.createElement("div");

    car.className =
        "traffic-car";

    car.textContent =
        Math.random() > 0.5
            ? "🚗"
            : "🚙";

    car.style.left =
        (27 + Math.random() * 46) +
        "%";

    car.style.top =
        "-70px";

    gameArea.appendChild(car);

    trafficCars.push(car);
}

function createRock() {

    if (!gameRunning) return;

    const rock =
        document.createElement("div");

    rock.className =
        "rock";

    rock.textContent =
        "🪨";

    rock.style.left =
        (27 + Math.random() * 46) +
        "%";

    rock.style.top =
        "-60px";

    gameArea.appendChild(rock);

    racingRocks.push(rock);
}

function moveTraffic() {

    for (
        let i = trafficCars.length - 1;
        i >= 0;
        i--
    ) {

        const car =
            trafficCars[i];

        if (!car.isConnected) {
            trafficCars.splice(i, 1);
            continue;
        }

        let top =
            parseFloat(
                car.style.top
            ) || 0;

        top += 5;

        car.style.top =
            top + "px";

        if (
            checkCollision(
                playerCar,
                car
            )
        ) {

            car.remove();

            trafficCars.splice(
                i,
                1
            );

            lives--;

            updateStats();

            if (lives <= 0) {
                gameOver();
                return;
            }

            continue;
        }

        if (
            top >
            gameArea.clientHeight + 80
        ) {

            car.remove();

            trafficCars.splice(
                i,
                1
            );

            score += 5;

            updateStats();
        }
    }
}

function moveRocks() {

    for (
        let i = racingRocks.length - 1;
        i >= 0;
        i--
    ) {

        const rock =
            racingRocks[i];

        if (!rock.isConnected) {
            racingRocks.splice(i, 1);
            continue;
        }

        let top =
            parseFloat(
                rock.style.top
            ) || 0;

        top += 6;

        rock.style.top =
            top + "px";

        if (
            checkCollision(
                playerCar,
                rock
            )
        ) {

            rock.remove();

            racingRocks.splice(
                i,
                1
            );

            lives--;

            updateStats();

            if (lives <= 0) {
                gameOver();
                return;
            }

            continue;
        }

        if (
            top >
            gameArea.clientHeight + 80
        ) {

            rock.remove();

            racingRocks.splice(
                i,
                1
            );

            score += 3;

            updateStats();
        }
    }
}

/* =================================
   WAR LEGENDS
================================= */

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
        gameArea.querySelector(
            ".war-player"
        );

    warGun =
        gameArea.querySelector(
            ".war-gun"
        );

    warPlayer.style.left = "50%";

    gameArea.onmousemove =
        function (e) {

            if (!gameRunning) return;

            const rect =
                gameArea.getBoundingClientRect();

            mouseX =
                e.clientX - rect.left;

            mouseY =
                e.clientY - rect.top;

            const crosshair =
                gameArea.querySelector(
                    ".war-crosshair"
                );

            crosshair.style.left =
                mouseX + "px";

            crosshair.style.top =
                mouseY + "px";

            updateWarGun();
        };

    gameArea.onclick =
        function (e) {

            if (!gameRunning) return;

            if (
                e.target.closest(
                    ".war-game"
                )
            ) {
                shootWar();
            }
        };

    gameLoop =
        setInterval(
            warLoop,
            30
        );
}

function updateWarGun() {

    if (!warPlayer || !warGun) {
        return;
    }

    const px =
        warPlayer.offsetLeft + 25;

    const py =
        warPlayer.offsetTop + 25;

    const angle =
        Math.atan2(
            mouseY - py,
            mouseX - px
        );

    warGun.style.left =
        (warPlayer.offsetLeft + 20) +
        "px";

    warGun.style.top =
        (warPlayer.offsetTop - 5) +
        "px";

    warGun.style.transform =
        `rotate(${angle}rad)`;

    warGun.style.transformOrigin =
        "15px 15px";
}

function shootWar() {

    if (
        !gameRunning ||
        !warPlayer
    ) {
        return;
    }

    const startX =
        warPlayer.offsetLeft + 25;

    const startY =
        warPlayer.offsetTop + 20;

    const dx =
        mouseX - startX;

    const dy =
        mouseY - startY;

    const distance =
        Math.sqrt(
            dx * dx +
            dy * dy
        );

    if (distance < 1) return;

    const bullet =
        document.createElement("div");

    bullet.className =
        "bullet";

    bullet.style.left =
        startX + "px";

    bullet.style.top =
        startY + "px";

    bullet.dataset.vx =
        dx / distance * 12;

    bullet.dataset.vy =
        dy / distance * 12;

    gameArea.appendChild(
        bullet
    );

    warBullets.push(
        bullet
    );
}

function warLoop() {

    if (
        !gameRunning ||
        !warPlayer
    ) {
        return;
    }

    let left =
        parseFloat(
            warPlayer.style.left
        ) || 50;

    if (
        keys["a"] ||
        keys["arrowleft"]
    ) {
        left -= 1.2;
    }

    if (
        keys["d"] ||
        keys["arrowright"]
    ) {
        left += 1.2;
    }

    left =
        Math.max(
            5,
            Math.min(90, left)
        );

    warPlayer.style.left =
        left + "%";

    updateWarGun();

    if (
        Math.random() < 0.025
    ) {
        createWarEnemy();
    }

    moveWarBullets();
    moveWarEnemies();
}

function createWarEnemy() {

    if (!gameRunning) return;

    const enemy =
        document.createElement("div");

    enemy.className =
        "war-enemy";

    enemy.textContent =
        "👾";

    enemy.style.left =
        (5 + Math.random() * 85) +
        "%";

    enemy.style.top =
        "-60px";

    gameArea.appendChild(
        enemy
    );

    warEnemies.push(
        enemy
    );
}

function moveWarBullets() {

    for (
        let i = warBullets.length - 1;
        i >= 0;
        i--
    ) {

        const bullet =
            warBullets[i];

        if (!bullet.isConnected) {
            warBullets.splice(i, 1);
            continue;
        }

        let x =
            parseFloat(
                bullet.style.left
            ) || 0;

        let y =
            parseFloat(
                bullet.style.top
            ) || 0;

        const vx =
            parseFloat(
                bullet.dataset.vx
            ) || 0;

        const vy =
            parseFloat(
                bullet.dataset.vy
            ) || 0;

        x += vx;
        y += vy;

        bullet.style.left =
            x + "px";

        bullet.style.top =
            y + "px";

        let hit = false;

        for (
            let j = warEnemies.length - 1;
            j >= 0;
            j--
        ) {

            const enemy =
                warEnemies[j];

            if (
                checkCollision(
                    bullet,
                    enemy
                )
            ) {

                bullet.remove();
                enemy.remove();

                warBullets.splice(
                    i,
                    1
                );

                warEnemies.splice(
                    j,
                    1
                );

                score += 10;

                updateStats();

                hit = true;

                break;
            }
        }

        if (hit) continue;

        if (
            x < -50 ||
            x > gameArea.clientWidth + 50 ||
            y < -50 ||
            y > gameArea.clientHeight + 50
        ) {

            bullet.remove();

            warBullets.splice(
                i,
                1
            );
        }
    }
}

function moveWarEnemies() {

    for (
        let i = warEnemies.length - 1;
        i >= 0;
        i--
    ) {

        const enemy =
            warEnemies[i];

        if (!enemy.isConnected) {
            warEnemies.splice(i, 1);
            continue;
        }

        let top =
            parseFloat(
                enemy.style.top
            ) || 0;

        top += 3;

        enemy.style.top =
            top + "px";

        if (
            checkCollision(
                warPlayer,
                enemy
            )
        ) {

            enemy.remove();

            warEnemies.splice(
                i,
                1
            );

            lives--;

            updateStats();

            if (lives <= 0) {
                gameOver();
                return;
            }

            continue;
        }

        if (
            top >
            gameArea.clientHeight
        ) {

            enemy.remove();

            warEnemies.splice(
                i,
                1
            );

            lives--;

            updateStats();

            if (lives <= 0) {
                gameOver();
                return;
            }
        }
    }
}

/* =================================
   COLLISION
================================= */

function checkCollision(a, b) {

    if (!a || !b) {
        return false;
    }

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

    if (gameLoop) {
        clearInterval(gameLoop);
        gameLoop = null;
    }

    gameArea.onmousemove = null;
    gameArea.onclick = null;

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
