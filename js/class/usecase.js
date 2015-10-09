function ellipse(){
  this.coordX = 10;
  this.coordY = 80;
  this.w = (('Use Case'.length)*10); // ellipse width
  this.h = 20; // ellipse height
  this.radius = 37.5;
  this.passed = false;
  this.hText = 13;
}

/**
 * @brief Enlarge the attributes of the stickman for be more visible in the main canvas
 */
ellipse.prototype.enlarge = function(){
  this.h *= 2;
  this.radius *= 2;
  this.w = (('Use Case'.length)*18);
  this.hText = 25;
}

/**
 * @brief Get the horizontal coordinate of the starting point
 * @return The X coordinate
 */
ellipse.prototype.getCoordX = function(){
  return this.coordX;
}

/**
 * @brief Get the vertical coordinate of the starting point
 * @return The Y coordinate
 */
ellipse.prototype.getCoordY = function(){
  return this.coordY;
}

/**
 * @brief Get the use case's length
 * @return The lenght
 */
ellipse.prototype.getLenght = function(name){
  return ((name.length)*18);
}

/**
 * @brief Get the use case's height
 * @return The height
 */
ellipse.prototype.getHeight = function(){
  return this.h;
}

/**
 * @brief Allows to know the four extremity of the shape
 * @param int coordX The X coordinate of the shape
 * @param int coordY The Y coordinate of the shape
 * @param String name Use case's name
 * @return int The four extremity of the shape and the middle of each axes
 */
ellipse.prototype.getExtrems = function(coordX,coordY,name){
  var lX;
  var rX;
  var tY;
  var botY;
  var midX;
  var midY;
  lgName = ((name.length)*18)+2;
  lX = parseInt(coordX)-1;
  rX = parseInt(coordX)+parseInt(lgName);
  tY = parseInt(coordY)-2;
  botY = parseInt(coordY)+(parseInt(this.h))+2;
  midX = (lX+rX)/2;
  midY = (tY+botY)/2;
  return {leftX:lX, rightX:rX, topY:tY, bottomY:botY, middleX:midX, middleY:midY};
}

/**
 * @brief Draw the form
 * @param object ctx The context of the canvas
 * @param int [coordX] The horizontal coordinate of the starting point
 * @param int [coordY] The vertical coordinate of the starting point
 * @param String [name] Use case's name
 */
ellipse.prototype.draw = function(ctx,coordX,coordY,name){
  var h = this.h;
  var w;

  if(name){
    w = ((name.length)*18);
    hText = 25;
    //if(this.useName.length > 10) ....
  }else{
    name = "Use Case";
    coordX = this.coordX;
    coordY = this.coordY;
    w = this.w;
    hText = this.hText;
  }

  var kappa = .5522848;
  var ox = (w / 2) * kappa; // control point offset horizontal
  var oy = (h / 2) * kappa; // control point offset vertical
  var xe = coordX + w;      // x-end
  var ye = coordY + h;      // y-end
  var xm = coordX + w / 2;  // x-middle
  var ym = coordY + h / 2;  // y-middle
  
  ctx.beginPath();
  ctx.moveTo(coordX, ym);
  ctx.bezierCurveTo(coordX, ym - oy, xm - ox, coordY, xm, coordY);
  ctx.bezierCurveTo(xm + ox, coordY, xe, ym - oy, xe, ym);
  ctx.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
  ctx.bezierCurveTo(xm - ox, ye, coordX, ym + oy, coordX, ym);
  ctx.stroke();
  ctx.closePath();

  ctx.fillText(name, coordX+(w/5), coordY+hText);
}

/**
 * @brief Calculate the new coordinate X position
 * @param int coordX The horizontal coordinate of the starting point
 * @param int width The width of the use case
 * @param String [name] Use case's name
 * @return int The new X coordinate
 */
ellipse.prototype.movingX = function(coordX,width,name){
  if(!name)
    name = "Use Case";
  var w = ((name.length)*18);

  // if the draw exceed the size of the canvas from the left
  if((coordX) < 5)
    this.coordX = 5;
  // if the draw exceed the size of the canvas from the right
  else if((coordX + w+5) > width)
    this.coordX = (width - w-5);
  else
    this.coordX = coordX;
  return this.coordX;
}

/**
 * @brief Calculate the new coordinate Y position
 * @param int coordX The horizontal coordinate of the starting point
 * @param int height The size of the use case
 * @param int scrollTop The position of the scroll bar insight of the top
 * @return int The new Y coordinate
 */
ellipse.prototype.movingY = function(coordY,height,scrollTop){
  var y = coordY + scrollTop;

  // if the draw exceed the size of the canvas from the top
  if(y < this.h/2)
    this.coordY = this.h/4;
  // if the draw exceed the size of the canvas from the bottom
  else if((y + this.h+5) > height)
    this.coordY = (height - this.h-5);
  else
    this.coordY = y;
  return this.coordY;
}

/**
 * @brief Calculate the new coordinate Y position
 * @param int coordX The horizontal position of the pointer
 * @param int coordY The vertical position of the pointer
 * @param Array actors The array which contains all informations about the actors
 * @return int The index of the use case (in the Array) of which the coordinates of the pointer are in
 *             and the number of the form
 */
ellipse.prototype.isinside = function(coordX,coordY,uses){
  var lg = uses.length;
  for(var i = 0, j = 1; i < lg; i += 4, ++j){
    if($('#uses_'+ j).is('.visible') && (coordX >= (uses[i]-1) && coordX <= (uses[i]+((uses[i+2].length)*18)+2) && coordY >= (uses[i+1]-this.h-2) && coordY <= (uses[i+1]+this.h+2)))
      return {indice:i, num:j};
  }
  return {indice:-1, num:0};
}