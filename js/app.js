//click cell
document.querySelector(".i-delay").addEventListener("keyup", function () {
  if (this.value < 0) {
    this.value = this.value.slice(1);
  }
});

const newGame = new Game();
