import './style.css';
import './services/notes-api.js';
import './components/app-header.js';
import './components/note-form.js';
import './components/note-card.js';
import './components/digital-clock.js';

let notes = [];
let currentView = 'active';

function showTabLoading() {
  // Remove existing loading if any
  hideTabLoading();

  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    const loadingDiv = document.createElement('div');
    loadingDiv.id = 'tab-loading';
    loadingDiv.className = 'notes-loading';
    loadingDiv.textContent = 'Loading notes...';

    // Insert loading between search input and notes container
    searchInput.insertAdjacentElement('afterend', loadingDiv);
  }
}

function hideTabLoading() {
  const existingLoading = document.getElementById('tab-loading');
  if (existingLoading) {
    existingLoading.remove();
  }
}

async function loadNotes() {
  showTabLoading();

  try {
    const result =
      currentView === 'archived'
        ? await window.notesAPI.getArchivedNotes()
        : await window.notesAPI.getNotes();

    if (result.success) {
      notes = result.data || [];
      renderNotes();
    } else {
      showErrorMessage('Failed to load notes: ' + result.message);
      notes = [];
      renderNotes();
    }
  } catch (error) {
    showErrorMessage('Network error. Please try again.');
    notes = [];
    renderNotes();
  } finally {
    hideTabLoading();
  }
}

function renderNotes() {
  const notesContainer = document.getElementById('notes-container');

  if (!notes.length) {
    notesContainer.innerHTML = `
            <div class="empty-state">
                <h3>No notes ${currentView === 'archived' ? 'archived' : 'yet'}</h3>
                <p>${currentView === 'archived' ? 'Archieved notes displayed here' : 'Lets create your first note'}</p>
            </div>
        `;
    return;
  }

  notesContainer.innerHTML = '';

  notes.forEach((note) => {
    const noteCard = document.createElement('note-card');
    noteCard.setAttribute('note-id', note.id);
    noteCard.setAttribute('note-title', note.title);
    noteCard.setAttribute('note-body', note.body);
    noteCard.setAttribute('note-date', note.createdAt);
    noteCard.setAttribute('show-actions', 'true');
    noteCard.setAttribute('archived', note.archived ? 'true' : 'false');

    notesContainer.appendChild(noteCard);
  });
}

function initializeSearch() {
  const searchInput = document.createElement('input');
  searchInput.type = 'text';
  searchInput.id = 'search-input';
  searchInput.placeholder = 'Search notes...';
  searchInput.style.cssText =
    'width: 100%; padding: 12px 16px; border: 2px solid #e2e8f0; border-radius: 8px; font-size: 1rem; margin-bottom: 20px;';

  const notesSection = document.querySelector('.notes-section');
  const notesTitle = notesSection.querySelector('h2');
  notesTitle.insertAdjacentElement('afterend', searchInput);

  searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filteredNotes = notes.filter(
      (note) =>
        note.title.toLowerCase().includes(searchTerm) ||
        note.body.toLowerCase().includes(searchTerm),
    );
    renderFilteredNotes(filteredNotes);
  });
}

function renderFilteredNotes(filteredNotes) {
  const notesContainer = document.getElementById('notes-container');

  if (!filteredNotes.length) {
    notesContainer.innerHTML = `
            <div class="empty-state">
                <h3>No matching notes found</h3>
                <p>Try adjusting your search terms</p>
            </div>
        `;
    return;
  }

  notesContainer.innerHTML = '';

  filteredNotes.forEach((note) => {
    const noteCard = document.createElement('note-card');
    noteCard.setAttribute('note-id', note.id);
    noteCard.setAttribute('note-title', note.title);
    noteCard.setAttribute('note-body', note.body);
    noteCard.setAttribute('note-date', note.createdAt);
    noteCard.setAttribute('show-actions', 'true');
    noteCard.setAttribute('archived', note.archived ? 'true' : 'false');

    notesContainer.appendChild(noteCard);
  });
}

function initializeViewToggle() {
  const notesSection = document.querySelector('.notes-section');
  const notesTitle = notesSection.querySelector('h2');

  const viewToggle = document.createElement('div');
  viewToggle.className = 'view-toggle';
  viewToggle.innerHTML = `
        <button class="btn btn-secondary ${currentView === 'active' ? 'active' : ''}" data-view="active">
            Active Notes
        </button>
        <button class="btn btn-secondary ${currentView === 'archived' ? 'active' : ''}" data-view="archived">
            Archived Notes
        </button>
    `;

  notesTitle.insertAdjacentElement('afterend', viewToggle);

  viewToggle.addEventListener('click', (e) => {
    if (e.target.tagName === 'BUTTON') {
      const newView = e.target.getAttribute('data-view');
      if (newView !== currentView) {
        currentView = newView;
        viewToggle.querySelectorAll('button').forEach((btn) => {
          btn.classList.remove('active');
        });
        e.target.classList.add('active');

        const searchInput = document.getElementById('search-input');
        if (searchInput) {
          searchInput.value = '';
        }
        loadNotes();
      }
    }
  });
}

function showErrorMessage(message) {
  const notesSection = document.querySelector('.notes-section');
  const errorDiv = document.createElement('div');
  errorDiv.style.cssText =
    'color: #e53e3e; background: #fed7d7; padding: 15px; border-radius: 8px; margin: 20px 0; border: 1px solid #feb2b2; text-align: center;';
  errorDiv.textContent = message;

  notesSection.insertBefore(errorDiv, notesSection.firstChild);

  setTimeout(() => {
    errorDiv.remove();
  }, 5000);
}

window.addEventListener('noteCreated', () => {
  loadNotes();
});

window.addEventListener('noteDeleted', () => {
  loadNotes();
});

window.addEventListener('noteArchived', () => {
  loadNotes();
});

document.addEventListener('DOMContentLoaded', () => {
  initializeSearch();
  initializeViewToggle();

  loadNotes();
});
