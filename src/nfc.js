const EventEmitter = require('events');
const { spawn }    = require('child_process');

module.exports = class NFC extends EventEmitter {
    constructor() {
        super();
        this.listenNFC();
    }

    listenNFC() {
        this.proc = spawn('node', ['./nfc/index']);

        this.proc.stdout.on('data', (data) => {
            const out = JSON.parse(Buffer.from(data).toString());

            this.emit(out.type, {
                data      : out.data,
                additional: out.additional
            });
        });

        this.proc.stderr.on('data', (data) => {
            const out = Buffer.from(data).toString();

            this.emit('error', out);
        });

        this.proc.on('close', () => {
            setTimeout(() => {
                this.listenNFC();
            }, 100);
        });
    }

    restartNFC() {
        this.proc.kill();

        setTimeout(() => {
            this.listenNFC();
        }, 100);
    }
};
