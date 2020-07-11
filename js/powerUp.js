//Functions for powerUp
function spawnPowerUp() {
  if (time > 45 && vaccineCount < 30 && phase === "notCollected") {
    if (frameCount % 60 === 0) {
      var randVal = Math.round(random(0, 4));

      //Giving properties to vaccine sprite
      speedUp = createSprite(spawnLocation+50, heightVal[randVal] + changeVal/2, 10, 10);
      speedUp.addAnimation("s1", speedUpAnim);
      speedUp.scale = changeVal/100;
      speedUpGrp.add(speedUp);
    }
  }
}
function collectBlue() {
  for (var i = 0; i < speedUpGrp.length; i++) {
    if (player.isTouching(speedUpGrp.get(i))) {
      phase = "collected";
      collectAudio.play();
      speedUpGrp.setLifetimeEach(1);
      spawnSpeed -= 25;
    }
  }
}
function destroyBlue() {
  for (var i = 0; i < speedUpGrp.length; i++) {
    if (speedUpGrp.get(i).x < camera.x - screenX/2) {
      speedUpGrp.get(i).destroy();
    }
  }
}
function resetSpawnSpeed() {
  if (spawnSpeed <= 20) {
    var stopTime = 250;
    if (startTime < stopTime) {
      startTime++;
    } else {
      spawnSpeed = 35;
      startTime = 0;
    }
  }
}
