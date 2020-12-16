import { getStoredLists } from './storage.js';
import moment from 'moment'

const formatDateTime = (rawDate) => {
    return moment(rawDate).format('DD/MM/YYYY HH:mm');
}

const formatDate = (rawDate) => {
    return moment(rawDate).format('DD/MM/YYYY');
}

const createProjectsList = () => {
    let HTML = '<ul>';
    for (let p of getStoredLists().allProjects) {
        HTML += `<li id="project-${p.id}" class="project">`;
        HTML += `<h3 class="project-title">${p.title}</h3>`;
        HTML += `<p class="project-date">Created: ${formatDate(p.lastUpdate)}</p>`;
        HTML += `<div id="delete-project-${p.id}" class="delete-project-btn"><img src="images/bin-dark.svg"></div>`;
        HTML += `</li>`;
    }    
    HTML += `</ul>`;
    return HTML;
}

const createNotesList = (projectID) => {
    let HTML = '<ul>';
    const notesArr = filterByProject(projectID) || 1;
    
    for (let n of notesArr) {
        HTML += `<li id="note-${n.id}" class="note">`;
        HTML += `<h3 class="note-title">${n.title}</h3>`;
        HTML += `<p class="note-due-date">Complete by: ${formatDateTime(n.dueDate)}</p>`;
        HTML += `<div class="note-completed"><img src="images/checkbox-${n.complete}.svg"></div>`;
        HTML += `<img class="note-priority" src="images/priority-${n.priority}.svg"`;
        HTML += `</li>`;
    }    
    HTML += `</ul>`;
    return HTML;
}

const getSelectedNote = (id) => {
    let currentNote;
    getStoredLists().allNotes.forEach(note => {
        if (note.id == id) currentNote = note;
    })
    return currentNote;
}

const filterByProject = (projectID) => {
    let filteredNotes = [];

    getStoredLists().allNotes.forEach(note => {
        if (note.projectParent == projectID) {
            filteredNotes.push(note)
        }
    })

    return filteredNotes;
}

const getProjectSelectOptions = () => {
    const allProjects = getStoredLists().allProjects;
    let HTML = '';
    allProjects.forEach(project => {
        HTML += `<option value="${project.id}">${project.title}</option>`
    })
    return HTML;
}

export { createNotesList, createProjectsList, getSelectedNote, getProjectSelectOptions, filterByProject }

