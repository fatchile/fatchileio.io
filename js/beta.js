const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = 1700;
canvas.height = 900;

let score = 0;
let gameFrame = 0;
ctx.font = '50px Georgia';

//mouse interactivity
//line12 helps get the corner of the playable canvas
let canvasPosition= canvas.getBoundingClientRect();
const mouse = {
  x: canvas. width/2,
  y: canvas.height/2,
  click: false
}
//endline 20/21 helps with reconizing the corners of the playble canvas "corners"
//when mouse is click down
canvas.addEventListener('mousedown', function(event){
  mouse.click = true;
  mouse.x = event.x - canvasPosition.left;
  mouse.y = event.y - canvasPosition.top;

});
canvas.addEventListener('mouseup', function(){
  mouse.click = false;
})
//this code came form a youtube tutorial
//chanal name: Franks labratory, JavaScript 2d game tutorial.
const playerRight = new Image();
playerRight.src ='img/dragon0101.png';

class Player {
  constructor(){
    this.x = canvas.width;
    this.y = canvas.height/2;
    this.radius = 50;
    this.angle = 0;
    this.frameX = 0;
    this.frameY = 0;
    this.frame = 0;
    this.spriteWidth = 498;
    this.spriteHeight = 327;
      }
      update(){
        const dx = this.x - mouse.x;

        const dy = this.y - mouse.y;
        if(mouse.x != this.x){
          this.x -= dx/30;
        }
        if (mouse.y != this.y){
          this.y -= dy/30;
        }
      }
      draw(){
        if (mouse.click){
          ctx.lineWidth = 0.2;
          ctx.beginPath();
          ctx.moveTo(this.x, this.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
        }
        ctx.fillStyle = 'red';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI *2);
        ctx.fill();
        ctx.closePath();
        ctx.fillRect(this.x,this.y,this.radius, 10);

        ctx.drawImage(playerRight, this.x - 165 , this.y - 130, this.radius * 5 , this.radius * 5);
      }
}
const player = new Player();

//bubbles
const bubblesArray =[];
const bubblesImage = new Image();
bubblesImage.src = 'img/game_cricles.png';
class Bubble{
  constructor(){
    this.x = Math.random() * canvas.width;
    this.y = canvas.height + 100;
    this.radius = 50;
    this.speed = Math.random() * 5 + 1;
    this.distance;
    this.counted = false;
    this.sound = Math.random() <=0.5 ? 'sound1' : 'sound2';
  }
  //collison
  update(){
    this.y -= this.speed;
    const dx = this.x - player.x;
    const dy = this.y - player.y;
    this.distance = Math.sqrt(dx*dx + dy*dy);
  }
  draw(){
    ctx.fillStyle = 'blue';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
    ctx.stroke();
    ctx.drawImage(bubblesImage, this.x - 60, this.y - 60, this.radius * 2.5 , this.radius * 2.5);
  }
}
const deathPop1 = document.createElement('audio');
deathPop1.src = 'img/win1.wav';
const deathPop2 = document.createElement('audio');
deathPop2.src = 'img/win2.wav';

function handleBubbles(){
  if (gameFrame % 50 == 0){
    bubblesArray.push(new Bubble());

  }
  for (let i = 0; i < bubblesArray.length; i++){
  bubblesArray[i].update();
  bubblesArray[i].draw();
  }
  for (let i = 0; i < bubblesArray.length;  i++){
    if (bubblesArray [i].y < 0 - bubblesArray[i].radius * 2){
      bubblesArray.splice(i, 1);
    }
    if (bubblesArray[i].distance < bubblesArray[i].radius + player.radius){
        if (!bubblesArray[i].counted){
        if (bubblesArray[i].sound == 'sound1'){
          deathPop1.play();
        } else{
          deathPop2.play();
        }
        score++;
        bubblesArray[i].counted = true;
        bubblesArray.splice(i, 1);
      }

    }
  }
}
//repeating backgrounds
const background = new Image();
background.src = 'img/game1.jpg';

function handleBackground(){
  ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
}
//animation loop
function animate(){
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  handleBackground();
  handleBubbles();
  player.update();
  player.draw();
  ctx.fillStyle = 'black';
  ctx.fillText('score: ' + score, 10, 50);
  gameFrame++;
  requestAnimationFrame(animate);

}
animate();

window.addEventListener('resize', function(){
  canvasPosition = canvas.getBoundingClientRect();
})
