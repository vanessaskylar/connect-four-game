/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

const start = document.getElementById('start');
const board = document.getElementById('board');
const header = document.querySelector('header');
const p1 = document.getElementById('player1');
const p2 = document.getElementById('player2');

let player1 = null;
let player2 = null;

class Player {
  constructor(color){
    this.color = color;
  }
}

class Game {
  constructor(HEIGHT, WIDTH, ...players) {
    this.height = HEIGHT;
    this.width = WIDTH;
    this.board = []; // array of rows, each row is array of cells  (board[y][x])
    this.players = [...players];
    this.currPlayer = this.players[0]; // active player: 1[0] or 2[1]
    this.gameOver = false;
    this.makeBoard();
    this.makeHtmlBoard();
    header.innerHTML = "<b>"+ this.players[0].color +"</b> vs. <b>" + this.players[1].color + "</b>";
    // header.innerHTML = this.players[0].color +"<b> vs. </b>" + this.players[1].color;
  }
  
  /** makeBoard: create in-JS board structure:
     board = array of rows, each row is array of cells  (board[y][x]) */
  makeBoard() {
    for (let y = 0; y < this.height; y++) {
      this.board.push(Array.from({ length: this.width }));
    }
  }

  /** makeHtmlBoard: make HTML table and row of column tops. */
  makeHtmlBoard() {
    
    // make column tops (clickable area for adding a piece to that column)
    const top = document.createElement('tr');
    top.setAttribute('id', 'column-top');
    top.addEventListener('click', this.handleClick);
  
    for (let x = 0; x < this.width; x++) {
      const headCell = document.createElement('td');
      headCell.setAttribute('id', x);
      top.append(headCell);
    }
  
    board.append(top);
  
    // make main part of board
    for (let y = 0; y < this.height; y++) {
      const row = document.createElement('tr');
  
      for (let x = 0; x < this.width; x++) {
        const cell = document.createElement('td');
        cell.setAttribute('id', `${y}-${x}`);
        row.append(cell);
      }
  
      board.append(row);
    }
  }

  /** findSpotForCol: given column x, return top empty y (null if filled) */
  findSpotForCol(x) {
    for (let y = this.height - 1; y >= 0; y--) {
      if (!this.board[y][x]) {
        return y;
      }
    }
    return null;
  }

  /** placeInTable: update DOM to place piece into HTML table of board */
  placeInTable(y, x) {
    const piece = document.createElement('div');
    piece.classList.add('piece');
    piece.style.backgroundColor = this.currPlayer.color;
    piece.style.top = -50 * (y + 2);

    const spot = document.getElementById(`${y}-${x}`);
    spot.append(piece);
  }

  /** endGame: announce game end */

  endGame(msg) {
    this.gameOver = true;
    setTimeout(function() {alert(msg.charAt(0).toUpperCase() + msg.slice(1))}, 100);
  }

  /** handleClick: handle click of column top to play piece */
  handleClick = (event) => {
    if (this.gameOver) return
      // get x from ID of clicked cell
      const x = event.target.id;

      // get next spot in column (if none, ignore click)
      const y = this.findSpotForCol(x);
      if (y === null) {
        return;
      }

      // place piece in board and add to HTML table
      this.board[y][x] = this.currPlayer;
      this.placeInTable(y, x);
      
      // check for win
      if (this.checkForWin()) {
        return this.endGame(`${this.currPlayer.color} wins!`);
      }
      
      // check for tie
      if (this.board.every(row => row.every(cell => cell))) {
        return this.endGame('Tie!');
      }
        
      // switch players
      this.currPlayer = this.currPlayer === this.players[0] ? this.players[1] : this.players[0];

  }
    


  /** checkForWin: check board cell-by-cell for "does a win start here?" */

  checkForWin() {
    const _win = (cells) => {
      // Check four cells to see if they're all color of current player
      //  - cells: list of four (y, x) cells
      //  - returns true if all are legal coordinates & all match currPlayer

      return cells.every(
        ([y, x]) =>
          y >= 0 &&
          y < this.height &&
          x >= 0 &&
          x < this.width &&
          this.board[y][x] === this.currPlayer
      );
    }

    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        // get "check list" of 4 cells (starting here) for each of the different
        // ways to win
        const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
        const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
        const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
        const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

        // find winner (only checking each win-possibility as needed)
        if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
          return true;
        }
      }
    }
  }
}

function isValidColor(strColor) {
  var s = new Option().style;
  s.color = strColor;

  // return 'false' if color wasn't assigned
  return s.color === strColor.toLowerCase();
}


function checkColors(e){
  e.preventDefault()
  color1 = p1.value.toLowerCase().replace(" ", "");
  color2 = p2.value.toLowerCase().replace(" ", "");

  if (color1 === '' && color2 === ''){
    alert('Colors cannot be the same.') 
    return
  } else if (color1 === ''){
    alert('Player 1, please choose a color.') 
    return
  } else if (color2 === ''){
    alert('Player 2, please choose a color.') 
    return
  }

  if(color1 === color2){
    alert('Please choose two different colors.') 
    return
  } 

  if (!isValidColor(color1) && !isValidColor(color2)){
    alert('Please choose two valid colors.')
    return;
  } else if (!isValidColor(color1)){
    alert('Player 1, please choose a valid color.')
    return; 
  } else if (!isValidColor(color2)){
    alert('Player 2, please choose a valid color.')
    return; 
  }

  player1 = new Player(color1);
  player2 = new Player(color2);
  p1.parentElement.remove();
  p2.parentElement.remove();
  startNewGame();
}

function startNewGame(){
  board.innerHTML = '';
  new Game(6, 7, player1, player2);
  start.value = "Restart";
}

start.addEventListener('click', checkColors)