import { createNotesList, createProjectsList, getProjectSelectOptions, filterByProject } from './read';
import { elements, dueDateCalender } from './elements';
import moment from 'moment';

const formatDateTime = (rawDate) => {
    return moment(rawDate).format('DD/MM/YYYY HH:mm')
}

const addInterface = () => {
   elements.mainContent.append(elements.mainInterface); 
   elements.mainContent.prepend(elements.header)

   elements.header.innerHTML = `<h1>toBeDone</h1>`
}

const displayProjects = () => {
    elements.projectsList.innerHTML = createProjectsList();
    elements.mainInterface.append(elements.projectContainer);
    elements.projectContainer.append(elements.projectsList);

    const highlightFirstProject = (() => {
        elements.projectsList.querySelector('li').classList.add('active');
    })()
}

const displayNotes = () => {
    elements.notesList.innerHTML = createNotesList(1);
    elements.mainInterface.append(elements.notesContainer);
    elements.notesContainer.append(elements.notesList);
}

const updateNotesList = (projectID, activeNote) => {    
    elements.notesList.innerHTML = createNotesList(projectID);
    
    const maintainActiveState = () => {
        const active = elements.notesList.querySelector(`#note-${activeNote}`);
        if (active) active.classList.add('active');
    }

    maintainActiveState();
}

const updateProjectsList = () => {
    elements.projectsList.innerHTML = createProjectsList();
}

const displayCtrls = () => {
    elements.addNewProjectHiddenText.innerHTML = `New project`;
    elements.addNewNoteHiddenText.innerHTML = `New note`;
    elements.addNewProjectBtn.innerHTML = `<img src="images/add-active.svg">`;
    elements.addNewNoteBtn.innerHTML = `<img src="images/add-active.svg">`;

    elements.projectControls.append(elements.addNewProjectHiddenText, elements.addNewProjectBtn);
    elements.noteControls.append(elements.addNewNoteHiddenText, elements.addNewNoteBtn);
    
    elements.projectContainer.prepend(elements.projectControls);
    elements.notesContainer.prepend(elements.noteControls);
}

const addEditWindow = () => {
    const controls = [elements.mainCheckbox, elements.mainDelete]

    const addBtns = (controls) => {
        controls.forEach(ctrl => elements.editWindowControls.append(ctrl));
    }

    const addImgSrc = () => {
        elements.mainCheckbox.src = `images/checkbox-false.svg`; 
        elements.mainDelete.src = `images/bin-dark.svg`;
    }

    const addEditPane = () => {
        elements.editWindow.prepend(elements.editWindowControls);
        elements.mainInterface.append(elements.editWindow);
        elements.editWindow.append(elements.editWindowPane);
    }

    addBtns(controls);
    addImgSrc();
    addEditPane();
}

const displayCurrentNote = (note) => {
    const addToEditPane = (ele) => {
        elements.editWindowPane.append(ele);
    }

    const addTitle = () => {
        elements.editTitle.id = `edit-title-note-${note.id}`;
        elements.editTitle.value = note.title;
        addToEditPane(elements.editTitle);
    }

    const addPriority = () => {
        elements.editPriorityText.innerHTML = `Priority`;
        elements.editPriority.id = `edit-priority-note-${note.id}`;
        elements.editPriorityImg.src = `images/priority-${note.priority}.svg`;
        elements.editPriority.append(elements.editPriorityText, elements.editPriorityImg);
        addToEditPane(elements.editPriority);
    }

    const addDateCreated = () => {
        elements.editDateCreated.innerHTML = `Created: ${formatDateTime(note.publishDate)}`;
        addToEditPane(elements.editDateCreated);
    }

    const addDueDate = () => {
        elements.editDueDateInput.id = `edit-dueDate-note-${note.id}`;
        elements.editDueDateInput.value = `${formatDateTime(note.dueDate)}`;
        dueDateCalender.setDate(note.dueDate); // Set the flatpickr date to current value
        elements.editDueDate.innerHTML = `<p>Complete by: </p>`;
        elements.editDueDate.append(elements.editDueDateInput);
        addToEditPane(elements.editDueDate)
    }

    const addNotes = () => {
        elements.editNotesInput.id = `edit-notes-note-${note.id}`;
        elements.editNotesInput.value = `${note.notes}`;
        elements.editNotes.append(elements.editNotesInput);
        addToEditPane(elements.editNotes);
    }

    const addLastUpdate = () => {
        elements.editLastUpdate.innerHTML = `Last saved: <span id="edit-last-span">${formatDateTime(note.lastUpdate)}</span>`;
        elements.editWindow.append(elements.editLastUpdate);
    }

    const updateCompleteBtn = () => {
        elements.mainCheckbox.src = `images/checkbox-${note.complete}.svg`;
        elements.mainCheckbox.dataset.checked = `${note.id}-${note.complete}`;
    }

    const updateDeleteBtn = () => {
        elements.mainDelete.dataset.id = `note-${note.id}`;
    }

    addTitle();
    addPriority();
    addDateCreated();
    addDueDate();
    addNotes();
    addLastUpdate();
    updateCompleteBtn();
    updateDeleteBtn();
}

