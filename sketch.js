var canvas;
var backgroundImage, player1_img, player2_img, track;
var fuelImage, powerCoinImage, lifeImage;
var obstacle1Image, obstacle2Image;
var database, gameState;
var form, player, playerCount;
var allPlayers, player1, player2, fuels, powerCoins, obstacles;
var blastImg;
var bullets, fireballs;
var players = [];

function preload() {
  backgroundImage = loadImage("./assets/background.png");
  player1_img = loadImage("./assets/tank.png");
  player2_img = loadImage("./assets/zombie.gif");
  bulletPack = loadImage("./assets/BulletPack.png")
  //track = loadImage("../assets/track.jpg");
  bulletImage = loadImage("./assets/bullet.png");
  fireballImage = loadImage("./assets/fireball.png");
  obstacle1Image = loadImage("./assets/hand.jpg");
  //obstacle2Image = loadImage("./assets/obstacle2.png");
  lifeImage = loadImage("./assets/life.png");
  blastImg = loadImage("./assets/blast.png");
}

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  database = firebase.database();
  game = new Game();
  game.getState();
  game.start();
}

function draw() {
  background(backgroundImage);
  if (playerCount === 2) {
    game.update(1);
  }

  if (gameState === 1) {
    game.play();
  }

  if (gameState === 2) {
    game.showLeaderboard();
    game.end();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
