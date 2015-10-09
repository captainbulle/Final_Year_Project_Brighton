function getCoords(el,event){
  var ox = el.scrollLeft - el.offsetLeft,
  oy = el.scrollTop - el.offsetTop;
  while(el=el.offsetParent){
    ox += el.scrollLeft - el.offsetLeft;
    oy += el.scrollTop - el.offsetTop;
  }
  return {x:event.clientX + ox, y:event.clientY + oy};
}

$(function(){
  //var name = $("#name");
  //var allFields = $([]).add(name);
  var tips = $(".validateTips");
  var nb = 1; // number of case that you add in the pkg dialog

  function updateTips(t){
    tips
      .text(t)
      .addClass("ui-state-highlight");
    setTimeout(function(){
      tips.removeClass( "ui-state-highlight", 1500);
    }, 700);
  }

  function hideCases(nb){
    for(nb; nb > 1; --nb){
      $('#more_case'+ nb).hide();
      $('#use'+ nb).val("none");
    }
    nb = 1;
    $('#use'+ nb).val("none");
  }

// dialog for draw the package around the use cases select in the dialog
  $("#dialog-pkg").dialog({
    autoOpen: false,
    height: 580,
    width: 300,
    modal: true,
    title: "Which use cases will be in the package ?",
    buttons: {
      "Ok": function(){
        hideCases(nb);
        nb = 1;
        tips.text("");
        $(this).dialog("close");
      },
      "Add case": function(){
        var nbUse = $('#nbUse').val();
        if(nb < nbUse){
          nb++;
          var list = '<label for="use'+ nb +'">Use case '+ nb + '</label><select name="use'+ nb +'" id="use'+ nb +'" class="text ui-widget-content ui-corner-all" onchange="var nbUse = $(\'#nbUse\').val(); for(var i = 1; i <= nbUse; ++i){ if(!$(\'#use\'+i)){break;} for(var j = 1; j <= nbUse; ++j){if($(\'#use\'+i+\'_\'+j).val() == $(this).val()){$(\'#use\'+i+\'_\'+j).hide();}else{for(var k = 1; k <= nbUse; ++k){if($(\'#use\'+ k).val() == $(\'#use\'+ i +\'_\'+ j).val()){$(\'#use\'+i+\'_\'+j).hide();}else{$(\'#use\'+i+\'_\'+j).show();}}}}}">';
          if(nbUse > 0){
            list += '<option value="none">Select the use case</option>';
            for(var i = 1; i <= nbUse; ++i){
              list += '<option value="'+ i +'" id="use'+ nb +'_'+ i +'">'+ $('#name_use'+ i).val() +'</option>';
            }
          }
          list += '</select><div id="more_case'+ (nb+1) +'"></div>';
          document.getElementById('more_case'+ nb).innerHTML = list;
          $('#more_case'+ nb).show();
        }else
           updateTips('There is no more use case in the canvas');
      },
      Cancel: function(){
        hideCases(nb);
        nb = 1;
        tips.text("");
        $(this).dialog("close");
      }
    },
    close: function(){
      hideCases(nb);
      nb = 1;
      tips.text("");
      $(this).dialog("close");
    }
  });

// dialog for making the line between an actor and a use case
  $("#dialog-line").dialog({
    autoOpen: false,
    height: 380,
    width: 300,
    modal: true,
    title: "Which forms the line will connect ?",
    buttons: {
      "Ok": function(){
        var numA = $('#startform').val();
        var numU = $('#endform').val();
        if(numA == 'none' || numU == 'none'){
          alert('You have forget to select the start or the ending form');
        }else{
          var nbLine = $("#nbLines").val();
          var actorL = new stickman();
          var useL = new ellipse();
          var simpleLine = new lineToDraw();
          actorL.enlarge();
          useL.enlarge();
          var extremA = actorL.getExtrems($('#coordX_actor'+ numA).val(),$('#coordY_actor'+ numA).val(),$('#name_actor'+ numA).val());
          var extremU = useL.getExtrems($('#coordX_use'+ numU).val(),$('#coordY_use'+ numU).val(),$('#name_use'+ numU).val());
          var result = simpleLine.draw(document.getElementById('canvas').getContext('2d'),extremA,extremU,1);
          document.getElementById('lines_'+ nbLine).innerHTML = '<input type="text" id="startX_line'+ nbLine +'" value="'+ result.startX +'"/><input type="text" id="startY_line'+ nbLine +'" value="'+ result.startY +'"/><input type="text" id="startform_line'+ nbLine +'" value="actors_'+ numA +'"/><input type="text" id="endX_line'+ nbLine +'" value="'+ result.endX +'"/><input type="text" id="endY_line'+ nbLine +'" value="'+ result.endY +'"/><input type="text" id="endform_line'+ nbLine +'" value="uses_'+ numU +'"/><div id="lines_'+ (parseInt(nbLine)+1) +'"></div>';
          $('#lines_'+ nbLine).addClass('visible');
          $('#startform').val('none');
          $('#endform').val('none');
          nbLine++;
          $("#nbLines").val(nbLine); // update of the number of lines
          $(this).dialog("close");
        }
      },
      Cancel: function(){
        $('#startform').val('none');
        $('#endform').val('none');
        $(this).dialog("close");
      }
    },
    close: function(){
      $('#startform').val('none');
      $('#endform').val('none');
      $(this).dialog("close");
    }
  });

// dialog for making an extends between two case
  $("#dialog-extends").dialog({
    autoOpen: false,
    height: 380,
    width: 300,
    modal: true,
    title: "Which use cases the extends line will connect ?",
    buttons: {
      "Ok": function(){
        var numStart = $('#startformExtends').val();
        var numEnd = $('#endformExtends').val();
        if(numStart == 'none' || numEnd == 'none'){
          alert('You must select the starting and ending form');
        }else{
          var nbExtends = $("#nbExtends").val();
          var useCase = new ellipse();
          var lineExtends = new lineToDraw();
          useCase.enlarge();
          var extremStart = useCase.getExtrems($('#coordX_use'+ numStart).val(),$('#coordY_use'+ numStart).val(),$('#name_use'+ numStart).val());
          var extremEnd = useCase.getExtrems($('#coordX_use'+ numEnd).val(),$('#coordY_use'+ numEnd).val(),$('#name_use'+ numEnd).val());
          var result = lineExtends.draw(document.getElementById('canvas').getContext('2d'),extremStart,extremEnd,2);
          document.getElementById('extends_'+ nbExtends).innerHTML = '<input type="text" id="startX_extends'+ nbExtends +'" value="'+ result.startX +'"/><input type="text" id="startY_extends'+ nbExtends +'" value="'+ result.startY +'"/><input type="text" id="startform_extends'+ nbExtends +'" value="uses_'+ numStart +'"/><input type="text" id="endX_extends'+ nbExtends +'" value="'+ result.endX +'"/><input type="text" id="endY_extends'+ nbExtends +'" value="'+ result.endY +'"/><input type="text" id="endform_extends'+ nbExtends +'" value="uses_'+ numEnd +'"/><div id="extends_'+ (parseInt(nbExtends)+1) +'"></div>';
          $('#extends_'+ nbExtends).addClass('visible');
          $('#startformExtends').val('none');
          $('#endformExtends').val('none');
          nbExtends++;
          $("#nbExtends").val(nbExtends);
          $(this).dialog("close");
        }
      },
      Cancel: function(){
        $('#startformExtends').val('none');
        $('#endformExtends').val('none');
        $(this).dialog("close");
      }
    },
    close: function(){
      $('#startformExtends').val('none');
      $('#endformExtends').val('none');
      $(this).dialog("close");
    }
  });

// dialog for making an include between two case
  $("#dialog-include").dialog({
    autoOpen: false,
    height: 380,
    width: 300,
    modal: true,
    title: "Which use cases the include line will connect ?",
    buttons: {
      "Ok": function(){
        var numStart = $('#startformInclude').val();
        var numEnd = $('#endformInclude').val();
        if(numStart == 'none' || numEnd == 'none'){
          alert('You must select the starting and ending form');
        }else{
          var nbInclude = $("#nbInclude").val();
          var useCase = new ellipse();
          var lineInclude = new lineToDraw();
          useCase.enlarge();
          var extremStart = useCase.getExtrems($('#coordX_use'+ numStart).val(),$('#coordY_use'+ numStart).val(),$('#name_use'+ numStart).val());
          var extremEnd = useCase.getExtrems($('#coordX_use'+ numEnd).val(),$('#coordY_use'+ numEnd).val(),$('#name_use'+ numEnd).val());
          var result = lineInclude.draw(document.getElementById('canvas').getContext('2d'),extremStart,extremEnd,3);
          document.getElementById('include_'+ nbInclude).innerHTML = '<input type="text" id="startX_include'+ nbInclude +'" value="'+ result.startX +'"/><input type="text" id="startY_include'+ nbInclude +'" value="'+ result.startY +'"/><input type="text" id="startform_include'+ nbInclude +'" value="uses_'+ numStart +'"/><input type="text" id="endX_include'+ nbInclude +'" value="'+ result.endX +'"/><input type="text" id="endY_include'+ nbInclude +'" value="'+ result.endY +'"/><input type="text" id="endform_include'+ nbInclude +'" value="uses_'+ numEnd +'"/><div id="include_'+ (parseInt(nbInclude)+1) +'"></div>';
          $('#include_'+ nbInclude).addClass('visible');
          $('#startformInclude').val('none');
          $('#endformInclude').val('none');
          nbInclude++;
          $("#nbInclude").val(nbInclude);
          $(this).dialog("close");
        }
      },
      Cancel: function(){
        $('#startformInclude').val('none');
        $('#endformInclude').val('none');
        $(this).dialog("close");
      }
    },
    close: function(){
      $('#startformInclude').val('none');
      $('#endformInclude').val('none');
      $(this).dialog("close");
    }
  });
});

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

  var toolbox = document.getElementById('toolbox');
  if(!toolbox){
    alert("toolbox unknow");
    return;
  }

  var ctx2 = toolbox.getContext('2d');
  if(!ctx2){
    alert("Problem with the toolbox, impossible to get context");
    return;
  }

  //938*? 21*29,7 (format A4) -> 938*29,7/21 = 1326,6
  canvas.width = 938;
  canvas.height = 1327;
  toolbox.width = 100;
  toolbox.height = 330;
  ctx.font = "16px Helvetica"; // height max of the letters: 15
  ctx2.font = "11px Helvetica";

  var form = -1;
  var result = false;
  var passed = false;
  var nbActor = 0;
  var nbUse = 0;
  $("#nbLines").val(1);
  $("#nbExtends").val(1);
  $("#nbInclude").val(1);
  var actors = new Array();
  var uses = new Array();
  //var pkgs = new Array();
  var lines = new Array();

  var actor = new stickman(); // 1
  var use = new ellipse();    // 2
  var pkg = new package();    // 3
  var line = new lineToDraw();
  actor.draw(ctx2);
  use.draw(ctx2);
  pkg.draw(ctx2);
  form = pkg.getheight()+160;
  ctx2.fillText("Simple line", 10, form);
  form += 40;
  ctx2.fillText("<< extends >>", 10, form);
  form += 40;
  ctx2.fillText("<< include >>", 10, form);

  ctx2.beginPath();
  ctx2.moveTo(0, 70);
  ctx2.lineTo(toolbox.width, 70);
  ctx2.moveTo(0, 110);
  ctx2.lineTo(toolbox.width, 110);
  form = pkg.getheight()+130;
  ctx2.moveTo(0, form);
  ctx2.lineTo(toolbox.width, form);
  ctx2.stroke();
  ctx2.closePath();

  actor.enlarge();
  use.enlarge();
  //pkg.enlarge();
  //ctx.fillRect(0, 0, canvas.height, canvas.width);

  document.getElementById('clear').onclick = function(){
    if(form != -1){
      var lg = actors.length;
      for(var i = 3; i < lg; i += 4){
        if(actors[i]){
          actors[i] = false;
        }
      }
      lg = uses.length;
      for(var i = 3; i < lg; i += 4){
        if(uses[i]){
          uses[i] = false;
        }
      }
      form = -1;
    }else
      location.reload();
  }

  // To save the diagram as a picture
  document.getElementById('save').onclick = function(){
    window.open(document.getElementById('canvas').toDataURL(), 'My Use Case Diagram', 'scrollbars=yes, width=938, height=1327');
  }

  function clearCanvas(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    var i;
    ///*
    var lg = actors.length;
    var nb = 0;
    for(i = 0; i < lg; i += 4){
      if(i%4 == 0) nb++;
      if($('#actors_'+ nb).is('.visible')){
        actor.draw(ctx,actors[i],actors[i+1],actors[i+2]);
      }
    }
    lg = uses.length;
    nb = 0;
    for(i = 0; i < lg; i += 4){
      if(i%4 == 0) nb++;
      if($('#uses_'+ nb).is('.visible')){
        use.draw(ctx,uses[i],uses[i+1],uses[i+2]);
      }
    }//*/

    // try to get the coordonate by the values in HTML input but doesn't work, so I continue to use array
    /*
    for(i = $("#nbActor").val(); i > 0; --i){
      actor.draw(ctx,$('#coordX_actor'+ i).val(), $('#coordY_actor'+ i).val(), $('#name_actor'+ i).val());
    }
    for(i = $("#nbUse").val(); i > 0; --i){
      use.draw(ctx,$('#coordX_use'+ i).val(), $('#coordY_use'+ i).val(), $('#name_use'+ i).val());
    }//*/
    //lg = pkgs.length;
    //for(i = 0; i < lg; i += 5) pkg.draw(ctx,pkgs[i],pkgs[i+1],pkgs[i+2]);
    for(i = $("#nbLines").val(); i > 0; --i){
      if($('#lines_'+ i).is('.visible')){
        line.drawSimpleLine(ctx,$('#startX_line'+ i).val(),$('#startY_line'+ i).val(),$('#endX_line'+ i).val(),$('#endY_line'+ i).val());
      }
    }
    for(i = $("#nbExtends").val(); i > 0; --i){
      if($('#extends_'+ i).is('.visible')){
        // in this function we write '<< extends >>' but not appear on the canvas, I don't know why
        line.drawExtIncl(ctx,$('#startX_extends'+ i).val(),$('#startY_extends'+ i).val(),$('#endX_extends'+ i).val(),$('#endY_extends'+ i).val(),"<< extends >>");
      }
    }
    for(i = $("#nbInclude").val(); i > 0; --i){
      if($('#include_'+ i).is('.visible')){
        // in this function we write '<< include >>' but not appear on the canvas, I don't know why
        line.drawExtIncl(ctx,$('#startX_include'+ i).val(),$('#startY_include'+ i).val(),$('#endX_include'+ i).val(),$('#endY_include'+ i).val(),"<< include >>");
      }
    }
  }

  // we call the animate function every 25 milliseconds
  var interval = setInterval(animate, 25);

  function animate(){
    // To avoid problem of erasure or moving
    clearCanvas();
    // Getting position of the scrollbar (the get function depend of the browser you use)
    scrollTop = document.body.scrollTop;
    if(scrollTop == 0){
      if(window.pageYOffset) // firefox
        scrollTop = window.pageYOffset;
      else // IE
        scrollTop = (document.body.parentElement) ? document.body.parentElement.scrollTop : 0;
    }

    toolbox.onclick = function(e){
      var coord = getCoords(this,e);
      if(coord.y >= 0 && coord.y <= 70){
        passed = false;
        form = 1;
      }else if(coord.y >= 70 && coord.y <= 110){
        passed = false;
        form = 2;
      }else if(coord.y >= 110 && coord.y <= (pkg.getheight()+130)){
        if(nbUse > 0){
          var list = '<option value="none">Select the use case</option>';
          for(var i = 1; i <= nbUse; ++i){
            if($('#uses_'+ i).is('.visible')){
              list += '<option value="'+ i +'" id="use1_'+ i +'">'+ $('#name_use'+ i).val() +'</option>';
            }
          }
          document.getElementById('use1').innerHTML = list;
          $("#dialog-pkg").dialog("open");
          //passed = false;
          //form = 3;
        }else
          alert('You must have, at least, one use case to create a package');

      // creation of the simple line
      }else if(coord.y >= (pkg.getheight()+130) && coord.y <= (pkg.getheight()+180)){
        if(nbUse >= 1 && nbActor >= 1){
          var list = '<option value="none">Select the actor</option>';
          for(var i = 1; i <= nbActor; ++i){
            if($('#actors_'+ i).is('.visible')){
              list += '<option value="'+ i +'" id="startform_'+ i +'">'+ $('#name_actor'+ i).val() +'</option>';
            }
          }
          document.getElementById('startform').innerHTML = list;
          list = '<option value="none">Select the use case</option>';
          for(var i = 1; i <= nbUse; ++i){
            if($('#uses_'+ i).is('.visible')){
              list += '<option value="'+ i +'" id="endform_'+ i +'">'+ $('#name_use'+ i).val() +'</option>';
            }
          }
          document.getElementById('endform').innerHTML = list;
          $("#dialog-line").dialog("open");
          //lines.push(result.startX,result.startY,result.endX,result.endY);
        }else
          alert('To create a simple line, you must have at least one actor and one use cases');

      // creation of the extends line
      }else if(coord.y >= (pkg.getheight()+180) && coord.y <= (pkg.getheight()+220)){
        if(nbUse > 1){
          var list = '<option value="none">Select the use case</option>';
          for(var i = 1; i <= nbUse; ++i){
            if($('#uses_'+ i).is('.visible')){
              list += '<option value="'+ i +'" id="startformExtends_'+ i +'">'+ $('#name_use'+ i).val() +'</option>';
            }
          }
          document.getElementById('startformExtends').innerHTML = list;
          list = '<option value="none">Select the use case</option>';
          for(var i = 1; i <= nbUse; ++i){
            if($('#uses_'+ i).is('.visible')){
              list += '<option value="'+ i +'" id="endformExtends_'+ i +'">'+ $('#name_use'+ i).val() +'</option>';
            }
          }
          document.getElementById('endformExtends').innerHTML = list;
          $("#dialog-extends").dialog("open");
        }else
          alert('To create an extends line, you must have at least two use case');

      // creation of the include line
      }else if(coord.y >= (pkg.getheight()+220) && coord.y <= (pkg.getheight()+260)){
        if(nbUse > 1){
          var list = '<option value="none">Select the use case</option>';
          for(var i = 1; i <= nbUse; ++i){
            if($('#uses_'+ i).is('.visible')){
              list += '<option value="'+ i +'" id="startformInclude_'+ i +'">'+ $('#name_use'+ i).val() +'</option>';
            }
          }
          document.getElementById('startformInclude').innerHTML = list;
          list = '<option value="none">Select the use case</option>';
          for(var i = 1; i <= nbUse; ++i){
            if($('#uses_'+ i).is('.visible')){
              list += '<option value="'+ i +'" id="endformInclude_'+ i +'">'+ $('#name_use'+ i).val() +'</option>';
            }
          }
          document.getElementById('endformInclude').innerHTML = list;
          $("#dialog-include").dialog("open");
        }else
          alert('To create an include line, you must have at least two use cases');
      }else
        form = -1;
    };

    // We place the form where the user click
    if(form == 1){
      canvas.onclick = function(e){
        var coord = getCoords(this,e);
        //alert("Clic -> X: "+coord.x+" - Y: "+y);
        if(passed){
          var lg = actors.length;
          for(var i = 3, j = 1; i < lg; i += 4, ++j){
            if(actors[i]){
              var newX = actor.movingX(coord.x,canvas.width,actors[i-1]);
              var newY = actor.movingY(coord.y,canvas.height,scrollTop);
              $('#coordX_actor'+ j).val(newX);
              $('#coordY_actor'+ j).val(newY);

              // modify the lines link to the moved actor
              var nbLine = $("#nbLines").val();
              for(var k = 1; k <= nbLine; ++k){
                if($('#startform_line'+ k).val() == ('actors_'+ j) && $('#'+ $('#endform_line'+ k).val()).is('.visible')){
                  var numA = j;
                  var extremA = actor.getExtrems($('#coordX_actor'+ numA).val(),$('#coordY_actor'+ numA).val(),$('#name_actor'+ numA).val());
                  var numU = $('#endform_line'+ k).val();
                  numU = numU.split('_'); // numU[0] => uses, numU[1] => num
                  numU = numU[1];
                  var extremU = use.getExtrems($('#coordX_use'+ numU).val(),$('#coordY_use'+ numU).val(),$('#name_use'+ numU).val());
                  var result = line.draw(ctx,extremA,extremU,1);
                  $('#startX_line'+ k).val(result.startX);
                  $('#startY_line'+ k).val(result.startY);
                  $('#endX_line'+ k).val(result.endX);
                  $('#endY_line'+ k).val(result.endY);
                  $('#lines_'+ k).removeClass('hidden').addClass('visible');
                }
              }
              actors[i-3] = newX;
              actors[i-2] = newY;
              actor.draw(ctx,actors[i-3],actors[i-2],actors[i-1]);
              actors[i] = false;
              $('#actors_'+ j).removeClass('hidden').addClass('visible');
              $('#clear').popover('hide');
              break;
            }
          }
        }else{
          var coordX = actor.movingX(coord.x,canvas.width);
          var coordY = actor.movingY(coord.y,canvas.height,scrollTop);
          actor.draw(ctx);
          passed = true;
          actors.push(coordX, coordY, "Actor Name", false);
          nbActor++;
          $('#nbActor').val(nbActor);
          $('#actors_'+ nbActor).addClass('visible');
          document.getElementById('actors_'+ nbActor).innerHTML = '<input type="text" id="coordX_actor'+ nbActor +'" value="'+ coordX +'"/><input type="text" id="coordY_actor'+ nbActor +'" value="'+ coordY +'"/><input type="text" id="name_actor'+ nbActor +'" value="Actor Name"/><input type="text" id="actif_actor'+ nbActor +'" value="0"/><div id="actors_'+ (nbActor+1) +'"></div>';
        }
        form = -1;
      };
    }else if(form == 2){
      canvas.onclick = function(e){
        var coord = getCoords(this,e);
        if(passed){
          var lg = uses.length;
          for(var i = 3; i < lg; i += 4){
            if(uses[i]){
              var newX = use.movingX(coord.x,canvas.width,uses[i-1]);
              var newY = use.movingY(coord.y,canvas.height,scrollTop);
              var j;
              for(j = 1; j <= nbUse; ++j){
                if($('#coordX_use'+ j).val() == uses[i-3] && $('#coordY_use'+ j).val() == uses[i-2]){
                  // filling the HTML inputs
                  $('#coordX_use'+ j).val(newX);
                  $('#coordY_use'+ j).val(newY);
                  $('#uses_'+ j).removeClass('hidden').addClass('visible');

                  // modify the lines link to the moved use case
                  var nbLine = $("#nbLines").val();
                  for(var k = 1; k <= nbLine; ++k){
                    if($('#endform_line'+ k).val() == ('uses_'+ j) && $('#'+ $('#startform_line'+ k).val()).is('.visible')){
                      var numA = $('#startform_line'+ k).val();
                      numA = numA.split('_'); // numA[0] => actors, numA[1] => num
                      numA = numA[1];
                      var extremA = actor.getExtrems($('#coordX_actor'+ numA).val(),$('#coordY_actor'+ numA).val(),$('#name_actor'+ numA).val());
                      var numU = j;
                      var extremU = use.getExtrems($('#coordX_use'+ numU).val(),$('#coordY_use'+ numU).val(),$('#name_use'+ numU).val());
                      var result = line.draw(ctx,extremA,extremU,1);
                      $('#startX_line'+ k).val(result.startX);
                      $('#startY_line'+ k).val(result.startY);
                      $('#endX_line'+ k).val(result.endX);
                      $('#endY_line'+ k).val(result.endY);
                      $('#lines_'+ k).removeClass('hidden').addClass('visible');
                    }
                  }
                  nbLine = $("#nbExtends").val();
                  for(var k = 1; k <= nbLine; ++k){
                    if(($('#startform_extends'+ k).val() == ('uses_'+ j) && $('#'+ $('#endform_extends'+ k).val()).is('.visible')) || ($('#endform_extends'+ k).val() == ('uses_'+ j) && $('#'+ $('#startform_extends'+ k).val()).is('.visible'))){
                      var num1;
                      var num2;
                      if($('#endform_extends'+ k).val() == ('uses_'+ j)){
                        num1 = $('#startform_extends'+ k).val();
                        num1 = num1.split('_');
                        num1 = num1[1];
                        num2 = j;
                      }else if($('#startform_extends'+ k).val() == ('uses_'+ j)){
                        num1 = j;
                        num2 = $('#endform_extends'+ k).val();
                        num2 = num2.split('_');
                        num2 = num2[1];
                      }
                      var extrem1 = use.getExtrems($('#coordX_use'+ num1).val(),$('#coordY_use'+ num1).val(),$('#name_use'+ num1).val());
                      var extrem2 = use.getExtrems($('#coordX_use'+ num2).val(),$('#coordY_use'+ num2).val(),$('#name_use'+ num2).val());
                      var result = line.draw(ctx,extrem1,extrem2,2);
                      $('#startX_extends'+ k).val(result.startX);
                      $('#startY_extends'+ k).val(result.startY);
                      $('#endX_extends'+ k).val(result.endX);
                      $('#endY_extends'+ k).val(result.endY);
                      $('#extends_'+ k).removeClass('hidden').addClass('visible');
                    }
                  }
                  nbLine = $("#nbInclude").val();
                  for(var k = 1; k <= nbLine; ++k){
                    if(($('#startform_include'+ k).val() == ('uses_'+ j) && $('#'+ $('#endform_include'+ k).val()).is('.visible')) || ($('#endform_include'+ k).val() == ('uses_'+ j) && $('#'+ $('#startform_include'+ k).val()).is('.visible'))){
                      var num1;
                      var num2;
                      if($('#endform_include'+ k).val() == ('uses_'+ j)){
                        num1 = $('#startform_include'+ k).val();
                        num1 = num1.split('_');
                        num1 = num1[1];
                        num2 = j;
                      }else if($('#startform_include'+ k).val() == ('uses_'+ j)){
                        num1 = j;
                        num2 = $('#endform_include'+ k).val();
                        num2 = num2.split('_');
                        num2 = num2[1];
                      }
                      var extrem1 = use.getExtrems($('#coordX_use'+ num1).val(),$('#coordY_use'+ num1).val(),$('#name_use'+ num1).val());
                      var extrem2 = use.getExtrems($('#coordX_use'+ num2).val(),$('#coordY_use'+ num2).val(),$('#name_use'+ num2).val());
                      var result = line.draw(ctx,extrem1,extrem2,3);
                      $('#startX_include'+ k).val(result.startX);
                      $('#startY_include'+ k).val(result.startY);
                      $('#endX_include'+ k).val(result.endX);
                      $('#endY_include'+ k).val(result.endY);
                      $('#include_'+ k).removeClass('hidden').addClass('visible');
                    }
                  }
                  break;
                }
              }
              // filling the use case Array
              uses[i-3] = newX;
              uses[i-2] = newY;
              use.draw(ctx,uses[i-3],uses[i-2],uses[i-1]);
              uses[i] = false;
              $('#clear').popover('hide');
              break;
            }
          }
        }else{
          var coordX = use.movingX(coord.x,canvas.width);
          var coordY = use.movingY(coord.y,canvas.height,scrollTop);
          use.draw(ctx);
          passed = true;
          uses.push(coordX, coordY, "Use Case", false);
          nbUse++;
          $('#nbUse').val(nbUse);
          $('#uses_'+ nbUse).addClass('visible');
          document.getElementById('uses_'+ nbUse).innerHTML = '<input type="text" id="coordX_use'+ nbUse +'" value="'+ coordX +'"/><input type="text" id="coordY_use'+ nbUse +'" value="'+ coordY +'"/><input type="text" id="name_use'+ nbUse +'" value="Use Case"/><input type="text" id="actif_use'+ nbUse +'" value="0"/><input type="text" id="num_use'+ nbUse +'" value="'+ nbUse +'"/><div id="uses_'+ (nbUse+1) +'"></div>';
        }
        form = -1;
      };
    }else{
      canvas.ondblclick = function(e){
        var coord = getCoords(this,e);
        var i = actor.isinside(coord.x, (coord.y+scrollTop), actors);
        if(i.indice >= 0){
          result = prompt("New Name",actors[i.indice+2]);
          if(result){
            actors[i.indice+2] = result;
            actor.draw(ctx,actors[i.indice],actors[i.indice+1],actors[i.indice+2]);
            $('#name_actor'+ i.num).val(result);
          }
        }else{
          i = use.isinside(coord.x, (coord.y+scrollTop), uses);
          if(i.indice >= 0){
            result = prompt("New description of the use case",uses[i.indice+2]);
            if(result){
              uses[i.indice+2] = result;
              use.draw(ctx,uses[i.indice],uses[i.indice+1],uses[i.indice+2]);
              $('#name_use'+ i.num).val(result);
            }
          }
        }
      };
      canvas.onclick = function(e){
        var coord = getCoords(this,e);
        var i = actor.isinside(coord.x, (coord.y+scrollTop), actors);
        if(i.indice >= 0){
          actors[i.indice+3] = true;
          $('#actors_'+ i.num).removeClass('visible').addClass('hidden');
          // we hide line(s) connect to the actor
          for(i = $("#nbLines").val(); i > 0; --i){
            if($('#'+ $('#startform_line'+ i).val()).is('.hidden')){
              $('#lines_'+ i).removeClass('visible').addClass('hidden');
            }
          }
          $('#clear').popover('show');
          form = 1;
        }else{
          i = use.isinside(coord.x, (coord.y+scrollTop), uses);
          if(i.indice >= 0){
            uses[i.indice+3] = true;
            $('#uses_'+ i.num).removeClass('visible').addClass('hidden');
            // we hide line(s) connect to the use case
            for(i = $("#nbLines").val(); i > 0; --i){
              if($('#'+ $('#endform_line'+ i).val()).is('.hidden')){
                $('#lines_'+ i).removeClass('visible').addClass('hidden');
              }
            }
            // we hide extends line(s) connect to the use case
            for(i = $("#nbExtends").val(); i > 0; --i){
              if($('#'+ $('#startform_extends'+ i).val()).is('.hidden') || $('#'+ $('#endform_extends'+ i).val()).is('.hidden')){
                $('#extends_'+ i).removeClass('visible').addClass('hidden');
              }
            }
            // we hide include line(s) connect to the use case
            for(i = $("#nbInclude").val(); i > 0; --i){
              if($('#'+ $('#startform_include'+ i).val()).is('.hidden') || $('#'+ $('#endform_include'+ i).val()).is('.hidden')){
                $('#include_'+ i).removeClass('visible').addClass('hidden');
              }
            }
            $('#clear').popover('show');
            form = 2;
          }
        }
      };
    }
  }
}