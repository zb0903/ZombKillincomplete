class Game {
  constructor() {
    this.resetTitle = createElement("h2");
    this.resetButton = createButton("");
 
    this.leadeboardTitle = createElement("h2");

    this.leader1 = createElement("h2");
    this.leader2 = createElement("h2");

    this.weaponMovingDir = null;
   
    //this.playerMoving = false;
    this.leftKeyActive = false;
    //this.blast = false;
  }
   //To do: remove all references to playerMoving : done
  getState() {
    var gameStateRef = database.ref("gameState");
    gameStateRef.on("value", function(data) {
      gameState = data.val();
    });
  }
  update(state) {
    database.ref("/").update({
      gameState: state
    });
  }

  start() {
    player = new Player();
    playerCount = player.getCount();

    form = new Form();
    form.display();

    player1 = createSprite(width / 2 - 50, height - 100);
    player1.addImage("player1", player1_img);
    //player1.addImage("blast", blastImg);
    player1.scale = 0.1;

    player2 = createSprite(width / 2 + 100, height - 100);
    player2.addImage("player2", player2_img);
   // player2.addImage("blast", blastImg);
    player2.scale = 0.1;

    players = [player1, player2];
// To do: fuels will become bullets, powercoins will become fireballs, obstacles are grenades: done
//To do: add bullet pack image and fire image: done
// To do: remove bg from player 2 image: done
// To do: laterally invert zombie: done
//To do: remove bg of bullet: done
//To do: create weapon1, weapon2   
bullets = new Group();
    fireballs = new Group();

    obstacles = new Group();
// To do: no nedd for obstaclle positions: done
   /* var obstaclesPositions = [
      { x: width / 2 + 250, y: height - 800, image: obstacle2Image },
      { x: width / 2 - 150, y: height - 1300, image: obstacle1Image },
      { x: width / 2 + 250, y: height - 1800, image: obstacle1Image },
      { x: width / 2 - 180, y: height - 2300, image: obstacle2Image },
      { x: width / 2, y: height - 2800, image: obstacle2Image },
      { x: width / 2 - 180, y: height - 3300, image: obstacle1Image },
      { x: width / 2 + 180, y: height - 3300, image: obstacle2Image },
      { x: width / 2 + 250, y: height - 3800, image: obstacle2Image },
      { x: width / 2 - 150, y: height - 4300, image: obstacle1Image },
      { x: width / 2 + 250, y: height - 4800, image: obstacle2Image },
      { x: width / 2, y: height - 5300, image: obstacle1Image },
      { x: width / 2 - 180, y: height - 5500, image: obstacle2Image }
    ];*/

    // Adding bullet sprite in the game
    this.addSprites(bullets, 4, bulletImage, 0.1);

    // Adding coin sprite in the game
    this.addSprites(fireballs, 4, fireballImage, 0.2);

    //Adding obstacles sprite in the game
    this.addSprites(
      obstacles,
      5,
      obstacle1Image,
      0.04
    );
  }

  addSprites(spriteGroup, numberOfSprites, spriteImage, scale) {
    for (var i = 0; i < numberOfSprites; i++) {
      var x, y;
     
        x = random(10, width - 10);
        y = random(10, height - 10);

      var sprite = createSprite(x, y);
      sprite.addImage("sprite", spriteImage);

      sprite.scale = scale;
      spriteGroup.add(sprite);
    }
  }

  handleElements() {
    form.hide();
    form.titleImg.position(40, 50);
    form.titleImg.class("gameTitleAfterEffect");

    //C39
    this.resetTitle.html("Reset Game");
    this.resetTitle.class("resetText");
    this.resetTitle.position(width / 2 + 200, 40);

    this.resetButton.class("resetButton");
    this.resetButton.position(width / 2 + 230, 100);

    this.leadeboardTitle.html("Leaderboard");
    this.leadeboardTitle.class("resetText");
    this.leadeboardTitle.position(width / 3 - 60, 40);

    this.leader1.class("leadersText");
    this.leader1.position(width / 3 - 50, 80);

    this.leader2.class("leadersText");
    this.leader2.position(width / 3 - 50, 130);
  }

  play() {
    this.handleElements();
    this.handleResetButton();

    Player.getPlayersInfo();
    player.getCarsAtEnd();
 
    if (allPlayers !== undefined) {
      //image(track, 0, -height * 5, width, height * 6);

      this.showBullets();
      this.showLife();
      this.showFireballs();
      //this.showLeaderboard();

      if(player.life<=0){
        this.gameOver();
      }
      //index of the array
      var index = 0;
      for (var plr in allPlayers) {
        //add 1 to the index for every loop
        index = index + 1;

        //use data form the database to display the cars in x and y direction
        var x = allPlayers[plr].positionX;
        var y = height - allPlayers[plr].positionY;

        var currentLife = allPlayers[plr].life;
        if (currentLife <= 0){
          //players[index-1].changeImage("blast")
          players[index-1].scale = 0.3
        }

        players[index - 1].position.x = x;
        players[index - 1].position.y = y;

        if (index === player.index) {
          stroke(10);
          fill("red");
          ellipse(x, y, 60, 60);

          this.handleBullets(index);
          this.handleFireballs(index);
          this.handleObstacles(index);
         // this.handlePlayerACollisionWithPlayerB(index);
          if (player.life <= 0){
           // this.blast = true;
            //this.playerMoving = false;
          }

          // Changing camera position in y direction
         // camera.position.y = players[index - 1].position.y;
        }
      }

      /*if (this.playerMoving) {
        player.positionY += 5;
        player.update();
      }*/

      // handling keyboard events
      this.handlePlayerControls();

      // Finshing Line
      const finshLine = height * 6 - 100;

      if (player.positionY > finshLine) {
        gameState = 2;
        player.rank += 1;
        Player.updateCarsAtEnd(player.rank);
        player.update();
        this.showRank();
      }

      drawSprites();
    }
  }

  handleResetButton() {
    this.resetButton.mousePressed(() => {
      database.ref("/").set({
        playerCount: 0,
        gameState: 0,
        players: {},
        carsAtEnd: 0
      });
      window.location.reload();
    });
  }

  showLife() {
    push();
    image(lifeImage,width/2,10, 20, 20);
    fill("white");
   // rect(width / 2 - 100, height - player.positionY - 275, 185, 20);
    //fill("#f50057");
    //rect(width / 2 - 100, height - player.positionY - 275, player.life, 20);
    //noStroke();
    text(player.life,width/2+30,10)
    pop();
  }
//To do: write show fireballs like show bullets: done
  showBullets() {
    push();
    image(bulletImage, width/2, 40, 20,20);

    fill("white");
    /*rect(width / 2 - 100, height - player.positionY - 225, 185, 20);
    fill("#ffc400");
    rect(width / 2 - 100, height - player.positionY - 225, player.bullet, 20);
    noStroke();*/
    //To do: Also show opponents bullets: added to firebase
    text(player.bullets, width/2 + 30, 40)
    pop();
  }

  showFireballs() {
    push();
    image(fireballImage, width/2, 70, 20,20);

    fill("white");
    text(player.fireballs, width/2 + 30, 70)
    pop();
  }

  showLeaderboard() {
    var leader1, leader2;
    var players = Object.values(allPlayers);
    if (
      (players[0].rank === 0 && players[1].rank === 0) ||
      players[0].rank === 1
    ) {
      // &emsp;    This tag is used for displaying four spaces.
      leader1 =
        players[0].rank +
        "&emsp;" +
        players[0].name +
        "&emsp;" +
        players[0].score;

      leader2 =
        players[1].rank +
        "&emsp;" +
        players[1].name +
        "&emsp;" +
        players[1].score;
    }

    if (players[1].rank === 1) {
      leader1 =
        players[1].rank +
        "&emsp;" +
        players[1].name +
        "&emsp;" +
        players[1].score;

      leader2 =
        players[0].rank +
        "&emsp;" +
        players[0].name +
        "&emsp;" +
        players[0].score;
    }

    this.leader1.html(leader1);
    this.leader2.html(leader2);
  }

  handlePlayerControls() {
    //if (this.blast !== true){
      if (keyIsDown(UP_ARROW) && player.positionY < height - 15) {
         player.positionY += 5; player.update(); 
        } 
      if (keyIsDown(DOWN_ARROW) && player.positionY >15) { 
        player.positionY -= 5; player.update();
       } 
      if (keyIsDown(LEFT_ARROW) && player.positionX > 15) {
         player.positionX -= 5; player.update(); this.leftKeyActive = true;
         } 
      if (keyIsDown(RIGHT_ARROW) && player.positionX < width - 15) {
         player.positionX += 5; player.update();
         }
   // }
   
  }

  handleBullets(index) {
    // Adding bullet
    players[index - 1].overlap(bullets, function(collector, collected) {
      //To do: depending on pack touched, no of bullets has to be increased: have to ask ma'am
      player.bullets +=10;
      //collected is the sprite in the group collectibles that triggered
      //the event
      collected.remove();
    });

  /*  if (player.bullet <= 0) {
      gameState = 2;
      this.gameOver();
    }*/
  }

  handleFireballs(index) {
    players[index - 1].overlap(fireballs, function(collector, collected) {
     //To do: depending on pack touched, no of fireballs has to be increased: how?
      player.fireballs += 5;
      player.update();
      //collected is the sprite in the group collectibles that triggered
      //the event
      collected.remove();
    });
  }

  handleObstacles(index) {
    if (players[index - 1].collide(obstacles)) {
      if (this.leftKeyActive) {
        player.positionX += 100;
      } else {
        player.positionX -= 100;
      }

      //Reducing Player Life
      if (player.life > 0) {
        player.life -= 1
      }

      player.update();
    }
  }

  showRank() {
    swal({
      title: `Awesome!${"\n"}Rank${"\n"}${player.rank}`,
      text: "You reached the finish line successfully",
      imageUrl:
        "https://raw.githubusercontent.com/vishalgaddam873/p5-multiplayer-car-race-game/master/assets/cup.png",
      imageSize: "100x100",
      confirmButtonText: "Ok"
    });
  }

  gameOver() {
    swal({
      title: `Game Over`,
      text: player.life<=0? "Oops you lost....!!!":"You have won!!!",
      imageUrl:  player.life<=0? 
        "https://cdn.shopify.com/s/files/1/1061/1924/products/Thumbs_Down_Sign_Emoji_Icon_ios10_grande.png":
        "https://cdn.shopify.com/s/files/1/1061/1924/products/Thumbs_Up_Sign_Emoji_Icon_ios10_grande.png",
      imageSize: "100x100",
      confirmButtonText: "Thanks For Playing"
    });
  }
//To do: evaluate whether u need it: don't think so...
  handlePlayerACollisionWithPlayerB(index){
    if(index==1){
      if (players[index-1].collide(players[1])){
        if (this.leftKeyActive) {
          player.positionX += 100;
        } else {
          player.positionX -= 100;
        }
        if (player.life > 0) {
          player.life -= 185 / 4;
        }
      }
    }

    if(index==2){
      if (players[index-1].collide(players[0])){
        if (this.leftKeyActive) {
          player.positionX += 100;
        } else {
          player.positionX -= 100;
        }
        if (player.life > 0) {
          player.life -= 185 / 4;
        }
      }
    }
  }
  handleAttackControls() {
    if ((player.index==1 && player.fires > 0) || (player.index == 2 && player.bullets > 0) ){
      if (keyDown("w") && this.weaponMovingDir== null) {
        this.weaponMovingDir = "w"; 
        player.weaponX = player.positionX;
        player.weaponY = player.positionY;   
        if (player.index == 1) player.fires--;
        else
        player.bullets--;    
      }
      if (keyDown("s")&& this.weaponMovingDir== null) {
        this.weaponMovingDir = "s";
        player.weaponX = player.positionX;
        player.weaponY = player.positionY;
        if (player.index == 1) player.fires--;
        else
        player.bullets--;
      }

      if (keyDown("a") && this.weaponMovingDir== null) {
        this.weaponMovingDir = "a";
        player.weaponX = player.positionX;
        player.weaponY = player.positionY;
        if (player.index == 1) player.fires--;
        else
        player.bullets--;
      }

      if (keyDown("d") && this.weaponMovingDir== null) {
        this.weaponMovingDir = "d";
        player.weaponX = player.positionX;
        player.weaponY = player.positionY;
        if (player.index == 1) player.fires--;
        else
        player.bullets--;
      }
      if (this.weaponMovingDir=="a") player.weaponX -=10;
      if (this.weaponMovingDir=="d") player.weaponX +=10;
      if (this.weaponMovingDir=="w") player.weaponY -=10;
      if (this.weaponMovingDir=="s") player.weaponY +=10;
      
      if (this.weaponMovingDir != null){
        if (player.weaponX > width || player.weaponX < 0 || player.weaponY > height || player.weaponY < 0) {
          // weapon is done with its journey
          this.weaponMovingDir = null;
          player.weaponX = -1000;
          player.weaponY = -1000;
        }
        player.update();
      }
    }
  }

}

