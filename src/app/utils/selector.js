/* global document, Node */

export const $ = (s, fromEl) => {
    if (fromEl instanceof Node) {
        return fromEl.querySelector(s);
    }

    return document.querySelector(s);
};

export const $$ = (s, fromEl) => {
    if (fromEl instanceof Node) {
        return Array.prototype.slice.call(fromEl.querySelectorAll(s));
    }

    return Array.prototype.slice.call(document.querySelectorAll(s));
};
