import memoize from 'lodash.memoize';

export default memoize((text, fontSize = 16) => {
    const $el = document.createElement('div');

    document.body.appendChild($el);

    $el.style.fontSize = `${fontSize}px`;
    $el.style.position = 'absolute';
    $el.style.left = '-1000px';
    $el.style.top = '-1000px';

    $el.innerHTML = text;

    const result = $el.offsetWidth;

    document.body.removeChild($el);

    return result;
});
