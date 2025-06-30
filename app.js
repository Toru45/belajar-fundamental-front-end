let notes = [...notesData];

function formatDate(dateString) {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
}

function generateId() {
    return 'notes-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
}

class AppHeader extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.render();
    }
    static get observedAttributes() {
        return ['title'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'title' && oldValue !== newValue) {
            this.render();
        }
    }

    render() {
        const title = this.getAttribute('title') || 'Notes App';
        this.innerHTML = `
            <h1>${title}</h1>
        `;
    }
}

class NoteForm extends HTMLElement {
    constructor() {
        super();
        this.isValid = {
            title: false,
            body: false
        };
    }

    connectedCallback() {
        this.render();
        this.attachEventListeners();
    }

    render() {
        this.innerHTML = `
            <h3>Add New Note</h3>
            <form class="form-grid" id="note-form">
                <div class="form-group" id="title-group">
                    <label for="note-title">Title</label>
                    <input type="text" id="note-title" name="title" placeholder="Enter note title..." required>
                    <div class="error-message" id="title-error"></div>
                </div>
                
                <div class="form-group" id="body-group">
                    <label for="note-body">Content</label>
                    <textarea id="note-body" name="body" placeholder="Write your note content here..." required></textarea>
                    <div class="error-message" id="body-error"></div>
                </div>
                
                <button type="submit" class="btn btn-primary" id="submit-btn" disabled>Add Note</button>
            </form>
        `;
    }

    attachEventListeners() {
        const form = this.querySelector('#note-form');
        const titleInput = this.querySelector('#note-title');
        const bodyInput = this.querySelector('#note-body');
        const submitBtn = this.querySelector('#submit-btn');

        titleInput.addEventListener('input', (e) => {
            this.validateTitle(e.target.value);
            this.updateSubmitButton();
        });

        bodyInput.addEventListener('input', (e) => {
            this.validateBody(e.target.value);
            this.updateSubmitButton();
        });

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit();
        });
    }

    validateTitle(value) {
        const titleGroup = this.querySelector('#title-group');
        const titleError = this.querySelector('#title-error');
        
        titleGroup.classList.remove('error');
        titleError.textContent = '';

        if (!value.trim()) {
            this.isValid.title = false;
            titleGroup.classList.add('error');
            titleError.textContent = 'Title is required';
        } else if (value.trim().length < 3) {
            this.isValid.title = false;
            titleGroup.classList.add('error');
            titleError.textContent = 'Title must be at least 3 characters long';
        } else {
            this.isValid.title = true;
        }
    }

    validateBody(value) {
        const bodyGroup = this.querySelector('#body-group');
        const bodyError = this.querySelector('#body-error');
        
        bodyGroup.classList.remove('error');
        bodyError.textContent = '';

        if (!value.trim()) {
            this.isValid.body = false;
            bodyGroup.classList.add('error');
            bodyError.textContent = 'Content is required';
        } else if (value.trim().length < 10) {
            this.isValid.body = false;
            bodyGroup.classList.add('error');
            bodyError.textContent = 'Content must be at least 10 characters long';
        } else {
            this.isValid.body = true;
        }
    }

    updateSubmitButton() {
        const submitBtn = this.querySelector('#submit-btn');
        submitBtn.disabled = !(this.isValid.title && this.isValid.body);
    }

    handleSubmit() {
        const titleInput = this.querySelector('#note-title');
        const bodyInput = this.querySelector('#note-body');
        
        const newNote = {
            id: generateId(),
            title: titleInput.value.trim(),
            body: bodyInput.value.trim(),
            createdAt: new Date().toISOString(),
            archived: false
        };

        notes.unshift(newNote); 
        
        titleInput.value = '';
        bodyInput.value = '';
        this.isValid = { title: false, body: false };
        this.updateSubmitButton();
        renderNotes();
        this.showSuccessMessage();
    }

    showSuccessMessage() {
        const form = this.querySelector('#note-form');
        const successMsg = document.createElement('div');
        successMsg.textContent = 'Note added successfully!';
        successMsg.style.cssText = 'color: #38a169; background: #f0fff4; padding: 10px; border-radius: 6px; margin-bottom: 15px; border: 1px solid #c6f6d5;';
        form.insertBefore(successMsg, form.firstChild);
        setTimeout(() => {
            successMsg.remove();
        }, 3000);
    }
}

