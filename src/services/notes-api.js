class NotesAPI {
  constructor() {
    this.baseURL = 'https://notes-api.dicoding.dev/v2';
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (response.ok) {
        return {
          success: true,
          data: data.data,
          message: data.message,
        };
      } else {
        return {
          success: false,
          message: data.message || 'Request failed',
        };
      }
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Network error',
      };
    }
  }

  async getNotes() {
    return await this.request('/notes');
  }

  async getArchivedNotes() {
    return await this.request('/notes/archived');
  }

  async getNote(id) {
    return await this.request(`/notes/${id}`);
  }

  async createNote(noteData) {
    return await this.request('/notes', {
      method: 'POST',
      body: JSON.stringify(noteData),
    });
  }

  async deleteNote(id) {
    return await this.request(`/notes/${id}`, {
      method: 'DELETE',
    });
  }

  async archiveNote(id) {
    return await this.request(`/notes/${id}/archive`, {
      method: 'POST',
    });
  }

  async unarchiveNote(id) {
    return await this.request(`/notes/${id}/unarchive`, {
      method: 'POST',
    });
  }
}

//API Global
window.notesAPI = new NotesAPI();
