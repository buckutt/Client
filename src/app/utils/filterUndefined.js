/**
 * Filters an array and return what's defined
 * @return {Mixed} The result
 */
Array.prototype.filerUndefined = function () {
    return this.filter(item => item !== undefined);
};
