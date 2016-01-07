/**
 * Check if the string is a card number
 * @return {Boolean} True if the string is an card number
 */
String.prototype.isCardNumber = function () {
    return this.slice(0, 8) === '22000000';
};
