import enquire from 'enquire.js';
import { $ } from './selector';

const MOBILE_WIDTH = 605;
const TABLET_WIDTH = 839;

enquire.register(`screen and (max-width: ${MOBILE_WIDTH}px)`, {
    match () {
        document.body.classList.add('mobile');
        $('#main').classList.remove('mdl-layout--fixed-tabs');
    },

    unmatch () {
        document.body.classList.remove('mobile');
        $('#main').classList.add('mdl-layout--fixed-tabs');
    }
});

enquire.register(`screen and (min-width: ${MOBILE_WIDTH + 1}px) and (max-width: ${TABLET_WIDTH}px)`, {
    match () {
        document.body.classList.add('tablet');
    },

    unmatch () {
        document.body.classList.remove('tablet');
    }
});
