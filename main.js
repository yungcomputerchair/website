/*
* Main Javascript file.
* Gent Semaj, AGPLv3.
* 4/27/2020
*/

var stars = [];
var ships = [];

var ticksToNext = 17*3;

var canvas = document.getElementById("canvas");
resizeCanvas();
initialize();

function toStandard(bearing) {
  return (bearing - 90) * -1;
}

function resizeCanvas() {
  canvas.width = document.body.clientWidth;
  canvas.height = document.body.clientHeight;
}

function initialize() {
  // Create stars
  for(var i = 0; i < 400; i++) {
    var starX = Math.random() * 2 * canvas.width - (canvas.width / 2);
    var starY = Math.random() * 2 * canvas.height - (canvas.height / 2);
    stars.push({x:starX, y:starY});
  }

  setInterval(tick, 17);
}

function reset(ctx) {
  ctx.resetTransform();
  ctx.translate(0, 0.5);
  ctx.lineWidth = 1;
}

function paint() {
  var ctx = canvas.getContext("2d");

  // Base
  reset(ctx);
  ctx.fillStyle = "#000000";
  ctx.fillRect(-10, -10, canvas.width + 20, canvas.height + 20);

  // Render  stars
  ctx.fillStyle = "#FFFFFF";
  for(var s = 0; s < stars.length; s++) {
    var star = stars[s];
    if(star.x > -10 && star.x < canvas.width + 10 && star.y > -10 && star.y < canvas.height + 10) {
      reset(ctx);
      ctx.fillRect(star.x - 2, star.y - 2, 4, 4);
    }
  }

  // Render ships
  for(var i = 0; i < ships.length; i++) {
    var ship = ships[i];
    if(ship.x > -60 && ship.x < canvas.width + 60 && ship.y > -60 && ship.y < canvas.height + 60) {
      reset(ctx);
      ctx.translate(ship.x, ship.y);
      ctx.fillStyle = ship.color;
      ctx.rotate(ship.rot * Math.PI / 180.0);
      ctx.beginPath();
      ctx.moveTo(0, -36);
      ctx.lineTo(30, 30);
      ctx.lineTo(-30, 30);
      ctx.closePath();
      ctx.fill();

      ctx.translate(ship.x, ship.y);
    }
  }
}

function reset(context) {
  context.resetTransform();
  context.translate(0, 0.5);
  context.lineWidth = 1;
}

function spawnShip() {
  var template = {
    x: -100,
    y: -100,
    color: "#"+(0x1000000+(Math.random())*0xffffff).toString(16).substr(1,6),
    rot: 0,
    vRot: Math.random() * .25 - .5,
    vLin: Math.random() * 15 + 5,
    kill: 0
  }

  /* I know this is messy but it's 1:31 AM, work with me here */
  if(Math.random() < .5) {
    // use full x range
    template.x = (Math.random() * canvas.width / 2 + 60) * (Math.random() < .5 ? -1 : 1);
    template.y = (Math.random() < .5) ? -Math.random() * canvas.height / 2 - 60 : Math.random() * canvas.height / 2 + canvas.height + 60;
  } else {
    // use full y range
    template.x = (Math.random() < .5) ? -Math.random() * canvas.width / 2 - 60 : Math.random() * canvas.width / 2 + canvas.width + 60;
    template.y = (Math.random() * canvas.height / 2 + 60) * (Math.random() < .5 ? -1 : 1);
  }

  template.rot = Math.atan2((template.y - canvas.height/2) , (template.x - canvas.width/2)) * 180.0 / Math.PI + 270 + (Math.random()*10 - 5);
  ships.push(template);
}

function isAlive(s) {
  return s.kill < 17*3;
}

function tick() {

  ticksToNext--;
  if(ticksToNext < 0) {
    ticksToNext += 17 * (Math.random() * 4);
    spawnShip();
  }

  for(var i = 0; i < ships.length; i++) {

    if(ships[i].x > canvas.width + 60 || ships[i].x < -60 || ships[i].y > canvas.height + 60 || ships[i].y < -60) {
      ships[i].kill++;
    }

    if(ships[i].rot > 359) ships[i].rot -= 360;
    if(ships[i].rot < 0) ships[i].rot += 360;
    ships[i].rot += ships[i].vRot;

    ships[i].vRot *= .995;

    var theta = toStandard(ships[i].rot) * Math.PI / 180;
    ships[i].x += ships[i].vLin * Math.cos(theta);
    ships[i].y -= ships[i].vLin * Math.sin(theta);
  }

  ships = ships.filter(isAlive);

  paint();
}
