

/** debuger list */
export const debugCollection = {};

/**
 * This method processes the storage logs 
 * and outputs them to the debugger if necessary.
 * @param {any} data is error -> new Error, is warn -> string
 * @param {string} repoName repository name
 * @public
 */
export const createLog = function (data, repoName) {
    for (let key in debugCollection) {
        if (key === repoName) {
            debugCollection[key](data);
        }

        if (!repoName) {
            debugCollection[key](data);
        }
    }
};