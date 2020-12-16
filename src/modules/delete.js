import { getStoredLists, storeData } from './storage.js';

const deleteElement = (id) => {
    const [type, i] = id.split('-');
    if (type === 'note') deleteNote(i);
    if (type === 'project') deleteProject(i);
}

const pushToRecycle = (obj) => {
    const recycleBin = getStoredLists().recycleBin;

    recycleBin.push(obj);
    storeData('recycleBin', recycleBin);
}

const deleteFromArr = (arr, ele) => {
    arr.splice(arr.indexOf(ele), 1);
}

const deleteNote = (id) => {
    const allNotes = getStoredLists().allNotes;

    allNotes.forEach(note => {
        if (note.id == id) {
            pushToRecycle(note)
            deleteFromArr(allNotes, note)
            storeData('allNotes', allNotes);
        }
    })
}

const deleteProject = (id) => {
    const allProjects = getStoredLists().allProjects;

    allProjects.forEach(project => {
        if (project.id == id) {
            pushToRecycle(project)
            deleteFromArr(allProjects, project)            
            storeData('allProjects', allProjects);
        }
    })
}


const undoLastDelete = () => {
    const allNotes = getStoredLists().allNotes;
    const allProjects = getStoredLists().allProjects;
    const recycleBin = getStoredLists().recycleBin;

    const lastItem = recycleBin.pop();
    const pushToArr = (arr) => arr.push(lastItem);

    if (lastItem.type === 'note') {
        pushToArr(allNotes);
        storeData('allNotes', allNotes)
    } 

    if (lastItem.type === 'project') {
        pushToArr(allProjects)
        storeData('allNotes', allNotes)
    }
}

export { deleteElement, undoLastDelete }