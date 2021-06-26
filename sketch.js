//gamestates
var PLAY = 1;
var END = 0;
var gameState = PLAY;

var edges;
var bgImg;
var jet, jetImg;
var bullet, bulletGroup, bulletImg;
var asteroid, asteroidGroup, a1, a2, a3;
var time, score, gamerate;
var over, overImg, restart, restartImg;

function preload() {
  bgImg = loadImage("bg.jpg");
  jetImg = loadImage("jet.png");
  overImg = loadImage("over.png");
  restartImg = loadImage("restart.png");
  bulletImg = loadImage("Bullet.png");
  a1 = loadImage("a1.png");
  a2 = loadImage("a2.png");
  a3 = loadImage("a3.png");
}

function setup() {
  createCanvas(displayWidth, displayHeight);

  edges = createEdgeSprites();

  jet = createSprite(displayWidth/4, displayHeight/2, 50, 50);
  jet.addImage(jetImg);
  jet.scale = 0.3;
  //jet.debug = true;
  jet.setCollider("rectangle",0,0,350,300);

  restart = createSprite(displayWidth/2, 4*displayHeight/5, 40, 40);
  restart.addImage(restartImg);
  restart.scale = 0.08;

  over = createSprite(displayWidth/2, displayHeight/4, 10, 10);
  over.addImage(overImg);
  over.scale = 0.15;

  bulletGroup = createGroup();
  asteroidGroup = createGroup();

  time = 0;
  score = 0;
  gamerate = ((time*score)/10)+1;
  //console.log(gamerate);
}

function draw() {
  background(bgImg);

  jet.collide(edges);

  fill("black");
  textSize(24);
  stroke("yellow");
  text("SURVIVAL TIME: " + time, displayWidth / 17, displayHeight / 10);
  text("SCORE: "+score, displayWidth/17, displayHeight/7);

  if(gameState === 1) {

    restart.visible = false;
    over.visible = false;

    if (keyDown("up_arrow")) {
      jet.y -= 5;
    }

    if (keyDown("down_arrow")) {
      jet.y += 5;
    }

    time = Math.round(frameCount / getFrameRate());

    bullets();
    spawnAsteroid();

    if(asteroidGroup.isTouching(bulletGroup)) {
      score += 1;
      asteroidGroup.destroyEach();
      bulletGroup.destroyEach();
    }

    if(jet.isTouching(asteroidGroup) ||
       asteroidGroup.isTouching(edges[0])) {
      gameState = 0;
    }
    
  } else 
  if(gameState === 0) {
    restart.visible = true;
    over.visible = true;

    asteroidGroup.setLifetimeEach(-1);

    asteroidGroup.setVelocityXEach(0);
    //BulletGroup.setVelocityXEach(0);

    if(mousePressedOver(restart)) {
      reset();
    }
  }

  drawSprites();
}

function reset() {
  gameState = 1;
  time = 0;
  score = 0;
  jet.y = displayHeight/2;
  asteroidGroup.destroyEach();
}

function bullets() {
  if(keyDown("space")) {
    bullet = createSprite(displayWidth/2, displayHeight/2, 7,3);
    bullet.setCollider("rectangle",0,0,300,50);
    bullet.scale = 0.2;
    //bullet.debug = true;
    bullet.addImage(bulletImg);
    bullet.x = jet.x;
    bullet.y = jet.y;
    bullet.velocityX = 8;
    bullet.lifetime = 800;
    bulletGroup.add(bullet);
  }
}

function spawnAsteroid() {
  if(frameCount%120/((time/2)+1) === 0) {
    asteroid = createSprite(displayWidth, random(0,displayHeight), 50, 50);
    asteroidGroup.add(asteroid);
    asteroid.velocityX = -(5+gamerate);
    asteroid.lifetime = 1000;
    //asteroid.debug = true;

    rand = Math.round(random(1,3));
    switch(rand) {
      case 1: asteroid.addImage(a1);
              asteroid.scale = 0.25;
              asteroid.setCollider("rectangle",0,0,400,500);
              break;

      case 2: asteroid.addImage(a2);
              asteroid.scale = 0.3;
              asteroid.setCollider("rectangle",0,0,350,350);
              break;

      case 3: asteroid.addImage(a3);
              asteroid.scale = 0.3;
              asteroid.setCollider("rectangle",0,0,400,370);
              break;

      default: break;
    }
  }
}