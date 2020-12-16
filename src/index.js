import { createInit } from './modules/create';
import { eventsInit } from './modules/eventHandlers'
import { interfaceInit } from './modules/interface'



const init = () => {
    createInit()
    interfaceInit()
    eventsInit();
}

init();
