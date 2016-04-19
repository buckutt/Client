import Vue from 'vue';

Vue.filter('credit', (credit, divide) => {
    if (!credit) {
        return '0.00€';
    }

    let newCredit = (divide) ? (credit / 100) : credit;
    newCredit = newCredit.toFixed(2);

    return `${newCredit}€`;
});
