/* global document, Element */

/**
 * Search among all parents of a child, stops when the wanted parent is found
 * @param  {HTMLElement} elem     The element
 * @param  {String}      selector CSS3 selector
 * @return {HTMLElement} The parent
 */
export default function parents (elem, selector) {
    const $matches = Array.prototype.slice.call(document.querySelectorAll(selector));
    let parent     = elem;

    do {
        if ($matches.indexOf(parent) !== -1) {
            return parent;
        }
        parent = parent.parentElement;
    } while (parent !== document.documentElement);

    return parent;
}
