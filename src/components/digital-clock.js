import moment from 'moment';

class DigitalClock extends HTMLElement {
  constructor() {
    super();
    this.interval = null;
  }

  connectedCallback() {
    this.render();
    this.startClock();
  }

  disconnectedCallback() {
    this.stopClock();
  }

  render() {
    this.innerHTML = `
            <div class="digital-clock">
                <div class="time-display" id="time-display">
                    ${moment().format('HH:mm:ss')}
                </div>
                <div class="date-display" id="date-display">
                    ${moment().format('dddd, DD MMMM YYYY')}
                </div>
            </div>
        `;
  }

  startClock() {
    this.updateTime();
    this.interval = setInterval(() => {
      this.updateTime();
    }, 1000);
  }

  stopClock() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }

  updateTime() {
    const timeDisplay = this.querySelector('#time-display');
    const dateDisplay = this.querySelector('#date-display');

    if (timeDisplay && dateDisplay) {
      timeDisplay.textContent = moment().format('HH:mm:ss');
      dateDisplay.textContent = moment().format('dddd, DD MMMM YYYY');
    }
  }
}

customElements.define('digital-clock', DigitalClock);
