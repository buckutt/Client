/**
 * Uniquify an array
 * @return {Array} Uniquified array
 */
Array.prototype.uniq = function () {
    let self = this;

    return self.filter((elem, pos) => self.indexOf(elem) === pos);
};
