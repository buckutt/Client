/**
 * Uniquify an array
 * @param {Array} arr The array
 * @return {Array} Uniquified array
 */
export default arr => arr.filter((elem, pos) => arr.indexOf(elem) === pos);
