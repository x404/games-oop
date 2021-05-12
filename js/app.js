//click cell
document.querySelector(".i-delay").addEventListener("keyup", function () {
  if (this.value < 0) {
    this.value = this.value.slice(1);
  }
});

// const el =
let newGame = new Game();
newGame.cellcounts = 100;
newGame.finishcount = 10;
newGame.gameDiv = document.querySelector(".list");
newGame.init();
