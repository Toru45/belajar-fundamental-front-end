class NoteCard extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.render();
    this.attachEventListeners();
  }

  static get observedAttributes() {
    return ['note-id', 'note-title', 'note-body', 'note-date', 'show-actions', 'archived'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this.render();
    }
  }

  render() {
    const noteId = this.getAttribute('note-id');
    const title = this.getAttribute('note-title') || 'Untitled';
    const body = this.getAttribute('note-body') || '';
    const date = this.getAttribute('note-date');
    const showActions = this.getAttribute('show-actions') === 'true';
    const archived = this.getAttribute('archived') === 'true';

    const formattedDate = date ? this.formatDate(date) : '';
    const archiveButtonText = archived ? 'Unarchive' : 'Archive';

    this.innerHTML = `
            <div class="note-title">${title}</div>
            <div class="note-body">${body}</div>
            <div class="note-date">${formattedDate}</div>
            ${
              showActions
                ? `
                <div class="note-actions">
                    <button class="btn btn-secondary btn-small archive-btn" data-note-id="${noteId}">
                        ${archiveButtonText}
                    </button>
                    <button class="btn btn-danger btn-small delete-btn" data-note-id="${noteId}">
                        Delete
                    </button>
                </div>
            `
                : ''
            }
        `;
  }

  formatDate(dateString) {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }

  attachEventListeners() {
    const deleteBtn = this.querySelector('.delete-btn');
    const archiveBtn = this.querySelector('.archive-btn');

    if (deleteBtn) {
      deleteBtn.addEventListener('click', (e) => {
        const noteId = e.target.getAttribute('data-note-id');
        this.deleteNote(noteId);
      });
    }

    if (archiveBtn) {
      archiveBtn.addEventListener('click', (e) => {
        const noteId = e.target.getAttribute('data-note-id');
        const archived = this.getAttribute('archived') === 'true';
        this.toggleArchive(noteId, archived);
      });
    }
  }

  async deleteNote(noteId) {
    if (confirm('Are you sure you want to delete this note?')) {
      try {
        const result = await window.notesAPI.deleteNote(noteId);
        if (result.success) {
          window.dispatchEvent(new CustomEvent('noteDeleted'));
        } else {
          alert('Failed to delete note: ' + (result.message || 'Unknown error'));
        }
      } catch (error) {
        alert('Network error. Please try again.');
      }
    }
  }

  async toggleArchive(noteId, currentlyArchived) {
    try {
      const result = currentlyArchived
        ? await window.notesAPI.unarchiveNote(noteId)
        : await window.notesAPI.archiveNote(noteId);

      if (result.success) {
        window.dispatchEvent(new CustomEvent('noteArchived'));
      } else {
        alert('Failed to archive/unarchive note: ' + (result.message || 'Unknown error'));
      }
    } catch (error) {
      alert('Network error. Please try again.');
    }
  }
}

customElements.define('note-card', NoteCard);
