function lineToDraw(){
  this.passed = false;
}

/**
 * @brief Draw a line
 * @param object ctx The context of the canvas
 * @param Array form1 All the informations about the first shape to connect in an Array
 * @param Array form2 All the informations about the first shape to connect in an Array
 * @param int genre The type of line to draw
 * @return int The 2 coordinates of the starting point and of the finish point
 */
lineToDraw.prototype.draw = function(ctx,form1,form2,genre){
  var position = this.calculate(form1,form2);
  switch(genre){
    case 1:
    this.drawSimpleLine(ctx,position.startX,position.startY,position.endX,position.endY);
    break;

    case 2:
    this.drawExtIncl(ctx,position.startX,position.startY,position.endX,position.endY,"<< extends >>");
    break;

    case 3:
    this.drawExtIncl(ctx,position.startX,position.startY,position.endX,position.endY,"<< include >>");
    break;
  }

  return {startX:position.startX, startY:position.startY, endX:position.endX, endY:position.endY};
}

/**
 * @brief Draw a simple line
 * @param object ctx The context of the canvas
 * @param int startX The horizontal position of the starting point
 * @param int startY The vertical position of the starting point
 * @param int endX The horizontal position of the ending point
 * @param int endY The vertical position of the ending point
 */
lineToDraw.prototype.drawSimpleLine = function(ctx,startX,startY,endX,endY){
  ctx.beginPath();
  ctx.moveTo(startX, startY);
  ctx.lineTo(endX, endY);
  ctx.stroke();
  ctx.closePath();
}

/**
 * @brief Draw a dashed line
 * @param object ctx The context of the canvas
 * @param int startX The horizontal position of the starting point
 * @param int startY The vertical position of the starting point
 * @param int endX The horizontal position of the ending point
 * @param int endY The vertical position of the ending point
 * @param String name The name of the line (extends or include)
 */
lineToDraw.prototype.drawExtIncl = function(ctx,startX,startY,endX,endY,name){
  endX = parseInt(endX); // if we are not doing that js understand position.endX as a String
  endY = parseInt(endY);
  ctx.mozDash = [5,10]; // firefox
  //ctx.setLineDash([5,10]); // chrome -> gives an error with firefox
  ctx.beginPath();
  ctx.moveTo(startX, startY);
  ctx.lineTo(endX, endY);
  ctx.stroke();
  ctx.closePath();

  ctx.mozDash = [1,0]; // firefox
  //ctx.setLineDash([1,0]); // chrome
  ctx.beginPath();
  ctx.moveTo(endX, endY);
  ctx.lineTo(endX+10, endY+10);
  ctx.lineTo(endX+10+10, endY+10-20);
  ctx.lineTo(endX+10+10-30, endY+10-20);
  ctx.lineTo(endX, endY);
  ctx.stroke();
  ctx.closePath();

  ctx.fillText(name, (startX+endX)/2, (startY+endY)/2);
}

/**
 * @brief Calculate from where (on the shapes) the line must start and finish
 * @param Array form1 All the informations about the first shape to connect in an Array
 * @param Array form2 All the informations about the first shape to connect in an Array
 * @return int The 2 coordinates of the starting point and of the finish point
 */
lineToDraw.prototype.calculate = function(form1,form2){
  var sX;
  var sY;
  var eX;
  var eY;
  if(form1.leftX < form2.rightX){
    sX = form1.rightX;
    sY = form1.middleY;
    eX = form2.leftX;
    eY = form2.middleY;
  }else if(form1.rightX > form2.leftX){
    sX = form1.leftX;
    sY = form1.middleY;
    eX = form2.rightX;
    eY = form2.middleY;
  }else if(form1.rightX <= form2.leftX && form1.leftX >= form2.leftX && form1.topY < form2.topY){
    sY = form1.bottomY;
    sX = form1.middleX;
    eY = form2.topY;
    eX = form2.middleX;
  }else if(form1.rightX <= form2.leftX && form1.leftX >= form2.leftX && form1.bottomY > form2.bottomY){
    sY = form1.topY;
    sX = form1.middleX;
    eY = form2.bottomY;
    eX = form2.middleX;
  }
  //alert(sx+' '+sY+' '+eX+' '+ey);
  return {startX:sX, startY:sY, endX:eX, endY:eY};
}