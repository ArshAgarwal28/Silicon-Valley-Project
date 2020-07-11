//Database Variables
var database;
var trackEnd1
var input, loginBut, signUpBut, playerName, highestScore;
var allUsers, refPoint, countPlayer;

//Variables required for choosing the type of level 2
var demoBut, demoAnim, orignalBut, orignalAnim, buttonChoice;

var screenX, screenY, midPoint;
//Player related variables
var player, playerAnim;
var playerY = 270, changeVal = 90;

//Variable for tracks
var track, track2, trackAnim, trackWidth, trackHeight;

//Variable for common spawn location of interactable items
var spawnLocation = 1366;

//Variables for vaccine
var vaccine, vaccineAnim, vaccineGrp, collectAudio, vaccineCount=0, vaccPassed = 0, spawnSpeed = 35, vaccGoal;
var collectPhase = "notCollected";

//Variables for virus
var virus=null, virusAnim, virusHealth = 100, virusXSpeed = 0.4, orignalSpeed = 0.4;
var virusColl, virusCollAnim, collideSound;
var boost, boostAnim, boostSound;

//Variables for obstacles
var obstacle, obsAnim, obsGroup;

//Variables for powerUp
var speedUp, speedUpAnim, speedUpGrp, phase="notCollected";

//Variables for counting up
var startTime = 0, frame = 0, count=0;

var heightVal;
var xVelocity = 5;
var score = 0;

var backSound, musicVolume=0.25, soundState=true;

//Variables I use for endCheck() function
var totalMins, totalSec;

//Time related variables
var timefontLoad, endFontLoad, time=0, minuteVal, secondVal, minCountdown, secCountdown, goalTime;

var textPhase="normal", blinkCount=0, textColor = "red";

//General Variables
var replayBut;
var bgImage; //Variable for changing background
var gameState = 1; //Game state for changing game level
var mousePos; //For mouse position
var lifeCount=2; //Lifecount for total lives

var videoTrial, videoPhase = "notSeen";


function preload() {
  //Loading all image/animation for level 2
  playerAnim = loadAnimation("sprites/Level2Spr/RunnerAnim/RunMan1.png", "sprites/Level2Spr/RunnerAnim/RunMan2.png",
  "sprites/Level2Spr/RunnerAnim/RunMan3.png","sprites/Level2Spr/RunnerAnim/RunMan4.png",
  "sprites/Level2Spr/RunnerAnim/RunMan5.png", "sprites/Level2Spr/RunnerAnim/RunMan6.png",
  "sprites/Level2Spr/RunnerAnim/RunMan7.png","sprites/Level2Spr/RunnerAnim/RunMan8.png");
  virusCollAnim = loadAnimation("sprites/level2Spr/boomAnim/boom1.png", "sprites/level2Spr/boomAnim/boom2.png",
  "sprites/level2Spr/boomAnim/boom3.png", "sprites/level2Spr/boomAnim/boom4.png",
  "sprites/level2Spr/boomAnim/boom5.png", "sprites/level2Spr/boomAnim/boom6.png",
  "sprites/level2Spr/boomAnim/boom7.png", "sprites/level2Spr/boomAnim/boom8.png");
  speedUpAnim = loadAnimation("sprites/level2Spr/powerUpBlue/speedUp1.png","sprites/level2Spr/powerUpBlue/speedUp2.png",
  "sprites/level2Spr/powerUpBlue/speedUp3.png","sprites/level2Spr/powerUpBlue/speedUp4.png",
  "sprites/level2Spr/powerUpBlue/speedUp5.png","sprites/level2Spr/powerUpBlue/speedUp6.png")

  trackAnim = loadImage("sprites/Level2Spr/track.png");
  vaccineAnim = loadImage("sprites/Level2Spr/VaccineIMG.png");
  virusAnim = loadImage("sprites/Level2Spr/virusAI.png");
  demoAnim = loadImage("sprites/Level2Spr/miniButton.png");
  orignalAnim = loadImage("sprites/Level2Spr/orignalButton.png");
  obsAnim = loadImage("sprites/Level2Spr/rock.png")
  boostAnim = loadImage("sprites/Level2Spr/boostAnim.png")

  timefontLoad = loadFont("sprites/Level2Spr/agencyFB.ttf");
  endFontLoad = loadFont("sprites/Level2Spr/simplifica.ttf");

  collectAudio = loadSound("sprites/Level2Spr/collectAudio.mp3");
  collideSound = loadSound("sprites/Level2Spr/coughSound.mp3");
  backSound = loadSound("sprites/Level2Spr/backSound.mp3");
  boostSound = loadSound("sprites/Level2Spr/boostSound.mp3");
}

