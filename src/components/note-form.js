class NoteForm extends HTMLElement {
  constructor() {
    super();
    this.isValid = {
      title: false,
      body: false,
    };
  }

  connectedCallback() {
    this.render();
    this.attachEventListeners();
  }

  render() {
    this.innerHTML = `
            <h3>Add New Note</h3>
            <div id="form-loading" class="form-loading" style="display: none;">
                Creating note...
            </div>
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

  async handleSubmit() {
    const titleInput = this.querySelector('#note-title');
    const bodyInput = this.querySelector('#note-body');

    const noteData = {
      title: titleInput.value.trim(),
      body: bodyInput.value.trim(),
    };

    this.setLoadingState(true);

    try {
      const result = await window.notesAPI.createNote(noteData);
      if (result.success) {
        titleInput.value = '';
        bodyInput.value = '';
        this.isValid = { title: false, body: false };
        this.updateSubmitButton();
        this.showSuccessMessage();
        // Trigger event to refresh notes list
        window.dispatchEvent(new CustomEvent('noteCreated'));
      } else {
        this.showErrorMessage(result.message || 'Failed to create note');
      }
    } catch (error) {
      this.showErrorMessage('Network error. Please try again.');
    } finally {
      this.setLoadingState(false);
    }
  }

  setLoadingState(isLoading) {
    const submitBtn = this.querySelector('#submit-btn');
    const formLoading = this.querySelector('#form-loading');
    const form = this.querySelector('#note-form');

    if (isLoading) {
      formLoading.style.display = 'block';
      form.style.opacity = '0.6';
      submitBtn.textContent = 'Creating...';
      submitBtn.disabled = true;
    } else {
      formLoading.style.display = 'none';
      form.style.opacity = '1';
      submitBtn.textContent = 'Add Note';
      this.updateSubmitButton();
    }
  }

  showSuccessMessage() {
    const form = this.querySelector('#note-form');
    const successMsg = document.createElement('div');
    successMsg.textContent = 'Note added successfully!';
    successMsg.style.cssText =
      'color: #38a169; background: #f0fff4; padding: 10px; border-radius: 6px; margin-bottom: 15px; border: 1px solid #c6f6d5;';
    form.insertBefore(successMsg, form.firstChild);
    setTimeout(() => {
      successMsg.remove();
    }, 3000);
  }

  showErrorMessage(message) {
    const form = this.querySelector('#note-form');
    const errorMsg = document.createElement('div');
    errorMsg.textContent = message;
    errorMsg.style.cssText =
      'color: #e53e3e; background: #fed7d7; padding: 10px; border-radius: 6px; margin-bottom: 15px; border: 1px solid #feb2b2;';
    form.insertBefore(errorMsg, form.firstChild);
    setTimeout(() => {
      errorMsg.remove();
    }, 5000);
  }
}

customElements.define('note-form', NoteForm);
