module.exports = function classic(config, transmit, printLog, printOut) {
    return transmit(Buffer.from(JSON.parse(config.classic.fileId)), 40)
        .then((data) => {
            const code = data.toString().replace(/\D+/g, '');

            if (code.length > 0) {
                printOut(code);

                return true;
            }

            return false;
        });
};