class NoteCard extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.render();
        this.attachEventListeners();
    }

    static get observedAttributes() {
        return ['note-id', 'note-title', 'note-body', 'note-date', 'show-actions'];
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
        
        const formattedDate = date ? formatDate(date) : '';
        
        this.innerHTML = `
            <div class="note-title">${title}</div>
            <div class="note-body">${body}</div>
            <div class="note-date">${formattedDate}</div>
            ${showActions ? `
                <div class="note-actions">
                    <button class="btn btn-danger btn-small delete-btn" data-note-id="${noteId}">
                        Delete
                    </button>
                </div>
            ` : ''}
        `;
    }

    attachEventListeners() {
        const deleteBtn = this.querySelector('.delete-btn');
        if (deleteBtn) {
            deleteBtn.addEventListener('click', (e) => {
                const noteId = e.target.getAttribute('data-note-id');
                this.deleteNote(noteId);
            });
        }
    }

    deleteNote(noteId) {
        if (confirm('Are you sure you want to delete this note?')) {
            notes = notes.filter(note => note.id !== noteId);
            renderNotes();
        }
    }
}

customElements.define('app-header', AppHeader);
customElements.define('note-form', NoteForm);
customElements.define('note-card', NoteCard);

function renderNotes() {
    const notesContainer = document.getElementById('notes-container');
    
    if (notes.length === 0) {
        notesContainer.innerHTML = `
            <div class="empty-state">
                <h3>No notes yet</h3>
                <p>Create your first note using the form above!</p>
            </div>
        `;
        return;
    }

    notesContainer.innerHTML = '';
    
    notes.forEach(note => {
        const noteCard = document.createElement('note-card');
        noteCard.setAttribute('note-id', note.id);
        noteCard.setAttribute('note-title', note.title);
        noteCard.setAttribute('note-body', note.body);
        noteCard.setAttribute('note-date', note.createdAt);
        noteCard.setAttribute('show-actions', 'true');
        
        notesContainer.appendChild(noteCard);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    renderNotes();
});

function initializeSearch() {
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = 'Search notes...';
    searchInput.style.cssText = 'width: 100%; padding: 12px 16px; border: 2px solid #e2e8f0; border-radius: 8px; font-size: 1rem; margin-bottom: 20px;';
    
    const notesSection = document.querySelector('.notes-section');
    const notesTitle = notesSection.querySelector('h2');
    notesTitle.insertAdjacentElement('afterend', searchInput);
    
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const filteredNotes = notes.filter(note => 
            note.title.toLowerCase().includes(searchTerm) || 
            note.body.toLowerCase().includes(searchTerm)
        );
        renderFilteredNotes(filteredNotes);
    });
}

function renderFilteredNotes(filteredNotes) {
    const notesContainer = document.getElementById('notes-container');
    
    if (filteredNotes.length === 0) {
        notesContainer.innerHTML = `
            <div class="empty-state">
                <h3>No matching notes found</h3>
                <p>Try adjusting your search terms</p>
            </div>
        `;
        return;
    }

    notesContainer.innerHTML = '';
    
    filteredNotes.forEach(note => {
        const noteCard = document.createElement('note-card');
        noteCard.setAttribute('note-id', note.id);
        noteCard.setAttribute('note-title', note.title);
        noteCard.setAttribute('note-body', note.body);
        noteCard.setAttribute('note-date', note.createdAt);
        noteCard.setAttribute('show-actions', 'true');
        
        notesContainer.appendChild(noteCard);
    });
} 