function setup(){
  createCanvas(window.innerWidth - 100, window.innerHeight - 100);

  screenX = width;
  screenY = height;
  //Making rectangle around mouse;
  mousePos = createSprite(mouseX, mouseY, 5, 5);
  mousePos.visible = false;

  database = firebase.database();

  setInterval(scoreIncr, 200); //Calling scoreIncr function every .2 Seconds
  setInterval(timer, 1000);
  setInterval(blinkVaccCount, 100);

  //Main function for creating the whole of level 2
  setupLevel2();
}

function draw() {
  background(bgImage);

  mousePos.x = mouseX;
  mousePos.y = mouseY;

  //Main function for running the whole of level 2
  drawLevel2();


  drawSprites();
}


//Functions for level 2
//Main setup function for level 2
function setupLevel2() {
  bgImage = "white";

  track = createSprite(displayWidth / 2.5, screenY / 1.75, 50, 50);
  track.scale = screenY / 800;
  track.addImage(trackAnim);
  trackWidth = floor(2206 * track.scale);
  trackHeight = floor(522 * track.scale);

  track2 = createSprite(track.x + trackWidth - 10, track.y, 50, 50);
  track2.scale = track.scale;
  track2.addImage(trackAnim);

  changeVal = trackHeight / 5;

  //Making player sprite
  playerY = screenY / 2;
  player = createSprite(floor(screenX / 6), playerY, 50, 50);
  player.addAnimation("p1Anim", playerAnim);
  player.scale = changeVal / 150;
  player.setCollider("rectangle", 0, 80, 175, 125);
  player.visible = false;
  // player.debug = true;

  changeVal = trackHeight / 5;


  //Making list of all y position for random generation of obstacles
  heightVal = [playerY - (changeVal * 2), floor(playerY - changeVal), floor(playerY), floor(playerY + changeVal), floor(playerY + (2 * changeVal))];

  //Creating group for vaccine
  vaccineGrp = createGroup();
  speedUpGrp = createGroup();
  obsGroup = createGroup();

  midPoint = screenX/2 - player.x;

  virusXSpeed = player.x / 529;
  orignalSpeed = virusXSpeed;



  fetchInfo();
}

//Main draw function for level 2
function drawLevel2() {
  camera.x = player.x + midPoint;

  if (gameState === 1) {
    startInput();
  } else if (gameState === 1.25) {
    waitUserInput();
  }

  if (gameState < 2.25) {
    textFont(timefontLoad);
    fill(rgb(47, 84, 150));
    textSize(55);
    text("Virus Runner", camera.x - 110, 60);

    track.velocityX = -5;
    track2.velocityX = -5;
    trackReset();
  }

  if (gameState >= 2 && gameState < 2.1) {
    removeElements();

    backSound = createAudio("sprites/Level2Spr/backSound.mp3", playSong);
    backSound.volume(musicVolume)
    backSound.play();

    demoBut = createSprite(screenX / 2.35, screenY / 2, 10, 10);
    demoBut.addImage(demoAnim);

    orignalBut = createSprite(demoBut.x + 200, demoBut.y, 10, 10);
    orignalBut.addImage(orignalAnim);

    gameState = 2.2;
  }

  if (gameState > 2.2 && gameState < 2.5) {
    track.velocityX = 0;
    track2.velocityX = 0;

    player.velocityX = xVelocity;

    if (virus !== null) {
      virus.velocityX = xVelocity + virusXSpeed;
    }

    camera.x = player.x + midPoint;
    spawnLocation = camera.x + screenX/2;

    getHighScore();

    displaySprites();

    postTrackReset();

    speedIncr();
    dispTime();

    spawnVacc();
    vaccineColl();
    destroyVacc();

    spawnPowerUp();
    collectBlue();
    resetSpawnSpeed();
    destroyBlue();

    spawnObs();
    obsCollide();
    obsDestroy();

    spawnVirus();
    virusKill();
    virusCollide();
    stopCollAnim();
    stopVirus();

    dispHighTime();

    displayCount();
  }

  endCheck();
  checkHigherScore();
  touchCheck();

  createCutScene();
}

