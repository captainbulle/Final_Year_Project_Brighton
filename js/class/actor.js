function stickman(){
  this.coordX = 50;
  this.coordY = 20;
  this.hisSize = 40;
  this.head = 7.5;
  this.xDist = 10;
  this.yDist = 5;
  this.lgName = ("Actor Name".length/2)*6;
  this.passed = false;
  this.textHeight = 10;
}

/**
 * @brief Enlarge the attributes of the stickman for be more visible in the main canvas
 */
stickman.prototype.enlarge = function(){
  this.head *= 2;
  this.xDist *= 2;
  this.yDist *= 2;
  this.hisSize *= 2;
  this.lgName = ("Actor Name".length/2)*8;
  this.textHeight = 15;
}

/**
 * @brief Get the horizontal coordinate of the starting point
 * @return The X coordinate
 */
stickman.prototype.getCoordX = function(){
  return this.coordX;
}

/**
 * @brief Get the vertical coordinate of the starting point
 * @return The Y coordinate
 */
stickman.prototype.getCoordY = function(){
  return this.coordY;
}

/**
 * @brief Allows to know where finish the draw in horizontal
 * @return The X coordinate of the shape's end
 */
stickman.prototype.getEndX = function(name){
  var lg = (name.length/2)*8;
  if(lg > this.xDist)
    return lg;
  else
    return this.xDist;
}

/**
 * @brief Allows to know where start the draw in vertical
 * @return The Y coordinate of the shape's start
 */
stickman.prototype.getStartY = function(){
  return this.head-1; // to subtract to the starting point
}

/**
 * @brief Allows to know where finish the draw in vertical
 * @return The Y coordinate of the shape's end
 */
stickman.prototype.getEndY = function(){
  return this.hisSize+this.head+15; // to add to the starting point
}

/**
 * @brief Allows to know the four extremity of the shape
 * @param int coordX The X coordinate of the shape
 * @param int coordY The Y coordinate of the shape
 * @param String name Actor's name
 * @return int The four extremity of the shape and the middle of each axes
 */
stickman.prototype.getExtrems = function(coordX,coordY,name){
  var lX;
  var rX;
  var tY;
  var botY;
  var midX;
  var midY;
  lgName = (name.length/2)*8;
  if(lgName > this.xDist)
    width = lgName;
  else
    width = this.xDist;
  lX = parseInt(coordX)-parseInt(width);
  rX = parseInt(coordX)+parseInt(width);
  tY = parseInt(coordY)-parseInt(this.head)-1;
  botY = parseInt(coordY)+parseInt(this.hisSize)-parseInt(this.head)+this.textHeight;
  midX = (lX+rX)/2;
  midY = (tY+botY)/2;
  return {leftX:lX, rightX:rX, topY:tY, bottomY:botY, middleX:midX, middleY:midY};
}

/**
 * @brief Draw the form
 * @param object ctx The context of the canvas
 * @param int [coordX] The horizontal coordinate of the starting point
 * @param int [coordY] The vertical coordinate of the starting point
 * @param String [name] Actor's name
 */
stickman.prototype.draw = function(ctx,coordX,coordY,name){
  if(!coordX){
    coordX = this.coordX;
    coordY = this.coordY;
    name = "Actor Name";
    lgName = this.lgName;
  }else
    lgName = ((name.length/2)*8);

  var yneck = coordY + this.head;
  var ybody = coordY + (this.yDist*5);
  var yangle;
  var xangleL = coordX - this.xDist;
  var xangleR = coordX + this.xDist;

  ctx.beginPath();
  ctx.arc(coordX, coordY, this.head, 0, Math.PI*2); // draw Head
  ctx.moveTo(coordX, yneck); // Starting point
  ctx.lineTo(coordX, ybody); // draw neck + body
  yneck += this.yDist;
  yangle = yneck + this.yDist;
  ctx.moveTo(coordX, yneck);   // go back to the neck
  ctx.lineTo(xangleL, yangle); // left arm
  ctx.moveTo(coordX, yneck);   // go back to the neck
  ctx.lineTo(xangleR, yangle); // right arm
  ctx.moveTo(coordX, yneck);   // go back to the neck
  ctx.lineTo(coordX, ybody);   // go to the end of the body
  yangle = ybody + this.yDist;
  ctx.lineTo(xangleL, yangle); // left leg
  ctx.moveTo(coordX, ybody);   // go back to the end of the body
  ctx.lineTo(xangleR, yangle); // right leg
  ctx.moveTo(coordX, yneck);   // go back to the starting point
  ctx.stroke();
  ctx.closePath();

  ctx.fillText(name, coordX-lgName, coordY+this.hisSize+3);
}

/**
 * @brief Calculate the new coordinate X position
 * @param int coordX The horizontal coordinate of the starting point
 * @param int width The width of the actor
 * @param String [name] Actor's name
 * @return int The new X coordinate
 */
stickman.prototype.movingX = function(coordX,width,name){
  if(!name)
    name = "Actor Name";
  var lgName = (name.length/2)*8;

  // if the draw exceed the size of the canvas from the left
  if((coordX - this.xDist - lgName) < 0)
    this.coordX = this.xDist + lgName;
  // if the draw exceed the size of the canvas from the right
  else if((coordX + this.xDist + lgName) > width)
    this.coordX = (width - this.xDist - lgName);
  else
    this.coordX = coordX;
  return this.coordX;
}

/**
 * @brief Calculate the new coordinate Y position
 * @param int coordX The horizontal coordinate of the starting point
 * @param int height The size of the actor
 * @param int scrollTop The position of the scroll bar insight of the top
 * @return int The new Y coordinate
 */
stickman.prototype.movingY = function(coordY,height,scrollTop){
  var y = coordY + scrollTop;

  // if the draw exceed the size of the canvas from the top
  if(y < this.head+5)
    this.coordY = this.head+5;
  // if the draw exceed the size of the canvas from the bottom
  else if((y + this.hisSize+5) > height)
    this.coordY = (height - this.hisSize-5);
  else
    this.coordY = y;
  return this.coordY;
}

/**
 * @brief Calculate the new coordinate Y position
 * @param int coordX The horizontal position of the pointer
 * @param int coordY The vertical position of the pointer
 * @param Array actors The array which contains all informations about the actors
 * @return int The index of the actor (in the Array) of which the coordinates of the pointer are in
 *             and the number of the form
 */
stickman.prototype.isinside = function(coordX,coordY,actors){
  var width;
  var lg = actors.length;
  for(var i = 0, j = 1; i < lg; i += 4, ++j){
    lgName = (actors[i+2].length/2)*8;
    if(lgName > this.xDist)
      width = lgName;
    else
      width = this.xDist;

    if($('#actors_'+ j).is('.visible') && (coordX >= (actors[i]-width) && coordX <= (actors[i]+width) && coordY >= (actors[i+1]-this.head-1) && coordY <= (actors[i+1]+this.hisSize-this.head+this.textHeight)))
      return {indice:i, num:j};
  }
  return {indice:-1, num:0};
}