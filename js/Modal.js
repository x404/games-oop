/*
 * Modal
 */

class Modal {
  constructor(countSuccess, countError) {
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
		  <p class="title">Score:</p>
		  <div class="d-flex score">
			<div>You: ${this.countSuccess}</div>
			<div>Computer: ${this.countError}</div>
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
