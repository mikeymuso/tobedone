import flatpickr from "flatpickr";

const createElementID = (ele, id) => {
    const element = document.createElement(ele);
    if (id) element.id = id;
    return element;
}

const createElementClass = (ele, className) => {
    const element = document.createElement(ele);
    if (className) element.classList.add(className);
    if (ele === 'input') element.setAttribute('type', 'text');
    return element;
}

const elements = {
    /////////////////////////////////////////////
    // CONTAINER ELEMENTS
    mainContent: document.getElementById('content'),
    mainInterface: createElementID('div', 'interface-container'),
    header: createElementID('header', 'header'),
        
    /////////////////////////////////////////////
    // LISTS
    notesContainer: createElementID('div', 'notes-container'),
    noteControls: createElementID('div', 'note-controls'),
    notesList: createElementID('div', 'notes-list'),

    projectContainer: createElementID('div', 'project-container'),
    projectControls: createElementID('div', 'project-controls'),
    projectsList: createElementID('div', 'projects-list'),

    /////////////////////////////////////////////
    // NOTE/PROJECT BUTTONS
    addNewProjectBtn: createElementID('div', 'new-project-btn'),
    addNewNoteBtn: createElementID('div', 'new-note-btn'),
    addNewProjectHiddenText: createElementID('div', 'new-project-text-hidden'),
    addNewNoteHiddenText: createElementID('div', 'new-note-text-hidden'),


    /////////////////////////////////////////////
    // EDIT WINDOW
    mainCheckbox: createElementID('img', 'main-checkbox'),
    mainDelete: createElementID('img', 'main-delete'),

    editWindow: createElementID('div', 'edit-window'),
    editWindowControls: createElementID('div', 'edit-window-controls'),
    editWindowPane: createElementID('div', 'edit-pane'),
    editLastUpdate: createElementID('div', 'edit-last-update'),
    editTitle: createElementClass('input', 'edit-title'),
    editPriority: createElementClass('div', 'edit-priority'),
    editPriorityText: createElementID('p', 'priority-label'),
    editPriorityImg: createElementClass('img', 'priority-img'),
    editDateCreated: createElementClass('p', 'edit-date-created'),
    editDueDate: createElementClass('div', 'edit-due-date'),
    editDueDateInput: createElementClass('input', 'edit-due-date-input'),
    editNotes: createElementClass('div', 'edit-notes'),
    editNotesInput: createElementClass('textarea', 'edit-notes-textarea'),

    /////////////////////////////////////////////
    // PRIORITY SELECT POPOVER
    priorityOverlay: createElementID('div', 'priority-overlay'),
    priorityOneSelect: createElementClass('div', 'priority-1'),
    priorityTwoSelect: createElementClass('div', 'priority-2'),
    priorityThreeSelect: createElementClass('div', 'priority-3'),

    /////////////////////////////////////////////
    // NEW NOTE POPOVER
    newNoteOverlay: createElementID('div', 'new-note-overlay'),
    newNoteHeader: createElementID('div', 'new-note-header'),
    newNoteTopSection: createElementID('div', 'new-note-top'),
    newNoteMidSection: createElementID('div', 'new-note-mid'),
    newNoteBtmSection: createElementID('div', 'new-note-btm'),

    newNoteTitle: createElementID('input', 'new-note-title'),
    newNoteDueDate: createElementID('div', 'new-note-dueDate'),
    newNoteDueDateInput: createElementID('input', 'new-note-dueDate-input'),
    newNotePriority: createElementID('div', 'new-note-priority'),
    newNotePriorityText: createElementID('p', 'priority-label'),
    newNotePriorityImg: createElementClass('img', 'priority-img'),
    newNoteProject: createElementID('div', 'new-note-project'),
    newNoteProjectSelect: createElementID('select', 'new-note-poject-select'),
    newNoteNotesInput: createElementClass('textarea', 'new-note-textarea'),
    newNoteSaveBtn: createElementID('div', 'save-note-btn'),
    newNoteSaveHiddenText: createElementID('div', 'save-note-text-hidden'),
    newNoteAlert: createElementID('p', 'new-note-alert'),

    /////////////////////////////////////////////
    // NEW PROJECT POPOVER
    newProjectOverlay: createElementID('div', 'new-project-overlay'),
    newProjectHeader: createElementID('div', 'new-project-header'),
    newProjectTopSection: createElementID('div', 'new-project-top'),
    newProjectBtmSection: createElementID('div', 'new-project-btm'),

    newProjectTitle: createElementID('input', 'new-project-title'),
    newProjectSaveBtn: createElementID('div', 'save-project-btn'),
    newProjectSaveHiddenText: createElementID('div', 'save-project-text-hidden'),
    newProjectAlert: createElementID('p', 'new-project-alert'),
}


// Add flatpickr 
const dueDateCalender = flatpickr(elements.editDueDateInput, {  
    enableTime: true, 
    dateFormat: "d/m/Y h:i",
});

const dueDateCalenderNew = flatpickr(elements.newNoteDueDateInput, {  
    enableTime: true, 
    dateFormat: "d/m/Y h:i",
    defaultDate: new Date(),
});

export { elements, dueDateCalender, dueDateCalenderNew }