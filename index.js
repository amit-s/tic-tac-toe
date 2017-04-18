$(document).ready(function(){
var playerOne = "X",
    playerTwo = "O",
    board = {
      "0" : 0,
      "1" : 0,
      "2" : 0,
      "3" : 0,
      "4" : 0,
      "5" : 0,
      "6" : 0,
      "7" : 0,
      "8" : 0
    },
    corner = [0,2,6,8],
    center = 4,
    edge = [1,3,5,7],
    opposingEdge = [7, 5, 3, 1],
    winCombos = ["012", "048", "036", "147", "258", "246", "345", "678"],
    boardElement = document.getElementById("board"),
    isPlayerOneTurn = true,
    playerOneMoves = [],
    playerTwoMoves = [],
    playerOneScore = 0,
    playerTwoScore = 0,
    drawScore = 0,
    gameOver = false,
    movesCount = 0,
    numberOfPlayers,
    aiDifficulty,
    aiDifficultyFunct,
    mark,
    winner,
    winnerCombo;
  
  $("#modalSettings").modal({
    backdrop: "static"
  });
  
  $("#settingsIcon").on('click', function(){
    $("#modalSettings").modal();
  });

  $("#playerSettings").on('click', function(){  
    if($("input[name=players]:checked").val() === "1"){
      document.getElementById("difficultySettingsButtons").disabled = true;
      document.getElementById("difficultySettingsButtons").style.visibility = "hidden";
    }else{
      document.getElementById("difficultySettingsButtons").disabled = false;
      document.getElementById("difficultySettingsButtons").style.visibility = "visible";
    }  
  });// /$("#playerSettings").on('click')

  $("#play").on('click', updateSettings);
  document.getElementById("reset").addEventListener('click', reset, false);

function twoPlayers(e){
  if(!board[e.target.id]){
    if(isPlayerOneTurn){
      e.target.innerHTML = playerOne;
      playerOneMoves.push(e.target.id);
      movesCount++;
      checkWin(playerOneMoves);
    }else{
      e.target.innerHTML = playerTwo;
      playerTwoMoves.push(e.target.id);
      movesCount++;
      checkWin(playerTwoMoves);
    }
    board[e.target.id] = 1;
    isPlayerOneTurn = !isPlayerOneTurn;
  }
}// /twoPlayers()

function onePlayer(e){  
  if(!board[e.target.id]){
      updateClickEvent("remove");
      board[e.target.id] = 1;
      e.target.innerHTML = playerOne;
      playerOneMoves.push(e.target.id);
      movesCount++;
      checkWin(playerOneMoves);
      isPlayerOneTurn = false;
    if(!gameOver){
      setTimeout(compMove, 500);
    }
  }
}// /onePlayer()

function compMove(){
  var position;
  updateClickEvent("remove");
   if(aiDifficulty === "expert"){
         position = compMoveExpert();
         }else if(aiDifficulty === "intermediate"){
         position = compMoveIntermediate();
         }else{
           position = randomMove(board);
         }
  
  document.getElementById(position).innerHTML = playerTwo;
  board[position] = 1;
  playerTwoMoves.push(position.toString());
  movesCount++;
  checkWin(playerTwoMoves);
  isPlayerOneTurn = true;
  
  if(!gameOver){
    updateClickEvent("add");
  }
}// /compMove()

function compMoveIntermediate(){
  var position,
      potentialWin = 0;
  
  if(playerTwoMoves.length === 0){
    if(!board[center]){
      position = center;
    }else{
      position = randomMove(corner);
    }
  }else{  /* // /if(playerTwoMoves.length === 1) */
    position = nextMove(playerOneMoves);
  }// /if(playerTwoMoves.length === 0)
  
  if(!position){
    position = randomMove(board);
  }
  return position;  
} // /compMoveIntermediate()

function compMoveExpert(){
  var position,
      moveBlock,
      moveWin,
      potentialWin = 0;
  
  if(playerTwoMoves.length === 0){
    if(!board[center]){
      position = center;
    }else{
      position = randomMove(corner);
    }
  }else{  /*// /if(playerTwoMoves.length === 1) */
    moveBlock = nextMove(playerOneMoves);
    moveWin = nextMove(playerTwoMoves);
      
    if(moveWin){
      position = moveWin;
    }else{
      position = moveBlock;
    }
    
    if(!position && playerTwoMoves.length === 1){
      var winEdge = false;
      
      while(!winEdge){
      position = randomMove(edge);
      if(!board[opposingEdge[edge.indexOf(position)]]){
      winEdge = true
      }      
      }// /while(!winEdge)      
    }
   
    if(!position){
      position = randomMove(board);
    }
  }// /else after if(playerTwoMoves.length === 0)
  return position;  
} // /compMoveExpert()

function checkWin(moves){  
  var tileColor;

  if(moves.length<3){
    return;
  }else{
    for(var i=0; i<winCombos.length; i++){
      if(moves.indexOf(winCombos[i].charAt(0)) != -1 && moves.indexOf(winCombos[i].charAt(1)) != -1 && moves.indexOf(winCombos[i].charAt(2)) != -1){
        updateClickEvent("remove");
        gameOver = true;
        winnerCombo = winCombos[i];
        isPlayerOneTurn ? winner = playerOne  : winner = playerTwo;
        
        if(winner === playerOne){
          tileColor = "winTile";
          playerOneScore++;
        }else{
          tileColor = "loseTile";
          playerTwoScore++;
        }
        
        setTimeout(function(){
          $("#" + winnerCombo.charAt(0)).addClass(tileColor);
        }, 200);
        
        setTimeout(function(){
          $("#" + winnerCombo.charAt(1)).addClass(tileColor);
        }, 400);
        
        setTimeout(function(){
          $("#" + winnerCombo.charAt(2)).addClass(tileColor);
        }, 600);
        
        document.getElementById("restartIcon").className = "fa fa-refresh fa-2x fa-spin";
      }
    }    
  }// /else
  if((movesCount === 9) && !winner ){
    gameOver = true;
    drawnimation();
    drawScore++;
    document.getElementById("restartIcon").className = "fa fa-refresh fa-2x fa-spin";
  //  winner = "DRAW!!";
  }
  updateScore();
} // /checkWin()

function reset(){
  document.getElementById("restartIcon").className = "fa fa-refresh fa-2x";
  for (var i=0; i<9; i++){
    document.getElementById(i).innerHTML = "";
    board[i] = 0;    
  }
  playerOneMoves = [];
  playerTwoMoves = [];
  isPlayerOneTurn = true;
  gameOver = false;
  movesCount = 0;
  winner = "";
  winnerCombo = "";
 
  $("#board").children().each(function(index, item){
    $(item).removeClass("loseTile");    
    $(item).removeClass("winTile");
    $(item).removeClass("drawTile");
  });
  
  if(mark === "o" && numberOfPlayers === 1){
    setTimeout(compMove, 250);
    isPlayerOneTurn = true;
  }else{
    updateClickEvent("remove");
    updateClickEvent("add");
  }  
} // /reset()

function randomMove(compareBoard){
  var place,
      open,
      testTile,
      num;
  
  if(Array.isArray(compareBoard)){
    num = compareBoard.length;
  }else{
    num = Object.keys(compareBoard).length;
  }
   
  while(!open){
      place = Math.floor(Math.random()*num);
      if(num === 9){
        testTile = board[place];
      }else{
        testTile = board[compareBoard[place]];
      }
    
      if(!testTile){
        open = true;
      }// /if  
   }// /while   
   
   if(num === 9){
      return place;  
   }else{
      return compareBoard[place];
   }
}// /randomMove()

function nextMove(playerMoves){  
  var moves = [],
      movesFiltered = [];
  
  for(var i=0; i<winCombos.length; i++){
    if((playerMoves.indexOf(winCombos[i].charAt(0)) !== -1 && playerMoves.indexOf(winCombos[i].charAt(1)) !== -1) || (playerMoves.indexOf(winCombos[i].charAt(1)) !== -1 && playerMoves.indexOf(winCombos[i].charAt(2)) !== -1) || (playerMoves.indexOf(winCombos[i].charAt(0)) !== -1 && playerMoves.indexOf(winCombos[i].charAt(2)) !== -1)){
      var temp = winCombos[i];
      temp = temp.split("");
      for(var j=0; j<playerMoves.length; j++){
        if(temp.indexOf(playerMoves[j]) !== -1){
          temp.splice(temp.indexOf(playerMoves[j]),1);
        }
      } // /for(var j=0; j<playerMoves.length; j++)      
      moves.push(temp.join(""));
    }    
  }// /for(var i=0; i<winCombos.length; i++)
  
  movesFiltered = moves.filter(function(x){
    return board[x] !== 1;
  });
  
  return movesFiltered[0];  
}// nextMove()

function updateSettings(){  
  playerOneScore = 0;
  playerTwoScore = 0;
  drawScore = 0;

  numberOfPlayers = Number($("input[name=players]:checked").val());
  aiDifficulty = $("input[name=difficulty]:checked").val();
  mark = $("input[name=mark]:checked").val();
  //old reset
  $("#modalSettings").modal('toggle');
  
   if(mark === "o"){
    playerOne = "O";
    playerTwo = "X";    
  }else{
    playerOne = "X";
    playerTwo = "O";
  }
  
  if(numberOfPlayers === 2){
    document.getElementById("playerOneIcon").className = "";
    document.getElementById("oneIcon").innerHTML = "<b>" + playerOne + "</b>";
    document.getElementById("playerTwoIcon").className = "";
    document.getElementById("twoIcon").innerHTML = "<b>" + playerTwo + "</b>";
  }else{
    document.getElementById("playerOneIcon").className = "fa fa-user fa-3x";
    document.getElementById("oneIcon").innerHTML = "";
    document.getElementById("playerTwoIcon").className = "fa fa-laptop fa-3x";
    document.getElementById("twoIcon").innerHTML = "";
  }
  
  $.extend( $( '#modalSettings' ).data( 'bs.modal' ).options, { backdrop: true } );  
  $(".modal-header > h3").text("Game Settings");  
  updateScore();
  reset();
}// /updateSettings()
  
  function updateClickEvent(status){    
    if(status === "remove"){
      boardElement.removeEventListener('click', onePlayer);
      boardElement.removeEventListener('click', twoPlayers);
    }
    if(status === "add"){
      if(numberOfPlayers === 2){
        boardElement.addEventListener('click', twoPlayers, false);  
      }else{
        boardElement.addEventListener('click', onePlayer, false);  
      }
    }    
  }// /updateClickEvent()
  
  function drawnimation(){    
    setTimeout(function(){
      $("#0").addClass("drawTile");
      $("#0").text("X");
    },300);
    setTimeout(function(){
      $("#1").addClass("drawTile");
      $("#1").text("O");
    },600);
    setTimeout(function(){
      $("#2").addClass("drawTile");
      $("#2").text("X");
    },800);
    
    setTimeout(function(){
      $("#5").addClass("drawTile");
      $("#5").text("O");
    },100);
    setTimeout(function(){
      $("#4").addClass("drawTile");
      $("#4").html('<i class="fa fa-times-circle" aria-hidden="true"></i>');
    },600);
    setTimeout(function(){
      $("#3").addClass("drawTile");
      $("#3").text("O");
    },700);
    
    setTimeout(function(){
      $("#6").addClass("drawTile");
      $("#6").text("X");
    },300);
    setTimeout(function(){
      $("#7").addClass("drawTile");
      $("#7").text("O");
    },500);
    setTimeout(function(){
      $("#8").addClass("drawTile");
      $("#8").text("X");
    },700);    
  }// /drawnimation();
  
  function updateScore(){    
    document.getElementById("playerOneScore").textContent = playerOneScore;
    document.getElementById("playerTwoScore").textContent = playerTwoScore;
    document.getElementById("drawScore").textContent = drawScore;    
  } // /updateScore()
  
}); // /document.ready()