/**
 * Game
 */

let countSuccess = 0;
let countError = 0;

const humanCountEl = document.querySelector("#human_count");
const computerCountEl = document.querySelector("#computer_count");

// =BLINK CELLS
let timer;
let prevId;

class Game {
  /**
   * properties
   * @param {object}  objOfCells - object of cells
   * @param {boolean} clickCellFlag - whether the cell was clicked by user, need for updateStatusCellInObj to change status cell to error
   * @param {boolean} start - start game. need to reset all params before repeat start game.
   * @param {boolean} errorDelayValue - flag of negative or error of input#delay
   * @param {element} _gameDiv - main element for game
   * @param {function} fragment - element for accumulate cells
   * @param {number} cellcounts - number of counts
   * @param {number} finishcount - finish count
   * @param {element} timeoutEl - delay input element
   *
   *
   * @param [array] _element
   * @param [array] _header
   */

  #objOfCells = {};
  #clickCellFlag = false;
  #start = false;
  #errorDelayValue = false;
  #fragment = document.createDocumentFragment();

  constructor(cellcounts = 100, finishcount = 10, timeoutEl, gameDiv) {
    this.cellcounts = cellcounts;
    this.finishcount = finishcount;
    this.timeoutEl = timeoutEl || document.querySelector(".i-delay");
    this._gameDiv = gameDiv || document.querySelector(".list");
  }

  init() {
    if (this.cellcounts > 0 && typeof this.cellcounts === "number") {
      for (let i = 1; i <= this.cellcounts; i++) {
        this.createObj(i);
        this.renderGrid(i);
      }
      this._gameDiv.appendChild(this.#fragment);
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

    this.#objOfCells[id] = obj;
  }

  /**
   * Method for render Grid
   */
  renderGrid(id) {
    const div = document.createElement("div");
    div.classList.add("cell");
    div.dataset.id = id;
    this.#fragment.appendChild(div);
  }

  // start game
  startGame() {
    this.timeout = +this.timeoutEl.value || 1500;
    if (this.timeout > 0 && typeof this.timeout === "number") {
      if (this.#start) this.reset();
      if (this.#errorDelayValue && document.querySelectorAll(".error").length > 0) {
        document.querySelector(".error").remove();
      }
      // starting position
      const arr = Object.entries(this.#objOfCells);
      const rnd = this.randomInteger(arr.length - 1);
      const _id = arr[rnd][1]._id;

      document.querySelector(".btn-start").classList.add("d-none");
      // set active cell
      document.querySelector(`[data-id="${_id}"]`).classList.add("cell-active");

      // start timer
      prevId = _id;
      timer = setInterval(this.blinkCell.bind(this), this.timeout);
      this.#start = true;
      this.#errorDelayValue = false;
    } else if (!this.#errorDelayValue) {
      this._gameDiv.insertAdjacentHTML(
        "beforeend",
        '<p class="error">Введите число больше нуля!</p>'
      );
      this.#errorDelayValue = true;
    }
  }

  // check data (success and error cells) in Object
  checkResult() {
    countSuccess = Object.entries(this.#objOfCells).filter((el) => el[1].success == true).length;
    countError = Object.entries(this.#objOfCells).filter((el) => el[1].error == true).length;

    this.updateCountElements(countSuccess, countError);

    if (countSuccess == this.finishcount || countError == this.finishcount) {
      console.log("%c- STOP GAME -", "color: red;font-weight:bold");
      // console.log(this.#objOfCells);

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

    const arr = Object.entries(this.#objOfCells).filter(
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
    if (countError < this.finishcount && countSuccess < this.finishcount) {
      // set active next cell in html
      document.querySelector(`[data-id="${_id}"]`).classList.add("cell-active");
    }

    this.#clickCellFlag = false;
  }

  // update status Cell in Object
  updateStatusCellInObj(id, key) {
    this.#objOfCells[id][key] = true;
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
        timer = setInterval(this.blinkCell.bind(this), this.timeout);
      }

      target.classList.remove("cell-active");
      target.classList.add("cell-success");
    }
  }

  reset() {
    for (let key in this.#objOfCells) {
      this.#objOfCells[key].success = false;
      this.#objOfCells[key].error = false;
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
