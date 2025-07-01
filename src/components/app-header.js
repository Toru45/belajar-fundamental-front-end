class AppHeader extends HTMLElement {
  constructor() {
    super();
    this.titleElement = null;
  }

  connectedCallback() {
    this.render();
  }

  static get observedAttributes() {
    return ['title'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'title' && oldValue !== newValue) {
      this.updateTitle();
    }
  }

  render() {
    if (!this.titleElement) {
      this.titleElement = document.createElement('h1');
      this.appendChild(this.titleElement);
    }
    this.updateTitle();
  }

  updateTitle() {
    if (this.titleElement) {
      const title = this.getAttribute('title') || 'Notes App';
      this.titleElement.textContent = title;
    }
  }
}

customElements.define('app-header', AppHeader);
