function startInput() {
  if (allUsers !== undefined) {
    var widthSize = 150;
    var positionX = screenX / 2 - widthSize / 2;

    input = createInput("Username: ");
    input.position(positionX, screenY/2);
    input.size(widthSize);

    loginBut = createButton("Log In");
    loginBut.position(positionX, screenY/2 + 25);
    loginBut.size(widthSize / 2);

    signUpBut = createButton("Sign Up");
    signUpBut.position(positionX + 82, screenY/2 + 25);
    signUpBut.size(widthSize / 2);

    gameState = 1.25;
  }
}

function waitUserInput() {
  input.mousePressed(inputPressed);
  loginBut.mousePressed(loginPressed);
  signUpBut.mousePressed(signUpPressed);
}

function inputPressed() {
  input.value("")
}

function loginPressed() {
  input.hide();
  loginBut.hide();
  signUpBut.hide();
  playerName = input.value()

  checkUser();
}

function signUpPressed() {
  input.hide();
  loginBut.hide();
  signUpBut.hide();
  playerName = input.value();
  playerName.replace("Username: ", "");

  addUser();
  updateCount();
}

function addUser() {
  if (playerName !== "") {
    var temp = countPlayer;
    if (temp > 0) {
      for (var user in allUsers) {
        if (allUsers[user].name !== playerName) {
          temp -= 1;
        } else {
          alert("Username taken!");
          playerName = null;
          gameState = 1;
        }
      }
    }

    if (temp === 0) {
      var playerNode = "players/" + playerName

      database.ref(playerNode).set({
        time: 0,
        name: playerName
      });

      alert("Your account has been made but your high score will only be set if you play the original game!");
      countPlayer += 1;
      gameState = 3;
    }
  } else {
    alert("Invalid Username!");
    playerName = null;
    gameState = 1;
  }
}

function checkUser() {
  if (gameState !== 1) {
    var temp = countPlayer;
    if (temp > 0) {
      for (var user in allUsers) {
        if (allUsers[user].name === playerName) {
          console.log("Account Found")
          refPoint = database.ref('players/' + playerName);
          gameState = 3;
        } else {
          temp -= 1;
        }
      }
    }

    if (temp === 0){
      alert("No account found!");
      playerName = null;
      gameState = 1;
    }
  }
}

function fetchInfo() {
  var refPlayers = database.ref('players');
  refPlayers.on("value", async (data) => {
    if (data.val() !== undefined) {
      allUsers = data.val();
    }
  });

  var refCount = database.ref('playerCount');
  refCount.on("value", async (data) => {
    if (data.val() !== undefined) {
      countPlayer = data.val();
    }
  });

  console.log("Got Data");
}

function updateCount() {
  database.ref('/').update({
    playerCount: countPlayer
  });
}

function getHighScore() {
  if (buttonChoice) {
    database.ref('players/' + playerName + '/time').on("value", (data) => {
      var temp = data.val();
      highestScore = temp
    })
  }
}

function updateHighScore() {
  refPoint.update({
    time: highestScore
  });
}
