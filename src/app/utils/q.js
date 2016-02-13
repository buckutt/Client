/**
 * Serializes an object ready to be put in an URL
 * @param  {Object} obj The object
 * @return {String} The raw string
 */
export default obj => encodeURIComponent(JSON.stringify(obj));
