//Functions related to vaccine
function spawnVacc() {
  if (frameCount % spawnSpeed === 0) {
    var randVal = Math.round(random(0, 4));

    //Giving properties to vaccine sprite
    vaccine = createSprite(spawnLocation+50, heightVal[randVal] + changeVal/2, 10, 10);
    vaccine.addImage(vaccineAnim);
    vaccine.scale = player.scale / 3.8;
    vaccine.setCollider("rectangle", 0, 0, 500, 512);

    player.depth = vaccine.depth + 1;

    //Adding vaccine to vaccine group
    vaccineGrp.add(vaccine);
  }
}
function vaccineColl() {
  for (var i = 0; i < vaccineGrp.length; i++) {
    if (player.isTouching(vaccineGrp.get(i))) {
      collectAudio.play();
      vaccineGrp.get(i).destroy();
      vaccineCount++;

      if (collectPhase === "notCollected") {
        collectPhase = "collected"
      }
      if (virus != null) {
        virusHealth -= 10;
      }
    }
  }
}
function destroyVacc() {
  for (var i = 0; i < vaccineGrp.length; i++) {
    if (vaccineGrp.get(i).x < camera.x - screenX/2) {
      vaccineGrp.get(i).destroy();
      vaccPassed += 1;
    }
  }
}
function displayVaccCount() {
  vaccineDisp.x = camera.x + 416;
  fill("blue")
  textSize(40);
  text(" = " + vaccineCount, vaccineDisp.x + 30, vaccineDisp.y + 15);
}
