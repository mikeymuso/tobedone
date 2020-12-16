import { getStoredLists, storeData } from './storage.js';
import moment from 'moment';

const allProjects = getStoredLists().allProjects;
const allNotes = getStoredLists().allNotes;

const addDefaultProject = () => {
    if (allProjects.length === 0) {
        pushData(project, allProjects, ['First Project', moment(), moment()])
        storeData('allProjects', allProjects);
    }
}

////////////////////////////////////
// Test notes - for debug only
const addTestProjects = () => {
    if (allNotes.length === 0) {
        const exampleNotes = [
            ['Clean Car', '2020-12-16T12:00:00.797Z', 1, 'Use soap and water', 1],
            ['Walk the dog', '2020-12-14T12:00:00.797Z', 3, 'Training walk', 1],
            ['Do the dishes', '2020-12-13T12:00:00.797Z', 2, 'Before the wife gets home', 1],
        ]
        for (let n of exampleNotes) {
            pushData(note, allNotes, n)
        }
        
        storeData('allNotes', allNotes);
    }
}
// End of debug section
////////////////////////////////////


const note = function (title, dueDate, priority, notes, projectParent) {
    this.id = allNotes.length + 1;
    this.title = title;
    this.publishDate = moment()
    this.dueDate = dueDate;
    this.priority = priority;
    this.notes = notes;
    this.projectParent = projectParent;
    this.type = 'note';
    this.lastUpdate = moment();
    this.complete = false;
}

const project = function (title, publishDate, lastUpdate) {
    this.id = allProjects.length + 1;
    this.title = title;
    this.publishDate = moment();
    this.lastUpdate = moment();
    this.type = 'project';
}

const pushData = (type, dest, data) => {
    dest.push(new type(...data));
}

const createNote = (title, dueDate, priority, notes, projectParent) => {
    pushData(note, allNotes, [title, dueDate, priority, notes, projectParent])
    storeData('allNotes', allNotes);
    getStoredLists();
}

const createProject = (title) => {
    pushData(project, allProjects, [title])
    storeData('allProjects', allProjects);
    getStoredLists();
}

const createInit = () => {
    addDefaultProject();

    //////////////////////////////////////
    // For debugging only
    addTestProjects();
    // End of debug
    //////////////////////////////////////

}


export { createNote, createProject, createInit }