//Function related to road and speed/score
function trackReset() {
  if (track.x + trackWidth/2 + 1.3 < 0) {
    //noLoop();
    track.x = track2.x + trackWidth;
  }

  if (track2.x + trackWidth/2 + 1.3 < 0) {
    track2.x = track.x + trackWidth;
  }
}
function postTrackReset() {
  if (track.x + trackWidth/2 + 1.3< camera.x - screenX/2) {
    //noLoop();
    track.x = track2.x + trackWidth;
  }

  if (track2.x + trackWidth/2 + 1.3 < camera.x - screenX/2) {
    track2.x = track.x + trackWidth;
  }
}
function scoreIncr() {
  if (gameState >= 2.2 && gameState <= 2.5) {
    score += .5;
  }
}
function speedIncr() {
  if (gameState >= 2.2 && gameState <= 2.5)
  if (frameCount % 220 === 0 && frameCount > 0 && xVelocity < 16) {
    xVelocity += 2;
  }
}

//Function related to song
function playSong() {
  backSound.play();
}

//Extras
function displayCount() {
  minCountdown = floor((goalTime - time) / 60);
  secCountdown = ((goalTime - time) % 60);
  var tempXValue = (floor(screenY / 12.5) * 8) + floor(camera.x - screenX/3.3);
  var tempXValue2 = (floor(screenY / 12.5) * 15) + floor(camera.x - screenX/3.3);
  var vaccineLeft = vaccGoal - vaccineCount;
  textFont(endFontLoad);
  textSize(floor(screenY / 12.5));
  fill("red");
  text("Objective: You have to collect ", floor(camera.x - screenX/3.3), height - screenY/40);
  text("Vaccines in " + minCountdown + " minutes " + secCountdown + " seconds", camera.x + screenX/100, height - screenY/40)

  fill(textColor);
  text(vaccineLeft, tempXValue, height - screenY/40);
}
function blinkVaccCount() {
  if (textPhase === "blink" && blinkCount < 20) {
    if (textColor === "red") {
      textColor = "blue";
      blinkCount += 1;
    } else {
      textColor = "red";
      blinkCount += 1;
    }

    if (blinkCount === 20) {
      textPhase = "normal";
      blinkCount = 0;
    }
  }
}
function checkHigherScore() {
  if (gameState === 2.75 && buttonChoice) {
    if (highestScore === undefined) {

      highestScore = time;
      alert("New High Score set!");
      updateHighScore();
      buttonChoice = false;
    } else if (time < highestScore) {
      highestScore = time;
      alert("New High Score set!");
      updateHighScore();
      buttonChoice = false;
    }
  }
}
function dispHighTime() {
  if (highestScore === undefined) {
    var minuteValHigh = 0;
    var secondValHigh = 0;
  } else {
    var minuteValHigh = floor(highestScore / 60);
    var secondValHigh = highestScore % 60;
  }
  textFont(timefontLoad);
  fill(rgb(47, 84, 150));
  textSize(floor(screenY / 12.5));

  if (secondValHigh >= 10) {
    text("Highest Score: 0" + minuteValHigh + ":" + secondValHigh, camera.x - 575, 60);
  } else {
    text("Highest Score: 0" + minuteValHigh + ":0" + secondValHigh, camera.x - screenX/2.1, 60);
  }
}

//Function to display sprites
function displaySprites() {
  player.visible = true;
}
function hideSprites() {
  track.visible = false;
  track2.visible = false;

  player.visible = false;
  player.velocityX = 0;

  if (virus != null ) {
    virus.visible = false;
  }

  vaccineGrp.destroyEach();
  obsGroup.destroyEach();
}

//Timer Functions
function timer() {
  if (time < goalTime+1 && gameState >= 2.25 && gameState <= 2.5) {
    time += 1;
  }
}
function dispTime() {
  minuteVal = floor(time / 60);
  secondVal = time % 60;

  textFont(timefontLoad);
  fill(rgb(47, 84, 150));
  textSize(floor(screenY / 10));

  if (secondVal >= 10) {
    text("0" + minuteVal + ":" + secondVal, camera.x - 40, 50);
  } else {
    text("0" + minuteVal + ":0" + secondVal, camera.x - 40, 50);
  }
}

