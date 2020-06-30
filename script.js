var El2kill = null; //Enemies killed
//key codes
var LEFT_KEY = 37;
var UP_KEY = 38;
var RIGHT_KEY = 39;
var DOWN_KEY = 40;
var SPACE_KEY = 32;
var HERO_MOVEMENT = 10; //speed of the character

var lastLoopRun = 0;
var score = 0;
var iterations = 0; //time the game has run since loaded

//i do not understand this
var controller = new Object();
var enemies = new Array();

function createSprite(element, x, y, w, h) {
  var result = new Object();
  result.element = element;
  result.x = x;
  result.y = y;
  result.w = w;
  result.h = h;
  return result;
}

//Keys for the character to move
function toggleKey(keyCode, isPressed) {
  console.log(keyCode);
  if (keyCode == LEFT_KEY || keyCode == 65) {
    controller.left = isPressed;
  }
  if (keyCode == RIGHT_KEY || keyCode == 68) {
    controller.right = isPressed;
  }
  if (keyCode == UP_KEY || keyCode == 87) {
    controller.up = isPressed;
  }
  if (keyCode == DOWN_KEY || keyCode == 83) {
    controller.down = isPressed;
  }
  if (keyCode == SPACE_KEY) {
    controller.space = isPressed;
  } 
  if (keyCode == 82) {
    location.reload();
  } 
}

//i honestly do not understand this part
function intersects(a, b) {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

//stop the character when he hits the wall
function ensureBounds(sprite, ignoreY) {
  if (sprite.x < 0) {
    sprite.x = 0;
  }
  if (!ignoreY && sprite.y < 0) {
    sprite.y = 0;
  }
  if (sprite.x + sprite.w > 259) {
    sprite.x = 259 - sprite.w;
  }
  if (!ignoreY && sprite.y + sprite.h > 450) {
    sprite.y = 450 - sprite.h;
  }
}

//i dont understand this part either
function setPosition(sprite) {
  var e = document.getElementById(sprite.element);
  e.style.left = sprite.x + 'px';
  e.style.top = sprite.y + 'px';
}

//
function handleControls() {
  if (controller.up) {
    hero.y -= HERO_MOVEMENT;
  }
  if (controller.down) {
    hero.y += HERO_MOVEMENT;
  }
  if (controller.left) {
    hero.x -= HERO_MOVEMENT;
  }
  if (controller.right) {
    hero.x += HERO_MOVEMENT;
  }
  if (controller.space && laser.y <= -120) {
    laser.x = hero.x + 17;
    laser.y = hero.y - laser.h + 18;
  }
  
  ensureBounds(hero);
}

//when a zumb is killed
function killEnemy(element){
      element.style.visibility = 'hidden';
      element.parentNode.removeChild(element);
}

//checks if laser hits a zumb + scoring system
function checkCollisions() {
  for (var i = 0; i < enemies.length; i++) {
    if (intersects(laser, enemies[i])) {
      var element = document.getElementById(enemies[i].element);
      element.style.background ='#e54e3b';
      
      killEnemy(element);

      enemies.splice(i, 1);
      i--;
      laser.y = -laser.h;
      score += Math.floor(Math.random() * 3)+1;
      document.getElementById("score").style.color = "#a6e06b";
      //i do not know how to change the color back to white after 700 ms, just doesnt work the way i know how to do it
    } else if (intersects(hero, enemies[i])) {
      gameOver();
    } else if (enemies[i].y + enemies[i].h >= 467) {
      var element = document.getElementById(enemies[i].element);
      element.style.visibility = 'hidden';
      element.parentNode.removeChild(element);
      enemies.splice(i, 1);
      i--;
      if (score > 0) {score -= Math.floor(Math.random() * 2)+1};
    }
  }
}

//when character is killed
function removeHero(element){
  element.style.visibility = 'hidden';
}
function relGame() {
  location.reload();
}

//when character is killed
function gameOver() {
    var element = document.getElementById(hero.element);
    element.style.visibility = 'hidden';
    element = document.getElementById('gameover');
    element.style.visibility = 'visible';
    var texty = document.getElementById('gameoverunder');
    texty.style.visibility = 'visible';
    texty.innerHTML = 'Your game will restart in 5';
    setTimeout(function() {
        texty.innerHTML = 'Your game will restart in 4';
    }, 1000);
    setTimeout(function() {
        texty.innerHTML = 'Your game will restart in 3';
    }, 1000);
    setTimeout(function() {
        texty.innerHTML = 'Your game will restart in 2';
    }, 1000);
    setTimeout(function() {
        texty.innerHTML = 'Your game will restart in 1';
    }, 1000);
    setTimeout(function() {
        relGame();
    }, 1000);
}

//scoring and stuff
function showSprites() {
  setPosition(hero);
  setPosition(laser);
  for (var i = 0; i < enemies.length; i++) {
    setPosition(enemies[i]);
  }
  var scoreElement = document.getElementById('score');
  scoreElement.innerHTML = 'S/' + score;
}

function updatePositions() {
  for (var i = 0; i < enemies.length; i++) {
    enemies[i].y += 1.5;
    enemies[i].x += Math.floor(Math.random() * 2) - 0.5;
    ensureBounds(enemies[i], true);
  }
  laser.y -= 60; //laser speed
}

//spawning zumbs according to the time played
function addEnemy() {
  var interval = 50;
  if (iterations > 5500) {
    interval = 5;
  } else if (iterations > 5000) {
    interval = 15;
  } else if (iterations > 3000) {
    interval = 25;
  } else if (iterations > 2000) {
    interval = 45;
  } else if (iterations > 1000) {
    interval = 60;
  }
   //tried my best to understand this, i think this iswhat happens when the enemy spawns
  if (getRandom(interval) == 0) {
    var elementName = 'enemy' + getRandom(10000000);
    var enemy = createSprite(elementName, getRandom(260), -40, 35, 35);
    var element = document.createElement('div');
    element.id = enemy.element;
    element.className = 'enemy'; 
    document.children[0].appendChild(element);
    
    enemies[enemies.length] = enemy;
  }
}

//have no idea what this does
function getRandom(maxSize) {
  return parseInt(Math.random() * maxSize);
}

//loops something
function loop() {
    if (new Date().getTime() - lastLoopRun > 40) {
      updatePositions();
      handleControls();
      checkCollisions();
      
      addEnemy();
      
      showSprites();
      
      lastLoopRun = new Date().getTime();
      iterations++;
    }
  }
  
  document.onkeydown = function(evt) {
    toggleKey(evt.keyCode, true);
  };
  
  document.onkeyup = function(evt) {
    toggleKey(evt.keyCode, false);
  };
  function animate() {
    globalID = requestAnimationFrame(animate);
    loop()
  };
  //spawns character
  var hero = createSprite('hero', 123, 410, 20, 20);
  var laser = createSprite('laser', 0, -120, 2, 50);
  
  animate()
