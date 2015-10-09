window.onload = function(){
  var canvas = document.getElementById('canvas');
  if(!canvas){
    alert("canvas unknow");
    return;
  }
  var ctx = canvas.getContext('2d');
  if(!ctx){
    alert("Problem with canvas, impossible to get context");
    return;
  }
  
  canvas.width = 600;
  canvas.height = 400;
  
  var rayon = 20;
  var posX = 1+rayon;
  var posY = posX;
  var vitesseX = 3;
  var vitesseY = 3;

  function animate(){
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	
	ctx.beginPath();
    ctx.arc(posX, posY, rayon, 0, Math.PI*2);
	ctx.stroke();
    ctx.closePath();
	
	//Si on touche le bord gauche ou droit
	if(posX+rayon >= canvas.width || posX <= 0+rayon){
		vitesseX *= -1;//On inverse la vitesse de déplacement sur l'axe horizontal.
	}

	//Si on touche le bord du bas ou du haut
	if(posY+rayon >= canvas.height || posY <= 0+rayon){
		vitesseY *= -1;//On inverse la vitesse de déplacement sur l'axe vertical.
	}
	
	posX += vitesseX;
	posY += vitesseY;
  }
  
  var interval = setInterval(animate, 35); // 35 millisecondes (1000 / 35 = 28.5 images par seconde)
}


function addGenerator(x){
  return function(y){
    return x+y;
  };
}

var addFive=addGenerator(5);
var addOne=addGenerator(1);

console.log(addFive(5));
console.log(addOne(5));

var buttons = [];

for(var i=0;i<5;++i){
  buttons[i] = (
  function(x) {
    var button = document.createElement('input');
    button.type = 'button';
    return function(){
      button.value = 'button '+x;
      button.onclick = alert('button '+x);
      document.body.appendChild(button);
      console.log(x);
      return true;
    };
  })(i);
  
}