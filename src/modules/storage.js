const getStoredLists = () => {
    const allProjects = JSON.parse(localStorage.getItem('allProjects')) || [];
    const allNotes = JSON.parse(localStorage.getItem('allNotes')) || [];
    const recycleBin = JSON.parse(localStorage.getItem('recycleBin')) || [];

    return { allProjects, allNotes, recycleBin }
}

const storeData = (name, data) => {
    localStorage.setItem(name, JSON.stringify(data));
}

export { getStoredLists, storeData };