(() => {
  const DOM = {
    canvas: document.querySelector("canvas"),
    gameBoard: document.querySelector(".game-board"),
    settings: document.querySelectorAll(".setting"),
    ctx: document.querySelector("canvas").getContext("2d"),
    circlesNum: document.querySelector(".circles"),
    gameClicks: document.querySelector(".clicks-limit"),
    circleSize: document.querySelector(".circle-size"),
    circleSpeed: document.querySelector(".circle-speed"),
    easy: document.querySelector(".easy"),
    medium: document.querySelector(".medium"),
    insane: document.querySelector(".insane"),
    cssPrimaryColor: getComputedStyle(document.documentElement)
      .getPropertyValue("--primary-color")
      .trim(),
    cssSecondaryColor: getComputedStyle(document.documentElement)
      .getPropertyValue("--secondary-color")
      .trim(),
    level: document.querySelector(".level"),
    label: document.querySelector(".label-circles"),
    score: document.querySelector(".score"),
    winScore: document.querySelector(".win-score"),
    clicks: document.querySelector(".clicks"),
    startingColor: document.querySelector(".starting-color"),
    targetColor: document.querySelector(".target-color"),
    endCurrent: document.querySelector(".end-current"),
    root: document.documentElement,
    originalCssPrimary: getComputedStyle(document.documentElement)
      .getPropertyValue("--primary-color")
      .trim(),
    originalCssSecondary: getComputedStyle(document.documentElement)
      .getPropertyValue("--secondary-color")
      .trim(),
    allowFontChange: document.querySelector(".allow-font-change"),
    resetBtn: document.querySelector(".reset-settings"),
    startBtn: document.querySelector(".start"),
  };

  const gameData = {
    gamePlaying: false,
    score: undefined,
    currentLevel: undefined,
    animationID: undefined,
    clicksLimit: undefined,
  };

  const circlesData = {
    circleArray: [],
    BaseSpeed: 2,
    baseSize: 25,
    startingColor: undefined,
    targetColor: undefined,
    numCircles: undefined,
    difficultySpeed: undefined,
    difficultySize: undefined,
  };

  DOM.canvas.width = DOM.gameBoard.clientWidth;

  DOM.canvas.height = DOM.canvas.clientHeight;

  function Circle(x, y, dx, dy, radius) {
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.radius = radius;
    this.color = circlesData.startingColor;
  }

  Circle.prototype.update = function () {
    if (this.x + this.radius > DOM.canvas.width || this.x - this.radius < 0) {
      this.dx = -this.dx;
    }
    if (this.y + this.radius > DOM.canvas.height || this.y - this.radius < 0) {
      this.dy = -this.dy;
    }

    this.x += this.dx;
    this.y += this.dy;

    this.draw();
  };

  Circle.prototype.draw = function () {
    const circle = new Path2D();

    circle.arc(this.x, this.y, this.radius, 0, Math.PI * 2);

    DOM.ctx.fillStyle = this.color;

    DOM.ctx.fill(circle);

    this.id = circle;
  };

  const createCircles = () => {
    for (let i = 0; i < circlesData.numCircles; i++) {
      const plusOrMinus = Math.random() < 0.5 ? -1 : 1;

      const radius = Math.floor(
        circlesData.baseSize + Math.random() * circlesData.difficultySize
      );
      const x = Math.floor(
        Math.random() * (DOM.canvas.width - radius * 2) + radius
      );
      const y = Math.floor(
        Math.random() * (DOM.canvas.height - radius * 2) + radius
      );

      const dx = Math.floor(
        plusOrMinus *
          (circlesData.BaseSpeed + Math.random() * circlesData.difficultySpeed)
      );

      const dy = Math.floor(
        plusOrMinus *
          (circlesData.BaseSpeed + Math.random() * circlesData.difficultySpeed)
      );

      circlesData.circleArray.push(new Circle(x, y, dx, dy, radius));
    }
  };

  const stopAnimation = (id) => cancelAnimationFrame(id);

  const displayLevel = () =>
    (DOM.level.textContent = `Current level: ${gameData.currentLevel}`);

  const displayNumCircles = () =>
    (DOM.label.textContent = `Number of circles: ${circlesData.numCircles}`);

  const displayScore = () =>
    (DOM.score.textContent = `Current Score: ${gameData.score}`);

  const displayWinScore = () =>
    (DOM.winScore.textContent = `Winning Score: ${circlesData.numCircles}`);

  const displayClicks = () =>
    (DOM.clicks.textContent = `Missclicks left: ${gameData.clicksLimit}`);

  const updateCircles = () =>
    circlesData.circleArray.forEach((circle) => circle.update());

  const increaseLevel = () => {
    gameData.currentLevel += 1;
  };

  const decreaseClicks = () => {
    gameData.clicksLimit -= 1;
  };

  const increaseScore = () => {
    gameData.score += 1;
  };

  const clearCircles = () => {
    circlesData.circleArray = [];
  };

  const clearCanvas = () => {
    DOM.ctx.clearRect(0, 0, DOM.canvas.width, DOM.canvas.height);
  };

  const changeCircleColor = (circle) =>
    (circle.color = circlesData.targetColor);

  const restartCircleColor = () =>
    circlesData.circleArray.forEach(
      (circle) => (circle.color = circlesData.startingColor)
    );

  const resetScore = () => {
    gameData.score = 0;
  };

  const setupDifficulty = (difficulty) => {
    if (!gameData.gamePlaying) {
      if (difficulty === "easy") {
        DOM.gameClicks.value = 15;
        DOM.circleSize.value = 90;
        DOM.circleSpeed.value = 1;
        DOM.circlesNum.value = 5;
      } else if (difficulty === "medium") {
        DOM.gameClicks.value = 10;
        DOM.circleSize.value = 70;
        DOM.circleSpeed.value = 2;
        DOM.circlesNum.value = 7;
      } else {
        DOM.gameClicks.value = 8;
        DOM.circleSize.value = 60;
        DOM.circleSpeed.value = 5;
        DOM.circlesNum.value = 10;
      }
      setupCustomSettings();
      displayGameInfo();
    } else {
      alert("To change the settings game must not be playing");
    }
  };

  const resetSettings = () => {
    if (gameData.gamePlaying) {
      alert("To change the settings game must not be playing");
    } else {
      DOM.startingColor.value = DOM.originalCssPrimary;
      DOM.targetColor.value = DOM.originalCssSecondary;

      changeCssPrimary();
      changeCssSecondary();
      setupDifficulty("easy");
    }
  };

  const setupCustomSettings = () => {
    gameData.score = 0;
    gameData.currentLevel = 1;
    gameData.clicksLimit = Number(DOM.gameClicks.value);
    circlesData.difficultySize = Number(DOM.circleSize.value);
    circlesData.difficultySpeed = Number(DOM.circleSpeed.value);
    circlesData.numCircles = Number(DOM.circlesNum.value);
    circlesData.startingColor = DOM.startingColor.value;
    circlesData.targetColor = DOM.targetColor.value;
  };

  const displayGameInfo = () => {
    displayLevel();
    displayScore();
    displayWinScore();
    displayClicks();
    displayNumCircles();
  };

  const changeGameStatus = () => {
    if (gameData.gamePlaying) {
      gameData.gamePlaying = false;
    } else {
      gameData.gamePlaying = true;
    }

    disableSettings();
  };

  const animateCircles = () => {
    gameData.animationID = requestAnimationFrame(animateCircles);

    clearCanvas();

    updateCircles();

    // If user won level
    if (gameData.score === circlesData.circleArray.length) {
      nextLevel();
    }

    // If user lost game
    if (gameData.clicksLimit === 0) {
      endGame();
    }
  };

  const nextLevel = () => {
    stopAnimation(gameData.animationID); // Animation must be stopped before creating new circles
    resetScore();
    increaseLevel();
    updateDifficulty();
    clearCircles();
    createCircles(); // Creates new circles because we now have different difficulty settings
    animateCircles();
    displayGameInfo();
  };

  const updateDifficulty = () => {
    if (gameData.currentLevel % 3 === 0) {
      circlesData.difficultySpeed += 1;
    }

    if (gameData.currentLevel % 5 === 0) {
      circlesData.numCircles += 2;
    }

    if (circlesData.difficultySize <= 50) {
      circlesData.difficultySize = 70;
    }

    circlesData.difficultySize -= 5;
  };

  const clickedCircle = (e) => {
    // Mouse click coordinates
    const mouseX = e.offsetX;

    const mouseY = e.offsetY;

    // Returns true if clicked inside a circle

    return circlesData.circleArray.some((circle) => {
      if (
        // If clicked inside a circle && circle is not starting color
        DOM.ctx.isPointInPath(circle.id, mouseX, mouseY) &&
        circle.color === circlesData.startingColor
      ) {
        changeCircleColor(circle);
        increaseScore();
        displayScore();
        return true;
      } else if (
        DOM.ctx.isPointInPath(circle.id, mouseX, mouseY) &&
        circle.color === circlesData.targetColor
      ) {
        return true;
      } else {
        return false;
      }
    });
  };

  const endGame = () => {
    if (gameData.gamePlaying) {
      stopAnimation(gameData.animationID);
      clearCircles();
      changeGameStatus();
      alert(
        `Congratulations you were able to reached level ${gameData.currentLevel}.`
      );
    } else {
      alert("Game hasn´t started yet.");
    }
  };

  const startGame = () => {
    if (!gameData.gamePlaying) {
      setupCustomSettings();
      displayGameInfo();
      changeGameStatus();
      clearCircles();
      createCircles();
      animateCircles();
    } else {
      alert("Game in process, please finish it before starting a new one.");
    }
  };

  const handleClick = (e) => {
    if (gameData.gamePlaying) {
      if (!clickedCircle(e)) {
        restartCircleColor();
        resetScore();
        decreaseClicks();
        displayClicks();
      }
    } else {
      alert("You must click the start game button first.");
    }
  };

  const disableSettings = () => {
    if (gameData.gamePlaying) {
      DOM.settings.forEach((setting) => {
        setting.disabled = true;
      });
    } else {
      DOM.settings.forEach((setting) => {
        setting.disabled = false;
      });
    }
  };
  const changeCssPrimary = () => {
    if (DOM.allowFontChange.checked) {
      DOM.root.style.setProperty("--primary-color", DOM.startingColor.value);
      updateCssPrimary();
    } else {
      DOM.root.style.setProperty("--primary-color", DOM.originalCssPrimary);
      updateCssPrimary();
      circlesData.startingColor = DOM.startingColor.value;
    }
  };

  const changeCssSecondary = () => {
    if (DOM.allowFontChange.checked) {
      DOM.root.style.setProperty("--secondary-color", DOM.targetColor.value);
      updateCssSecondary();
    } else {
      DOM.root.style.setProperty("--secondary-color", DOM.originalCssSecondary);
      updateCssSecondary();
      circlesData.startingColor = DOM.targetColor.value;
    }
  };

  const updateCssPrimary = () => {
    DOM.cssPrimaryColor = getComputedStyle(document.documentElement)
      .getPropertyValue("--primary-color")
      .trim();
  };

  const updateCssSecondary = () => {
    DOM.cssSecondaryColor = getComputedStyle(document.documentElement)
      .getPropertyValue("--secondary-color")
      .trim();
  };

  const updateCircleQty = () => {
    circlesData.numCircles = Number(DOM.circlesNum.value);
    displayNumCircles();
    displayWinScore();
  };

  const validateSettingsInput = (e) => {
    // Validate Circle Size input
    if (
      e.target.classList.contains("circle-size") &&
      (e.target.value < 0 || e.target.value > 140)
    ) {
      alert("Only values between 1 and 140");
      e.target.value = 90;
      // Validate Circle Speed input
    } else if (
      e.target.classList.contains("circle-speed") &&
      (e.target.value < 0 || e.target.value > 50)
    ) {
      alert("Only values between 1 and 50");
      e.target.value = 1;
      // Validate Clicks Limit input
    } else if (
      e.target.classList.contains("clicks-limit") &&
      (e.target.value < 0 || e.target.value > 100)
    ) {
      alert("Only values between 1 and 100");
      e.target.value = 15;
    }
  };

  (init = () => {
    resetSettings();
    createCircles();
    updateCircles();
    displayGameInfo();
  })();

  DOM.startingColor.addEventListener("change", changeCssPrimary);
  DOM.targetColor.addEventListener("change", changeCssSecondary);
  DOM.canvas.addEventListener("click", handleClick);
  DOM.endCurrent.addEventListener("click", endGame);
  DOM.resetBtn.addEventListener("click", resetSettings);
  DOM.startBtn.addEventListener("click", startGame);
  DOM.circlesNum.addEventListener("change", updateCircleQty);
  DOM.easy.addEventListener("click", () => {
    setupDifficulty("easy");
  });
  DOM.medium.addEventListener("click", () => {
    setupDifficulty("medium");
  });
  DOM.insane.addEventListener("click", () => {
    setupDifficulty("insane");
  });
  DOM.allowFontChange.addEventListener("click", () => {
    changeCssPrimary();
    changeCssSecondary();
  });
  DOM.gameClicks.addEventListener("change", validateSettingsInput);
  DOM.circleSize.addEventListener("change", validateSettingsInput);
  DOM.circleSpeed.addEventListener("change", validateSettingsInput);
})();
