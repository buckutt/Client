/**
 * Filters an array and return the first match which validates id
 * @param  {Array}    arr The array
 * @param  {Function} id  id to validate
 * @return {Mixed} The result
 */
export default function (arr, id) {
    const filtered = arr.filter(item => item.id === id);

    if (filtered.length > 0) {
        return filtered[0];
    }
}
