/**
 * Check if the string is a card number
 * @param  {String} str The string
 * @return {Boolean} True if the string is an card number
 */
export default str => str.slice(0, 8) === '22000000';
