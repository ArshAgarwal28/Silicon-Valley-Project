//Functions related to obstacles
function spawnObs() {
  if (frameCount % 35 === 0) {
    var randVal = Math.round(random(0, 4));

    //Giving properties to vaccine sprite
    obstacle = createSprite(spawnLocation+50, heightVal[randVal] + changeVal/1.85, 10, 10);
    obstacle.addImage(obsAnim);
    obstacle.scale = vaccine.scale - .018;
    obstacle.setCollider("rectangle", 0, 0, 1000, 640);

    player.depth = obstacle.depth + 1;
    if (virus !== null) {
      virus.depth = obstacle.depth + 1;
    }

    obsGroup.add(obstacle);
  }
}
function obsCollide() {
  for (var i = 0; i < obsGroup.length; i++) {
    if (player.isTouching(obsGroup.get(i))) {
      collectPhase = "boostVirus"
      obsGroup.get(i).destroy();

      if (virus != null) {
        boostSound.play();
      }
    }
  }

}
function obsDestroy() {
  for (var i = 0; i < obsGroup.length; i++) {
    if (obsGroup.get(i).x < camera.x - screenX/2) {
      obsGroup.get(i).destroy();
    }
  }
}
