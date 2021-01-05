
/** debug messages */
const messages = {
    debugNotFound: "biscuit failed: debug type not found.",
};


/** debuger list */
export const debugCollection = {};

/**
 * This method processes the storage logs 
 * and outputs them to the debugger if necessary.
 * @param {any} data is error -> new Error, is warn -> string
 * @param {string} type error || warn
 * @param {string} repoName repository name
 * @public
 */
export const createLog = function (data, type = "error", repoName) {
    if (!debugCollection[repoName]) {
        switch (type) {
        case "error":
            throw data;
        case "warn":
            console.warn(data);
            break;
        case "log":
            console.log(data);
            break;
        default:
            throw messages.debugNotFound;
        }
        return;
    }

    for (let key in debugCollection) {
        if (key === repoName) {
            debugCollection[key](data);
        }

        if (!repoName) {
            debugCollection[key](data);
        }
    }
};