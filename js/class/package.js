function package(){
  this.coordX = 10;
  this.coordY = 120;
  this.wTitle = (("Package".length)*9);
  this.hTitle = 22;
  this.wBox = this.wTitle+15;
  this.hBox = 35;
  this.passed = false;
}

/**
 * @brief Enlarge the attributes of the package for be more visible in the main canvas
 */
package.prototype.enlarge = function(){
  this.hBox *= 2;
  this.wTitle = (("Package".length)*12);
  this.wBox = this.wTitle+50;
}

/**
 * @brief Get the package's width
 * @return The width
 */
package.prototype.getwidth = function(){
  return this.wBox;
}

/**
 * @brief Get the package's height
 * @return The height
 */
package.prototype.getheight = function(){
  return this.hTitle+this.hBox;
}

/**
 * @brief Get the horizontal coordinate of the starting point
 * @return The X coordinate
 */
package.prototype.getCoordX = function(){
  return this.coordX;
}

/**
 * @brief Get the vertical coordinate of the starting point
 * @return The Y coordinate
 */
package.prototype.getCoordY = function(){
  return this.coordY;
}

/**
 * @brief Draw the form
 * @param object ctx The context of the canvas
 * @param int [coordX] The horizontal coordinate of the starting point
 * @param int [coordY] The vertical coordinate of the starting point
 * @param String [name] Package's name
 * @param int [heightBox] The height of the box which contain the use cases
 */
package.prototype.draw = function(ctx,coordX,coordY,name,heightBox){
  var wTitle;
  var wBox;
  if(!coordX){
    coordX = this.coordX;
    coordY = this.coordY;
    name = "Package";
    heightBox = this.hBox;
    wTitle = this.wTitle;
    wBox = this.wBox;
  }else{
    wTitle = ((name.length)*12);
    wBox = wTitle + 50;
  }

  ctx.beginPath();
  ctx.moveTo(coordX, coordY);
  ctx.strokeRect(coordX, coordY, wTitle, this.hTitle);
  ctx.strokeRect(coordX, coordY+this.hTitle, wBox, heightBox);
  ctx.stroke();
  ctx.closePath();

  ctx.fillText(name, coordX+10, coordY+15);
}

/**
 * @brief Calculate the new coordinate X position
 * @param int coordX The horizontal coordinate of the starting point
 * @param int width The width of the package
 * @return int The new X coordinate
 */
package.prototype.movingX = function(coordX,width){
  // if the draw exceed the size of the canvas from the left
  if(coordX < 5)
    this.coordX = 5;
  // if the draw exceed the size of the canvas from the right
  else if((coordX + this.wBox+5) > width)
    this.coordX = (width - this.wBox-5);
  else
    this.coordX = coordX;
  return this.coordX;
}

/**
 * @brief Calculate the new coordinate Y position
 * @param int coordX The horizontal coordinate of the starting point
 * @param int height The size of the package
 * @param int scrollTop The position of the scroll bar insight of the top
 * @param int hBox The height of the box
 * @return int The new Y coordinate
 */
package.prototype.movingY = function(coordY,height,scrollTop,hBox){
  var y = coordY + scrollTop;
  if(!hBox)
    hBox = this.hBox;

  // if the draw exceed the size of the canvas from the top
  if(y < 5)
    this.coordY = 5;
  // if the draw exceed the size of the canvas from the bottom
  else if((y + this.hTitle+hBox+5) > height)
    this.coordY = (height - this.hTitle-hBox-5);
  else
    this.coordY = y;
  return this.coordY;
}