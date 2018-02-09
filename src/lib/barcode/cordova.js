module.exports = () => {
    return new Promise((resolve, reject) => {
        cordova.plugins.barcodeScanner.scan(
            (result) => {
                if (!result.cancelled) {
                    console.log('barcode', result);
                    return resolve(result.text);
                }

                reject(new Error('Cancelled barcode scan'));
            },
            error => reject(error),
            {
                preferFrontCamera    : false,
                showFlipCameraButton : false,
                prompt               : 'Scanner le billet',
                resultDisplayDuration: 0
            }
        );
    });
};
