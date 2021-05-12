/**
 * Game
 */
class Game {
  /**
   * properties
   * @param {object}  objOfCells - object of cells
   * @param {boolean} clickCellFlag - whether the cell was clicked by user, need for updateStatusCellInObj to change status cell to error
   * @param {boolean} start - start game. need to reset all params before repeat start game.
   * @param {boolean} errorDelayValue - flag of negative or error of input#delay
   * @param {element} gameDiv - main element for game
   * @param {function} fragment - element for accumulate cells
   * @param {number} cellcounts - number of counts
   * @param {number} finishcount - finish count
   * @param {element} timeoutEl - delay input element
   * @param {element} userCountEl - user input element (html)
   * @param {element} computerCountEl - computer input element (html)
   * @param {timer} timer - timer
   * @param {number} countSuccess - count of succeful clicks
   * @param {number} countError - count of miss clicks
   *
   */

  #objOfCells = {};
  #clickCellFlag = false;
  #start = false;
  #errorDelayValue = false;
  #fragment = document.createDocumentFragment();
  #timer;
  #prevId;

  constructor(
    cellcounts = 100,
    finishcount = 10,
    timeoutEl,
    gameDiv,
    userCountEl,
    computerCountEl,
    countSuccess = 0,
    countError = 0
  ) {
    this.cellcounts = cellcounts;
    this.finishcount = finishcount;
    this.timeoutEl = timeoutEl || document.querySelector(".i-delay");
    this.gameDiv = gameDiv || document.querySelector(".list");

    this.userCountEl = userCountEl || document.querySelector("#user_count");
    this.computerCountEl = computerCountEl || document.querySelector("#computer_count");
    this.countSuccess = countSuccess;
    this.countError = countError;
  }

  init() {
    if (this.cellcounts > 0 && typeof this.cellcounts === "number") {
      for (let i = 1; i <= this.cellcounts; i++) {
        this.createObj(i);
        this.renderGrid(i);
      }
      this.gameDiv.appendChild(this.#fragment);
      this.eventsListeners();
    }
  }

  /**
   * Method for create object
   */
  createObj(id) {
    let obj = {};
    obj.id = id;
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
      const id = arr[rnd][1].id;

      document.querySelector(".btn-start").classList.add("d-none");
      // set active cell
      document.querySelector(`[data-id="${id}"]`).classList.add("cell-active");

      // start timer
      this.#prevId = id;
      this.#timer = setInterval(this.blinkCell.bind(this), this.timeout);
      this.#start = true;
      this.#errorDelayValue = false;
    } else if (!this.#errorDelayValue) {
      this.gameDiv.insertAdjacentHTML(
        "beforeend",
        '<p class="error">Введите число больше нуля!</p>'
      );
      this.#errorDelayValue = true;
    }
  }

  // check data (success and error cells) in Object
  checkResult() {
    this.countSuccess = Object.entries(this.#objOfCells).filter(
      (el) => el[1].success == true
    ).length;
    this.countError = Object.entries(this.#objOfCells).filter((el) => el[1].error == true).length;

    this.updateCountElements(this.countSuccess, this.countError);

    if (this.countSuccess == this.finishcount || this.countError == this.finishcount) {
      console.log("%c- STOP GAME -", "color: red;font-weight:bold");
      // console.log(this.#objOfCells);

      const newModal = new Modal(this.countSuccess, this.countError);
      newModal.show();

      clearInterval(this.#timer);
      return false;
    }
    return true;
  }

  // update num of Count Elements in HTML
  updateCountElements(countSuccess, countError) {
    this.userCountEl.textContent = countSuccess;
    this.computerCountEl.textContent = countError;
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
      this.updateStatusCellInObj(this.#prevId, "error");
    }

    const arr = Object.entries(this.#objOfCells).filter(
      (el) => el[1].error == false && el[1].success == false
    );

    if (arr.length === 0 || !this.checkResult()) {
      clearInterval(this.#timer);
      return;
    }

    // select random element from array
    const rnd = this.randomInteger(arr.length - 1);
    const id = arr[rnd][1].id;

    this.#prevId = id;
    if (this.countError < this.finishcount && this.countSuccess < this.finishcount) {
      // set active next cell in html
      document.querySelector(`[data-id="${id}"]`).classList.add("cell-active");
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
        clearInterval(this.#timer);
        this.blinkCell();
        this.#timer = setInterval(this.blinkCell.bind(this), this.timeout);
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
    this.#prevId = null;
    this.countSuccess = 0;
    this.countError = 0;

    this.updateCountElements(this.countSuccess, this.countError);
  }

  eventsListeners() {
    document.querySelector(".btn-start").addEventListener("click", () => this.startGame());
    document.querySelector(".list").addEventListener("click", (e) => this.updateCell(e));
  }
}
