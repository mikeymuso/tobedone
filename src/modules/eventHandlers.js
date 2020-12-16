import { elements, dueDateCalender, dueDateCalenderNew } from './elements';
import { getSelectedNote } from './read';
import { displayCurrentNote, updateNotesList, updateProjectsList, handleOverlay } from './interface';
import { updateElement } from './update';
import { createNote, createProject } from './create';
import { deleteElement, undoLastDelete } from './delete';

import moment from 'moment';

const formatDateTime = (rawDate) => {
    return moment(rawDate).format('DD/MM/YYYY HH:mm')
}

const fadeInTextAnimation = () => {   
    const addMouseEnter = (btnEle, textEle, opacity, x, y) => {
        btnEle.addEventListener('mouseenter', () => {
            textEle.style.opacity = opacity;
            textEle.style.transform = `translate(${x}px, ${y}px)`
        })
    }

    const addMouseLeave = (btnEle, textEle, opacity, x, y) => {
        btnEle.addEventListener('mouseleave', () => {
            textEle.style.opacity = opacity;
            textEle.style.transform = `translate(${x}px, ${y}px)`
        })
    }

    const addNewBtnAnimation = () => {
        const newBtns = [elements.addNewProjectBtn, elements.addNewNoteBtn];
        const hiddenText = [elements.addNewProjectHiddenText, elements.addNewNoteHiddenText];

        newBtns.forEach((btn, i) => {
            addMouseEnter(btn, hiddenText[i], 1, 42, 10);
            addMouseLeave(btn, hiddenText[i], 0, -42, 10);
        })
    }

    const addSaveBtnAnimation = () => {
        const saveBtns = [elements.newNoteSaveBtn, elements.newProjectSaveBtn];
        const hiddenText = [elements.newNoteSaveHiddenText, elements.newProjectSaveHiddenText];

        saveBtns.forEach((btn, i) => {
            addMouseEnter(btn, hiddenText[i], 1, -42, 10);
            addMouseLeave(btn, hiddenText[i], 0, 42, 10);
        })
    }

    addNewBtnAnimation();
    addSaveBtnAnimation();
}

const listListener = () => {
    const highlightListItem = (type, id, fullId) => {
        const allItems = document.querySelectorAll(`.${type}`)
        allItems.forEach(item => item.classList.remove('active'));        
        document.getElementById(fullId).classList.add('active');
    }

    const callListItem = (fullId) => {
        const [type, id] = fullId.split('-');
        highlightListItem(type, id, fullId);
        if (type === 'note') displayCurrentNote(getSelectedNote(id));
        if (type ==='project') updateNotesList(id);
    } 

    elements.notesList.addEventListener('click', (e) => {
        const fullId = e.target.closest('li').id;
        callListItem(fullId);
    })

    elements.projectsList.addEventListener('click', (e) => {
        const fullId = e.target.closest('li').id;
        callListItem(fullId);
    })
}

const updateNoteListener = () => {
    elements.editWindowPane.addEventListener('focusout', (event) => {
        updateNote(event);
    })
}

const updateNote = (event) => {
    const [_, attr, type, id] = event.target.id.split('-');
    const value = event.target.value;

    if (attr == 'dueDate') return; // Skip the dueDate field - handled seperately with flatPickr
    
    updateElement(`${type}-${id}`, attr, value);
    updateElement(`${type}-${id}`, 'lastUpdate', moment()); // set latest update

    updateLastUpdateText(getSelectedNote(id)); // display latest update
    updateNotesList(getSelectedNote(id).projectParent, id);
}

const dueDateListener = () => {
    dueDateCalender.config.onChange.push((selectedDates, str, element) => {
        const [_, attr, type, id] = element.element.id.split('-');
        updateElement(`${type}-${id}`, attr, selectedDates[0]);
        updateElement(`${type}-${id}`, 'lastUpdate', moment()); // set latest update
        updateLastUpdateText(getSelectedNote(id)); // display latest update
        updateNotesList(getSelectedNote(id).projectParent, id);
    })
}

const updateLastUpdateText = (note) => {
    elements.editLastUpdate.innerHTML = `Last saved: <span id="edit-last-span">${formatDateTime(note.lastUpdate)}</span>`;
}

