//Functions related to virus
function spawnVirus() {
  if (frameCount % 100 === 0 && virus === null) {
    virusHealth = 100;
    virusXSpeed = orignalSpeed;
    //Giving properties to vaccine sprite
    virus = createSprite(camera.x - screenX/2, player.y + changeVal/2, 10, 10);
    virus.addImage(virusAnim);
    virus.scale = player.scale * 1.5;
    virus.velocityX = virusXSpeed;
    virus.setCollider("rectangle", 0, 0, 110, 100)
  }
}
function virusKill() {
  if (virusHealth === 0) {
    virus.visible = false;
    virus = null;
    virusHealth = 100;
    virusXSpeed = orignalSpeed;
  }
}
function virusCollide() {
  if (virus != null) {
    if (virus.isTouching(player)) {
      virus.visible = false;
      vaccineCount -= 5;
      virus = null;

      virusColl = createSprite(player.x - 20, player.y, 1, 1);
      virusColl.addAnimation("v1", virusCollAnim);

      textPhase = "blink";

      collideSound.play();;
    }
  }
}

function stopCollAnim() {
  if (virusColl != null) {
    frame += 1;
    if (frame > 30) {
      virusColl.visible = false;
      virusColl = null;
      frame = 0;
    }
  }
}
function stopVirus() {
  if (collectPhase === "collected") {
    if (count < 75) {
      virusXSpeed = 0;
      count++;
    } else {
      count = 0;
      virusXSpeed = orignalSpeed;
      collectPhase = "notCollected";
    }
  } else if (collectPhase === "boostVirus") {
    if (count < 25) {
      virusXSpeed = orignalSpeed + .1;
      count++;
    } else {
      count = 0;
      virusXSpeed = orignalSpeed;
      collectPhase = "notCollected";
    }
  }
}
