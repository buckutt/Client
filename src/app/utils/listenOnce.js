/* global Document, Element */

/**
 * Listen for only one event
 * @param {String}   event    The event name
 * @param {Function} callback The listener
 */
Document.prototype.once = Element.prototype.once = function (event, callback) {
    this.addEventListener(event, () => {
        callback();
        this.removeEventListener(event, callback);
    }, false);
};