const setBlur = (on) => {
    if (on) {
        elements.mainInterface.style.filter = 'blur(3px)'; // blur the background
        elements.header.style.filter = 'blur(3px)'; // blur the background
    }

    if (!on) {
        elements.mainInterface.style.filter = 'blur(0)'; // blur the background
        elements.header.style.filter = 'blur(0)'; // blur the background
    }
}

const displayNewNoteOverlay = () => {
    elements.mainContent.append(elements.newNoteOverlay);
    setBlur(true);

    const addHeader = () => {
        elements.newNoteHeader.innerHTML = `New note`;
    }
    
    const addTopSection = () => {
        const setProjectSelection = () => {
            const activeProject = elements.projectsList.querySelector('.active');
            
            if (activeProject) {
                const projectID = activeProject.id.split('-')[1];
                const options = elements.newNoteProjectSelect.querySelectorAll('option');
                options.forEach(option => {
                    if (option.value === projectID) option.selected = true;
                })
            } 
        }

        elements.newNoteTitle.placeholder = 'Title';
        elements.newNoteTitle.value = '';
    
        elements.newNoteDueDate.innerHTML = `<p>Complete by: </p>`;
        elements.newNoteDueDate.append(elements.newNoteDueDateInput);
        
        elements.newNoteProject.innerHTML = `<p>Project: </p>`;
        elements.newNoteProjectSelect.innerHTML = getProjectSelectOptions();
        setProjectSelection();
        elements.newNoteProject.append(elements.newNoteProjectSelect);
    
        elements.newNotePriorityText.innerHTML = `Priority`;
        elements.newNotePriorityImg.src = `images/priority-1.svg`;
        elements.newNotePriority.append(elements.newNotePriorityText, elements.newNotePriorityImg);
    
        elements.newNotePriority.dataset.priority = 1;
    
        elements.newNoteTopSection.append(
            elements.newNoteTitle, 
            elements.newNoteDueDate, 
            elements.newNoteProject, 
            elements.newNotePriority)
    }
    
    const addMiddleSection = () => {
        elements.newNoteNotesInput.placeholder = `Notes`;
        elements.newNoteNotesInput.value = '';
        elements.newNoteMidSection.append(elements.newNoteNotesInput)
    }

    const addBottomSection = () => {
        elements.newNoteSaveHiddenText.innerHTML = `Save note`;
        elements.newNoteSaveBtn.innerHTML = `<img src="images/add-active.svg">`;
        elements.newNoteBtmSection.append(elements.newNoteSaveBtn, elements.newNoteSaveHiddenText);
    }    

    const addAllElements = () => {
        elements.newNoteOverlay.append(
            elements.newNoteHeader, 
            elements.newNoteTopSection, 
            elements.newNoteMidSection, 
            elements.newNoteBtmSection); 
    }

    addHeader();
    addTopSection();
    addMiddleSection();
    addBottomSection();
    addAllElements();
}

const closeOverlay = (type) => {
    if (type === 'note') elements.newNoteOverlay.remove();
    if (type === 'project') elements.newProjectOverlay.remove();
}

const handleOverlay = (show, type) => {
    if (show) {
        if (type === 'note') displayNewNoteOverlay();
        if (type === 'project') displayNewProjectOverlay();
        setBlur(true);
    }

    if(!show) {
        closeOverlay(type);
        setBlur(false);
    }
}

const displayNewProjectOverlay = () => {
    elements.mainContent.append(elements.newProjectOverlay);
    setBlur(true);

    const addHeader = () => {
        elements.newProjectHeader.innerHTML = `New project`;
    }
    
    const addTopSection = () => {
        elements.newProjectTitle.placeholder = 'Title';
        elements.newProjectTitle.value = '';
        elements.newProjectTopSection.append(elements.newProjectTitle)
    }
    

    const addBottomSection = () => {
        elements.newProjectSaveHiddenText.innerHTML = `Save project`;
        elements.newProjectSaveBtn.innerHTML = `<img src="images/add-active.svg">`;
        elements.newProjectBtmSection.append(elements.newProjectSaveBtn, elements.newProjectSaveHiddenText);
    }    

    const addAllElements = () => {
        elements.newProjectOverlay.append(
            elements.newProjectHeader, 
            elements.newProjectTopSection, 
            elements.newProjectBtmSection); 
    }

    addHeader();
    addTopSection();
    addBottomSection();
    addAllElements();
}



const interfaceInit = () => {
    addInterface();
    displayProjects();
    displayNotes();
    displayCtrls();
    addEditWindow();
}

export { interfaceInit, displayCurrentNote, updateNotesList, updateProjectsList, handleOverlay }