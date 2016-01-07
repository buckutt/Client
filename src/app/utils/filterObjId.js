/**
 * Filters an array and return the first match which validates id
 * @param  {Function} id id to validate
 * @return {Mixed} The result
 */
Array.prototype.filterObjId = function (id) {
    let filtered = this.filter(item => item.id === id);

    return (filtered.length > 0) ? filtered[0] : undefined;
};
