// create object and grid
let objOfCells = {};
const CELLCOUNTS = 100;
const fragment = document.createDocumentFragment();
const list = document.querySelector(".list");

const FINISHCOUNT = 10;
let start = false;
let countSuccess = 0;
let countError = 0;
let timeout = +document.querySelector(".i-delay").value;
let flag = false;
let errorInput = false;

const humanCountEl = document.querySelector("#human_count");
const computerCountEl = document.querySelector("#computer_count");

// =BLINK CELLS
let timer;
let prevId;

class Game {
  constructor() {
    this.init();
  }

  init() {
    for (let i = 1; i <= CELLCOUNTS; i++) {
      this.createObj(i);
      this.renderGrid(i);
    }
    list.appendChild(fragment);
    this.eventsListeners();
  }

  createObj(id) {
    let obj = {};
    obj._id = id;
    obj.success = false;
    obj.error = false;

    objOfCells[id] = obj;
  }

  renderGrid(id) {
    const div = document.createElement("div");
    div.classList.add("cell");
    div.dataset.id = id;
    fragment.appendChild(div);
  }

  // start() {
  //   timeout = +document.querySelector(".i-delay").value;
  //   if (timeout > 0 && typeof timeout === "number") {
  //     if (start) reset();
  //     if (errorInput && document.querySelectorAll(".error").length > 0)
  //       document.querySelector(".error").remove();
  //     // starting position
  //     const arr = Object.entries(objOfCells);
  //     const rnd = this.randomInteger(arr.length - 1);
  //     const _id = arr[rnd][1]._id;

  //     document.querySelector(".btn-start").classList.add("d-none");
  //     // set active cell
  //     document.querySelector(`[data-id="${_id}"]`).classList.add("cell-active");

  //     // start timer
  //     prevId = _id;
  //     timer = setInterval(this.blinkCell.bind(this), timeout);
  //     start = true;
  //     errorInput = false;
  //   } else {
  //     if (!errorInput) {
  //       list.insertAdjacentHTML("beforeend", '<p class="error">Введите число больше нуля!</p>');
  //     }
  //     errorInput = true;
  //   }
  // }

  checkResult() {
    countSuccess = Object.entries(objOfCells).filter((el) => el[1].success == true).length;
    countError = Object.entries(objOfCells).filter((el) => el[1].error == true).length;

    this.updateCountElements(countSuccess, countError);

    if (countSuccess == FINISHCOUNT || countError == FINISHCOUNT) {
      console.log("%c- STOP GAME -", "color: red;font-weight:bold");
      // console.log(objOfCells);

      const newModal = new Modal(countSuccess, countError);
      newModal.show();

      clearInterval(timer);
      return false;
    }
    return true;
  }

  updateCountElements(countSuccess, countError) {
    humanCountEl.textContent = countSuccess;
    computerCountEl.textContent = countError;
  }

  // random number
  randomInteger(max) {
    let rand = Math.floor(Math.random() * (max + 1));
    return rand;
  }

  blinkCell() {
    //  if cell was active and no pressed it
    if (!flag) {
      document.querySelector(".cell-active").classList.add("cell-error");
      document.querySelector(".cell-active").classList.remove("cell-active");

      //   console.log("prevId=", prevId);
      this.updateStatusCellInObj(prevId, "error");
    }

    const arr = Object.entries(objOfCells).filter(
      (el) => el[1].error == false && el[1].success == false
    );

    if (arr.length === 0 || !this.checkResult()) {
      clearInterval(timer);
      return;
    }

    // select random element from array
    const rnd = this.randomInteger(arr.length - 1);
    const _id = arr[rnd][1]._id;

    prevId = _id;
    if (countError < FINISHCOUNT && countSuccess < FINISHCOUNT) {
      // set active next cell in html
      document.querySelector(`[data-id="${_id}"]`).classList.add("cell-active");
    }
    flag = false;
  }

  updateStatusCellInObj(id, key) {
    objOfCells[id][key] = true;
  }

  eventsListeners() {
    document.querySelector(".btn-start").addEventListener(
      "click",
      function () {
        timeout = +document.querySelector(".i-delay").value;
        if (timeout > 0 && typeof timeout === "number") {
          if (start) reset();
          if (errorInput && document.querySelectorAll(".error").length > 0)
            document.querySelector(".error").remove();
          // starting position
          const arr = Object.entries(objOfCells);
          const rnd = this.randomInteger(arr.length - 1);
          const _id = arr[rnd][1]._id;

          document.querySelector(".btn-start").classList.add("d-none");
          // set active cell
          document.querySelector(`[data-id="${_id}"]`).classList.add("cell-active");

          // start timer
          prevId = _id;
          timer = setInterval(this.blinkCell.bind(this), timeout);
          start = true;
          errorInput = false;
        } else {
          if (!errorInput) {
            list.insertAdjacentHTML("beforeend", '<p class="error">Введите число больше нуля!</p>');
          }
          errorInput = true;
        }
      }.bind(this)
    );

    document.querySelector(".list").addEventListener(
      "click",
      function (e) {
        const target = e.target;
        if (target.classList.contains("cell-active")) {
          const id = target.dataset.id;
          flag = true;
          this.updateStatusCellInObj(id, "success");

          if (this.checkResult()) {
            clearInterval(timer);
            this.blinkCell();
            timer = setInterval(this.blinkCell, timeout);
          }

          target.classList.remove("cell-active");
          target.classList.add("cell-success");
        }
      }.bind(this)
    );
  }
}
