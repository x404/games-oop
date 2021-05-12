//click cell
document.querySelector(".i-delay").addEventListener("keyup", function () {
  if (this.value < 0) {
    this.value = this.value.slice(1);
  }
});

let newGame = new Game();
newGame.cellcounts = 100;
newGame.finishcount = 10;
newGame.gameDiv = document.querySelector(".list");
newGame.timeoutEl = document.querySelector(".i-delay");

newGame.init();