const priorityDropdown = () => {
    const hideOverlayOnBlur = (e) => {
        const target = e.target.closest('div');
        const targetParent = e.target.closest('div').parentNode;
        const checkElement = (ele) => {
            return ele.classList.contains('priority-element')
        }

        if (!(checkElement(target) || checkElement(targetParent))) {
            elements.priorityOverlay.remove(); 
            window.removeEventListener('click', hideOverlayOnBlur, false);
        }
    }

    const selectPriority = (editOrNew) => {
        elements.priorityOverlay.addEventListener('click', (event) => {
            const [_, attr, value, type, id] = event.target.closest('div').id.split('-');

            if (editOrNew === 'edit') {    
                updateElement(`${type}-${id}`, attr, value);
                updateLastUpdateText(getSelectedNote(id));
                updateNotesList(getSelectedNote(id).projectParent, id);
                displayCurrentNote(getSelectedNote(id));
            } else if (editOrNew === 'new') {
                elements.newNotePriority.dataset.priority = value;
                elements.newNotePriorityImg.src = `images/priority-${value}.svg`;                                                  
            }

        elements.priorityOverlay.remove();
        window.removeEventListener('click', hideOverlayOnBlur, false);
        })
    }

    const createOverlay = (event, type) => {

        window.addEventListener('click', hideOverlayOnBlur) // Listen for blur

        const addIds = (id) => {
            elements.priorityOneSelect.id = `edit-priority-1-note-${id}`
            elements.priorityTwoSelect.id = `edit-priority-2-note-${id}`
            elements.priorityThreeSelect.id = `edit-priority-3-note-${id}`
        }

        const addImgs = () => {
            elements.priorityOneSelect.innerHTML = `<img src="images/priority-1.svg"><p>High</p>`
            elements.priorityTwoSelect.innerHTML = `<img src="images/priority-2.svg"><p>Medium</p>`
            elements.priorityThreeSelect.innerHTML = `<img src="images/priority-3.svg"><p>Low</p>`
        }

        const appendElements = (dest, source) => {
            source.forEach(ele => dest.append(ele))
        }

        const addPriorityClass = (elements) => {
            elements.forEach(ele => ele.classList.add('priority-element'));
        }

        const id = event.target.closest('div').id.split('-')[3] || -1;

        addIds(id);
        addImgs();
        appendElements(elements.priorityOverlay, [
            elements.priorityOneSelect, 
            elements.priorityTwoSelect, 
            elements.priorityThreeSelect
        ]);

        if (type === 'edit') {
            appendElements(elements.editWindow, [elements.priorityOverlay])
            addPriorityClass([elements.editPriority, elements.priorityOverlay])
            selectPriority('edit');
        } else if (type === 'new') {
            appendElements(elements.newNoteOverlay, [elements.priorityOverlay])
            addPriorityClass([elements.newNotePriority, elements.priorityOverlay])
            selectPriority('new');
        }
    }
        
    elements.editPriority.addEventListener('click', (event) => createOverlay(event, 'edit'));
    elements.newNotePriority.addEventListener('click', (event) => createOverlay(event, 'new'));

}

const newNoteListener = () => {
    elements.addNewNoteBtn.addEventListener('click', () => {
        handleOverlay(true, 'note');
            
        const closeOnBlur = (e) => { 
            const childrenArr = [...elements.newNoteOverlay.querySelectorAll('*')];
            const buttonArr = [...elements.addNewNoteBtn.querySelectorAll('*')];
            const priorityArr = [...elements.priorityOverlay.querySelectorAll('*')];

            if (!buttonArr.includes(e.target) && !childrenArr.includes(e.target) &&!priorityArr.includes(e.target)) {;
                handleOverlay(false, 'note');
                window.removeEventListener('click', closeOnBlur);
            }        
        }

        window.addEventListener('click', closeOnBlur);
    });
}

const newProjectListener = () => {
    elements.addNewProjectBtn.addEventListener('click', () => {
        handleOverlay(true, 'project');
            
        const closeOnBlur = (e) => { 
            const childrenArr = [...elements.newProjectOverlay.querySelectorAll('*')];
            const buttonArr = [...elements.addNewProjectBtn.querySelectorAll('*')];

            if (!buttonArr.includes(e.target) && !childrenArr.includes(e.target)) {;
                handleOverlay(false, 'project');
                window.removeEventListener('click', closeOnBlur);
            }        
        }

        window.addEventListener('click', closeOnBlur);
    });
}

const saveNoteListener = () => {
    elements.newNoteSaveBtn.addEventListener('click', () => {
        const title = elements.newNoteTitle.value;
        const dueDate = dueDateCalenderNew.selectedDates[0]; // THIS IS RETURNING A STRING NON-ISO FORMAT
        const priority = elements.newNotePriority.dataset.priority;
        const notes = elements.newNoteNotesInput.value;
        const projectParent = elements.newNoteProjectSelect.value;

        if (!title) {
            elements.newNoteAlert.innerHTML = `Please enter a title`;
            elements.newNoteBtmSection.append(elements.newNoteAlert);
            return;
        }

        createNote(title, dueDate, priority, notes, projectParent);
        handleOverlay(false, 'note');
        updateNotesList(projectParent);
    })
}

const saveProjectListener = () => {
    elements.newProjectSaveBtn.addEventListener('click', () => {
        const title = elements.newProjectTitle.value;

        console.log(title);
              
        if (!title) {
            elements.newProjectAlert.innerHTML = `Please enter a title`;
            elements.newProjectBtmSection.append(elements.newProjectAlert);
            return;
        }

        createProject(title);
        handleOverlay(false, 'project');
        updateProjectsList();
    })
}

const mainCompleteCheckbox = () => {
    const updateNoteComplete = () => {
        const data = elements.mainCheckbox.dataset.checked;

        if (data) {
            const [id, value] = data.split('-');
            const boolValue = (value === 'true');
            updateElement(`note-${id}`, 'complete', !boolValue);
            updateNotesList(getSelectedNote(id).projectParent, id);
            displayCurrentNote(getSelectedNote(id));
        }
    }

    elements.mainCheckbox.addEventListener('click', updateNoteComplete);
}

const mainDeleteButton = () => {
    const deleteNote = (event) => {
        const elementID = event.target.dataset.id
        if (elementID) {
            const currNoteProject = getSelectedNote(elementID.split('-')[1]).projectParent;
            deleteElement(event.target.dataset.id);
            updateNotesList(currNoteProject);
        }
    }

    elements.mainDelete.addEventListener('click', deleteNote)
}

const deleteProjectButtons = () => {
    elements.projectsList.addEventListener('click', e => {
        const buttonDiv = e.target.closest('div');
        if (buttonDiv.classList.contains('delete-project-btn')) {
            const [_, type, id] = buttonDiv.id.split('-');
            deleteElement(`${type}-${id}`);  
            updateProjectsList();
        };    
    })
}

const eventsInit = () => {
    updateNoteListener();
    fadeInTextAnimation();
    listListener();
    dueDateListener();
    priorityDropdown();
    newNoteListener();
    newProjectListener();
    saveNoteListener();
    saveProjectListener();
    mainCompleteCheckbox();
    mainDeleteButton();
    deleteProjectButtons();
}

export { eventsInit }