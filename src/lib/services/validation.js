import { createLog } from "../debuger";

const readError = (fn = "read") =>  `Biscuit -> ${fn} error: `;
const messages = {
    repoRequired: (key, fnName) => readError(fnName) + `"${key}" require field.`,
    repoNotFound: (name, fnName) => readError(fnName) + `repository "${name}" not found.`,
    stateNotFound: (name, fnName) => readError(fnName) + `state "${name}" not found.`,
    valueType: (fnName, type) => readError(fnName) + `field should be a "${type}".`,
};

function type(value) {
    const regex = /^\[object (\S+?)\]$/;
    const matches = Object.prototype.toString.call(value).match(regex) || [];
    return (matches[1] || 'undefined').toLowerCase();
}

export function storageRequire(repoName, fnName) {
    if (!repoName) {
        createLog(
            new Error(messages.repoRequired("storage.name", fnName)),
            "error",
            repoName
        );
    }
}

export function valideStorage(action, storage, fnName) {
    if (!storage[action.repo]) {
        createLog(
            new Error(messages.repoNotFound(action.repo, fnName)),
            "error",
            action.repo
        );
    }
}

export function valideState(action, states, fnName) {
    if (!states[`"${action.state}"`]) {
        createLog(
            new Error(messages.stateNotFound(action.state, fnName)),
            "error",
            action.repo,
        );
    }
}

export function valideType(value, t, fnName, repoName) {
    if (type(value) !== t) {
        createLog(
            new Error(messages.valueType(fnName, t)),
            "error",
            repoName,
        );
    }
}