/* global Document, Element */

/**
 * Listen for only one event
 * @param {HTMLElement} elem     The element
 * @param {String}      event    The event name
 * @param {Function}    callback The listener
 */
export default function (elem, event, callback) {
    elem.addEventListener(event, () => {
        callback();
        elem.removeEventListener(event, callback);
    }, false);
}
