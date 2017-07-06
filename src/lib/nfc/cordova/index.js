import { EventEmitter } from 'events';

export default class NFC extends EventEmitter {
    constructor() {
        super();
        console.warn('NFC is not available in cordova');
    }

    listenNFC() {
        console.log('Listening on NFC');
    }
}
