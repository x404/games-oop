/*
 * Modal with results of game
 */

class Modal {
  constructor(countSuccess = 0, countError = 0) {
    this.init();
    this.countSuccess = countSuccess;
    this.countError = countError;
  }

  init() {
    this.isOpened = false;
  }

  show() {
    const html = `
	  <div class="modal">
		<div class="modal-inner">
		  <p class="title">Счет:</p>
		  <div class="d-flex score">
			<div>Вы: ${this.countSuccess}</div>
			<div>Компьютер: ${this.countError}</div>
		  </div>
		  <button type="button" class="close">x</button>
		</div>
	  </div>
	  <div class="backdrop"></div>
	  `;
    document.body.classList.add("modal-open");
    document.body.insertAdjacentHTML("beforeend", html);

    this.isOpened = true;
    this.eventsListeners();
  }

  close() {
    if (!this.isOpened) {
      return;
    }
    document.body.classList.remove("modal-open");
    document.querySelector(".backdrop").remove();
    document.querySelector(".modal").remove();
    document.querySelector(".btn-start").classList.remove("d-none");
    this.isOpened = false;
  }

  eventsListeners() {
    document.querySelector(".modal .close").addEventListener(
      "click",
      function (e) {
        this.close();
      }.bind(this)
    );

    window.addEventListener(
      "keydown",
      function (e) {
        if (e.key === "Escape") {
          this.close();
        }
      }.bind(this)
    );
  }
}
