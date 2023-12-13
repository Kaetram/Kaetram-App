import { randomBytes } from 'node:crypto';
import { EventEmitter } from 'node:events';

////////////////////////////////////////////////////////
// eslint-disable-next-line @typescript-eslint/no-var-requires
import plugins from './electron-plugins';

import { ipcRenderer, contextBridge } from 'electron';

const randomId = (length = 5) => randomBytes(length).toString('hex'),
    contextApi: {
        [plugin: string]: { [functionName: string]: () => Promise<any> };
    } = {};

for (let pluginKey of Object.keys(plugins))
    for (let classKey of Object.keys(plugins[pluginKey]).filter(
        (className) => className !== 'default'
    )) {
        let functionList = Object.getOwnPropertyNames(
            plugins[pluginKey][classKey].prototype
        ).filter((v) => v !== 'constructor');

        if (!contextApi[classKey]) contextApi[classKey] = {};

        for (let functionName of functionList)
            if (!contextApi[classKey][functionName])
                contextApi[classKey][functionName] = (...args) =>
                    ipcRenderer.invoke(`${classKey}-${functionName}`, ...args);

        // Events
        if (plugins[pluginKey][classKey].prototype instanceof EventEmitter) {
            let listeners: {
                    [key: string]: { type: string; listener(...args: any[]): void };
                } = {},
                listenersOfTypeExist = (type) =>
                    !!Object.values(listeners).find((listenerObj) => listenerObj.type === type);

            Object.assign(contextApi[classKey], {
                addListener(type: string, callback: (...args) => void) {
                    let id = randomId();

                    // Deduplicate events
                    if (!listenersOfTypeExist(type))
                        ipcRenderer.send(`event-add-${classKey}`, type);

                    let eventHandler = (_, ...args) => callback(...args);

                    ipcRenderer.addListener(`event-${classKey}-${type}`, eventHandler);
                    listeners[id] = { type, listener: eventHandler };

                    return id;
                },
                removeListener(id: string) {
                    if (!listeners[id]) throw new Error('Invalid id');

                    let { type, listener } = listeners[id];

                    ipcRenderer.removeListener(`event-${classKey}-${type}`, listener);

                    delete listeners[id];

                    if (!listenersOfTypeExist(type))
                        ipcRenderer.send(`event-remove-${classKey}-${type}`);
                },
                removeAllListeners(type: string) {
                    for (let [id, listenerObj] of Object.entries(listeners))
                        if (!type || listenerObj.type === type) {
                            ipcRenderer.removeListener(
                                `event-${classKey}-${listenerObj.type}`,
                                listenerObj.listener
                            );
                            ipcRenderer.send(`event-remove-${classKey}-${listenerObj.type}`);
                            delete listeners[id];
                        }
                }
            });
        }
    }

contextBridge.exposeInMainWorld('CapacitorCustomPlatform', {
    name: 'electron',
    plugins: contextApi
});
////////////////////////////////////////////////////////
