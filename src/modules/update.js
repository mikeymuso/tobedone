import { getStoredLists, storeData } from './storage.js';
import moment from 'moment';

const updateElement = (fullId, attr, value) => {
    const [type, id] = fullId.split('-');
    if (type === 'note') updateNote(id, attr, value);
    if (type === 'project') updateProject(id, attr, value);
}

const updateAttr = (array, id, attr, value) => {
    array.forEach(ele => {
        if (ele.id == id) {
            ele[attr] = value;
            ele.lastUpdate = moment();
        }
    })
}

const updateNote = (id, attr, value) => {
    const allNotes = getStoredLists().allNotes;

    updateAttr(allNotes, id, attr, value)
    storeData('allNotes', allNotes)
}

const updateProject = (id, attr, value) => {
    const allProjects = getStoredLists().allProjects;

    updateAttr(allProjects, id, attr, value)
    storeData('allProjects', allProjects)
}

const handleDateChange = (selectedDate) => {
    console.log(...selectedDate);
    // deal with updating dueDate
}

export { updateElement, handleDateChange };