//End check for level 2
function endCheck() {
  if (time >= goalTime || vaccineCount === vaccGoal) {
    camera.x = screenX/2;

    replayButton();
    hideSprites();

    textFont(endFontLoad);
    textSize(floor(screenY / 7));
    fill("black");

    replayBut.mousePressed(restartGame)
    //Checks for the satisfying condition to display end message
    if (vaccineCount === vaccGoal) {
      text("          Congratulations! You were able \n                        to kill the virus", camera.x-screenX/3, screenY/2);
      gameState = 2.75;
    } else {
      gameState = 2.85;
      text("              Game Over! You collected \n" + " '" + vaccineCount + "' " + " Vaccines in '" + totalMins + "' Minute(s) '" + totalSec + "' Second(s) \n      and you left a total of '" + vaccPassed + "' Vaccine(s)!", screenX/11, screenY/3);
    }
  }
}

//General function
function keyReleased() {
  if (keyCode === UP_ARROW) {
    if (playerY > heightVal[0]) {
      playerY -= changeVal;
      while (player.y >  playerY) {
        player.y -= 0.5;
        if (virus != null ) {
          virus.y -= 0.5;
        }
      }
    }
  }

  if (keyCode === DOWN_ARROW) {
    if (playerY < heightVal[4]) {
      playerY += changeVal;
      while (player.y < playerY) {
        player.y += 0.5;
        if (virus != null) {
          virus.y += 0.5;
        }
      }
    }
  }
}

function mouseClicked() {
  if (mouseButton === LEFT) {
    if (demoBut != null) {
      if (mousePos.isTouching(demoBut)) {
        demoPressed();
      }
    }

    if (orignalBut != null) {
      if (mousePos.isTouching(orignalBut)) {
        orignalPressed();
      }
    }

  }
}

function replayButton() {
  replayBut = createButton("Play Again");
  replayBut.position(screenX/2.2, screenY/2 + screenY/4);
  replayBut.size(100);
}
function restartGame() {
  replayBut.hide();

  player = null;
  track = null;
  track2 = null;
  vaccineCount = 0;
  xVelocity = 5;
  phase = "notCollected";
  spawnSpeed = 35;

  if (virus!==null) {
    virus = null;
  }

  setupLevel2();

  gameState = 2;
  time = 0;
}

function touchCheck() {
  if (touches.length > 0) {
    if (gameState === 2.2) {
      mousePos.x = touches[0].x;
      mousePos.y = touches[0].y;

      if (demoBut != null) {
        if (mousePos.isTouching(demoBut)) {
          demoPressed();
        }
      }

      if (orignalBut != null) {
        if (mousePos.isTouching(orignalBut)) {
          orignalPressed();
        }
      }
    }

    if (gameState === 2.25) {
      if (touches[0].y < height / 2 ) {
        if (playerY > heightVal[0]) {
          playerY -= changeVal;
          while (player.y >  playerY) {
            player.y -= 0.5;
            if (virus != null ) {
              virus.y -= 0.5;
            }
          }
        }
      }

      if (touches[0].y > height / 2) {
        if (playerY < heightVal[4]) {
          playerY += changeVal;
          while (player.y < playerY) {
            player.y += 0.5;
            if (virus != null) {
              virus.y += 0.5;
            }
          }
        }
      }
    }
    touches = [];
  }
}

function demoPressed() {
  goalTime = 60;
  vaccGoal = 20;

  totalMins = floor(goalTime/60)
  totalSec = goalTime % 60;

  gameState = 2.25;

  orignalBut.visible = false;
  orignalBut = null;
  demoBut.visible = false;
  demoBut = null;

  buttonChoice = false;

}
function orignalPressed() {
  goalTime = 165;
  vaccGoal = 60;

  totalMins = floor(goalTime/60)
  totalSec = goalTime % 60;

  gameState = 2.25;

  orignalBut.visible = false;
  orignalBut = null;
  demoBut.visible = false;
  demoBut = null;

  buttonChoice = true;
}

function createCutScene() {
  if (gameState === 3 && videoPhase === "notSeen") {
    videoTrial = createVideo('sprites/Level2Spr/cutScene.mp4', () => {
      videoTrial.play();
    });

    videoTrial.position(0, 0);
    setTimeout(afterVideo, 36500);
    document.getElementsByTagName("VIDEO")[0].requestFullscreen()
    gameState = 3.25
  }
}
function afterVideo() {


  gameState = 2;
  document.exitFullscreen();
  videoPhase = "seen"
  videoTrial.hide();
}
