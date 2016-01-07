import Vue from '../../bower_components/vue/dist/vue';

Vue.filter('passwordHide', password => {
    if (!password) {
        return;
    }

    let len    = Math.max(0, password.length - 1);
    let result = '';

    while (len--) {
        result += '*';
    }

    return result + password.slice(-1);
});
