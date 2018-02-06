const EventEmitter = require('events');
const Promise      = require('bluebird');

const UltralightC = require('./ultralight-c');

module.exports = class NFCReader extends EventEmitter {
    constructor() {
        super();

        this.ultralightC = new UltralightC();

        this.ultralightC.on('uid', uid => this.emit('uid', uid));
        this.ultralightC.on('cardType', cardType => this.emit('cardType', cardType));
        this.ultralightC.on('atr', atr => this.emit('atr', atr));
        this.ultralightC.on('data', data => this.emit('data', data));
    }

    write(data) {
        return this.ultralightC.write(data);
    }
}
