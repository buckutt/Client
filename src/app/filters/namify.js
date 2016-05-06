import Vue from 'vue';

const namify = function (str) {
    if (typeof str !== 'string') {
        return '';
    }

    return str.replace(/\w[^\s-]*/g, txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
};

Vue.filter('namify', name => namify(name));

export default namify;
