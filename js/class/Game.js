/*
 * Game
 */

// create object and grid
let objOfCells = {};
const CELLCOUNTS = 100;
const fragment = document.createDocumentFragment();
const list = document.querySelector(".list");

const FINISHCOUNT = 10;
let countSuccess = 0;
let countError = 0;
let timeout = +document.querySelector(".i-delay").value;

const humanCountEl = document.querySelector("#human_count");
const computerCountEl = document.querySelector("#computer_count");

// =BLINK CELLS
let timer;
let prevId;

class Game {
  /**
   * properties
   * @param {boolean} clickCellFlag - whether the cell was clicked by user, need for updateStatusCellInObj to change status cell to error
   * @param {boolean} start - start game. need to reset all params before repeat start game.
   * @param {boolean} errorDelayValue - flag of negative or error of input#delay
   *
   * @param [array] _tableClass
   * @param [array] data
   * @param [array] _attribute
   * @param [array] _element
   * @param [array] _header
   */

  #clickCellFlag = false;
  #start = false;
  #errorDelayValue = false;

  constructor() {
    this.init();
  }

  init() {
    if (CELLCOUNTS > 0 && typeof CELLCOUNTS === "number") {
      for (let i = 1; i <= CELLCOUNTS; i++) {
        this.createObj(i);
        this.renderGrid(i);
      }
      list.appendChild(fragment);
      this.eventsListeners();
    }
  }

  /**
   * Method for create object
   */
  createObj(id) {
    let obj = {};
    obj._id = id;
    obj.success = false;
    obj.error = false;

    objOfCells[id] = obj;
  }

  /**
   * Method for render Grid
   */
  renderGrid(id) {
    const div = document.createElement("div");
    div.classList.add("cell");
    div.dataset.id = id;
    fragment.appendChild(div);
  }

  // start game
  startGame() {
    timeout = +document.querySelector(".i-delay").value;
    if (timeout > 0 && typeof timeout === "number") {
      if (this.#start) this.reset();
      if (this.#errorDelayValue && document.querySelectorAll(".error").length > 0) {
        document.querySelector(".error").remove();
      }
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
      this.#start = true;
      this.#errorDelayValue = false;
    } else if (!this.#errorDelayValue) {
      list.insertAdjacentHTML("beforeend", '<p class="error">Введите число больше нуля!</p>');
      this.#errorDelayValue = true;
    }
  }

  // check data (success and error cells) in Object
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

  // update num of Count Elements in HTML
  updateCountElements(countSuccess, countError) {
    humanCountEl.textContent = countSuccess;
    computerCountEl.textContent = countError;
  }

  // random number
  randomInteger(max) {
    let rand = Math.floor(Math.random() * (max + 1));
    return rand;
  }

  // blink cell
  blinkCell() {
    //  if cell was active and no pressed it
    if (!this.#clickCellFlag) {
      document.querySelector(".cell-active").classList.add("cell-error");
      document.querySelector(".cell-active").classList.remove("cell-active");
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

    this.#clickCellFlag = false;
  }

  // update status Cell in Object
  updateStatusCellInObj(id, key) {
    objOfCells[id][key] = true;
  }

  // update Status Cell in Grid and update status in Object
  updateCell(e) {
    const target = e.target;
    if (target.classList.contains("cell-active")) {
      const id = target.dataset.id;
      this.#clickCellFlag = true;
      this.updateStatusCellInObj(id, "success");

      if (this.checkResult()) {
        clearInterval(timer);
        this.blinkCell();
        timer = setInterval(this.blinkCell.bind(this), timeout);
      }

      target.classList.remove("cell-active");
      target.classList.add("cell-success");
    }
  }

  reset() {
    for (let key in objOfCells) {
      objOfCells[key].success = false;
      objOfCells[key].error = false;
    }

    if (document.querySelectorAll(".cell-error").length > 0) {
      document.querySelectorAll(".cell-error").forEach((el) => {
        el.classList.remove("cell-error");
      });
    }

    if (document.querySelectorAll(".cell-success").length > 0) {
      document.querySelectorAll(".cell-success").forEach((el) => {
        el.classList.remove("cell-success");
      });
    }
    prevId = null;
    countSuccess = 0;
    countError = 0;

    this.updateCountElements(countSuccess, countError);
  }

  eventsListeners() {
    document.querySelector(".btn-start").addEventListener("click", () => this.startGame());
    document.querySelector(".list").addEventListener("click", (e) => this.updateCell(e));
  }
}
