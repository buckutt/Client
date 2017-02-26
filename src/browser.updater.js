const http         = require('http');
const path         = require('path');
const { Readable } = require('stream');
const unzip        = require('unzip');
const EventEmitter = require('events');

// TODO : move to socket.io client listener
module.exports = () => {
    const emitter = new EventEmitter();

    const server = http.createServer((req, res) => {
        let body = Buffer.alloc(0);

        req.on('data', data => {
            body = Buffer.concat([body, data]);
        });

        req.on('end', () => {
            const update = JSON.parse(body.toString());

            if (!update.hasOwnProperty('data')) {
                res.statusCode = 400;
                return res.end();
            }

            const r = new Readable();
            r.push(Buffer.from(update.data));
            r.push(null);

            r.pipe(unzip.Extract({ path: path.join(__dirname, '..', 'dist') }));

            emitter.emit('update');

            return res.end();
        });
    });

    server.listen(8080);

    return emitter;
}
