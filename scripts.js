

var tablero = [[0,0,0],[0,0,0],[0,0,0]];

var turno = 1;
var mode = "last";

var p1_checks = [];
var p2_checks = [];

var n = 0;

$(document).ready(function(){

  if (localStorage.getItem("mode") != null) {
    mode = localStorage.getItem("mode");
    $("#menu_mode").val(mode);
  }

  $("#clean").click(function(e) {
    e.preventDefault();
    start();
  });

  $("#menu_mode").change(function(e) {
    e.preventDefault();
    mode = $(this).val();

    localStorage.setItem("mode", mode);

    start();
  });
  
  start();

});

function start() {
  $("#container").removeClass("finalizado turno2 t1wins t2wins row0 row1 row2  col0 col1 col2 diag1 diag2");
  tablero = [[0,0,0],[0,0,0],[0,0,0]];
  turno = 1;
  p1_checks = [];
  p2_checks = [];

  $("#tablero")
    .addClass("turno1");
  $("#container")
    .addClass("turno1");

  $("#tablero table tr td a").remove();

  $("#tablero table tr").each(function(i) {
    
    $(this).find("td").each(function(j) {
      
      $(this).data("cell", {r: i, c: j});
      $(this)
        .data("value", "empty")
        .addClass("empty")
        .removeClass("sel1 sel2 remove").
        append(`<a href="#"></a>`);

    });
  });
  
  $("#tablero table tr td a").click(function(e) {
    e.preventDefault();

    if ($("#container").hasClass("finalizado"))
      return false;

    var td = $(this).parent();

    if (!td.hasClass("empty"))
      return false;

    let remove = $("#tablero table td.remove");
    if (remove.length>0) {
      //clean
      remove.removeClass("remove sel1 sel2")
        .addClass("empty");
      
      if (mode=='last' || mode=='rndm') {
        if (turno==1) {
          p1_checks.splice(n, 1);
        } else {
          p2_checks.splice(n, 1);
        }
      } 
    }  


    td.removeClass("empty sel1 sel2")
      .data("value", "sel"+turno)
      .addClass("sel" + turno);

    const selected = td.data("cell");
    tablero[selected.r][selected.c] = turno;
    
    if (!checkLine()) {
    
      let cell = td.data("cell");

      if (mode=='last' || mode=='rndm') {
        
        n = mode =='rndm'? getRandomInt(3) : 0;

        if (turno==1) {
          p1_checks.push(cell);
          
          if (p2_checks.length==3) {
            marcaBorrar(p2_checks[n]);
          } 
        } else {
          p2_checks.push(cell);
          
          if (p1_checks.length==3) {
            marcaBorrar(p1_checks[n]);
          }
        }

      } 

      if (turno==1) {
        turno=2;
      } else {
        turno=1;
      }
      
      $("#container")
        .removeClass("turno1 turno2")
        .addClass("turno" + turno);
    }

  });
}


function checkLine() {
  let result = checkRows();
  if (result.isLine) {
    end(result);
    return true;
  } 

  result = checkCols();
  if (result.isLine) {
    end(result);
    return true;
  }

  result = checkDiagonals();
  if (result.isLine) {
    end(result);
    return true;
  }
  
  return false;
}

function checkRows() {
  for (r=0;r<3;r++) {
    let result = checkRow(r);

    if (result.isLine) {
      return result;
    }
  }
  return {isLine: false};
}

function checkCols() {
  for (c=0;c<3;c++) {
    let result = checkCol(c);

    if (result.isLine) {
      return result;
    }
  }
  return {isLine: false};
}

function checkDiagonals() {
  
  let diag_TL_BR = [tablero[0][0], tablero[1][1], tablero[2][2]];
  let allEqual = diag_TL_BR.every( (v) => v>0 && v === diag_TL_BR[0]);
  if (allEqual) {
    return  {isLine: true, type: 'diag1', line: {from : {r: 0, c: 0}, to: {r: 2, c: 2}}, winner: diag_TL_BR[0]};
  } 

  let diag_TR_BL = [tablero[0][2], tablero[1][1], tablero[2][0]];
  allEqual = diag_TR_BL.every( (v) => v>0 && v === diag_TR_BL[0]);
  if (allEqual) {
    return  {isLine: true, type: 'diag2', line: {from : {r: 0, c: 2}, to: {r: 2, c: 0}}, winner: diag_TR_BL[0]};
  } 

  return {isLine: false};

}

function checkRow(r) {

  let row = tablero[r];
  const allEqual = row.every( (v) => v>0 && v === row[0]);
  if (allEqual) {
    return  {isLine: true, type: 'row' + r, line: {from : {r: r, c: 0}, to: {r: r, c: 2}}, winner: row[0]};
  } 

  return {isLine: false};
}

function checkCol(c) {
  let col = [tablero[0][c], tablero[1][c], tablero[2][c]];
  const allEqual = col.every( (v) => v>0 && v === col[0]);
  if (allEqual) {
    return  {isLine: true, type: 'col' + c, line: {from : {r: 0, c: c}, to: {r: 2, c: c}}, winner: col[0]};
  } 

  return {isLine: false};
}



function end(result) {
  
  $("#container").addClass("finalizado")
    .addClass(result.type)
    .addClass("t" + result.winner+"wins");

  if (result.type=="col") {
    $("#tablero").addClass(result.type);
  }
  console.log("winner!", result);
}


function marcaBorrar(cell) {
  console.log('cell', cell);
  tablero[cell.r][cell.c] = 0;
  
  $("#row"+ (cell.r +1) + "col" + (cell.c + 1)).addClass("remove");
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}
