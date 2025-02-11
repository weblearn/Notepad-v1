// Get DOM elements
const noteTitle = document.getElementById('noteTitle');
const noteContent = document.getElementById('noteContent');
const noteImage = document.getElementById('noteImage');
const imagePreview = document.getElementById('imagePreview');
const addNoteBtn = document.getElementById('addNote');
const updateNoteBtn = document.getElementById('updateNote');
const notesContainer = document.getElementById('notesContainer');

// Store notes in localStorage
let notes = JSON.parse(localStorage.getItem('notes')) || [];
let editingIndex = -1;
let currentImageData = null;

// Function to handle image preview
noteImage.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            currentImageData = e.target.result;
            imagePreview.innerHTML = `<img src="${currentImageData}" alt="Preview">`;
        };
        reader.readAsDataURL(file);
    }
});

// Function to save notes to localStorage
function saveNotes() {
    localStorage.setItem('notes', JSON.stringify(notes));
}

// Function to render notes
function renderNotes() {
    notesContainer.innerHTML = '';
    notes.forEach((note, index) => {
        const noteElement = document.createElement('div');
        noteElement.className = 'note-card';
        noteElement.innerHTML = `
            ${note.image ? `<img src="${note.image}" alt="Note image">` : ''}
            <div class="note-content">
                <h3>${note.title}</h3>
                <p>${note.content}</p>
            </div>
            <div class="note-actions">
                <button class="edit-btn" onclick="editNote(${index})">Edit</button>
                <button class="delete-btn" onclick="deleteNote(${index})">Delete</button>
            </div>
        `;
        notesContainer.appendChild(noteElement);
    });
}

// Function to add a new note
function addNote() {
    const title = noteTitle.value.trim();
    const content = noteContent.value.trim();
    
    if (title && content) {
        notes.push({ 
            title, 
            content,
            image: currentImageData
        });
        saveNotes();
        renderNotes();
        clearForm();
    } else {
        showToast('Please fill in both title and content!');
    }
}

// Function to edit a note
function editNote(index) {
    const note = notes[index];
    noteTitle.value = note.title;
    noteContent.value = note.content;
    if (note.image) {
        currentImageData = note.image;
        imagePreview.innerHTML = `<img src="${note.image}" alt="Preview">`;
    } else {
        currentImageData = null;
        imagePreview.innerHTML = '';
    }
    editingIndex = index;
    addNoteBtn.style.display = 'none';
    updateNoteBtn.style.display = 'block';
}

// Function to update a note
function updateNote() {
    const title = noteTitle.value.trim();
    const content = noteContent.value.trim();
    
    if (title && content) {
        notes[editingIndex] = {
            title,
            content,
            image: currentImageData
        };
        saveNotes();
        renderNotes();
        clearForm();
        addNoteBtn.style.display = 'block';
        updateNoteBtn.style.display = 'none';
        editingIndex = -1;
    } else {
        showToast('Please fill in both title and content!');
    }
}

// Function to delete a note
function deleteNote(index) {
    if (confirm('Are you sure you want to delete this note?')) {
        notes.splice(index, 1);
        saveNotes();
        renderNotes();
        
        if (editingIndex === index) {
            clearForm();
            addNoteBtn.style.display = 'block';
            updateNoteBtn.style.display = 'none';
            editingIndex = -1;
        }
    }
}

// Function to clear the form
function clearForm() {
    noteTitle.value = '';
    noteContent.value = '';
    noteImage.value = '';
    imagePreview.innerHTML = '';
    currentImageData = null;
}

// Function to show toast
function showToast(message) {
    // Create toast element if it doesn't exist
    let toast = document.querySelector('.toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.className = 'toast';
        document.body.appendChild(toast);
    }
    
    // Set message and show toast
    toast.textContent = message;
    toast.classList.add('show');
    
    // Hide toast after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Event listeners
addNoteBtn.addEventListener('click', addNote);
updateNoteBtn.addEventListener('click', updateNote);

// Initial render
renderNotes();
