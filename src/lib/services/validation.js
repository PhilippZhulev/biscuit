import { createLog } from "../store";

const readError = (fn = "read") =>  `Biscuit -> ${fn} error: `;
const messages = {
    storeRequired: (key, fnName) => readError(fnName) + `"${key}" require field.`,
    storeNotFound: (name, fnName) => readError(fnName) + `store "${name}" not found.`,
    stateNotFound: (name, fnName) => readError(fnName) + `state "${name}" not found.`,
    valueType: (fnName, type) => readError(fnName) + `field should be a "${type}".`,
};

function type(value) {
    const regex = /^\[object (\S+?)\]$/;
    const matches = Object.prototype.toString.call(value).match(regex) || [];
    return (matches[1] || 'undefined').toLowerCase();
}

export function storageRequire(storeName, fnName) {
    if (!storeName) {
        createLog(
            new Error(messages.storeRequired("storage.name", fnName)),
            "error",
            storeName
        );
    }
}

export function valideStorage(params, storage, fnName) {
    if (!storage[params.store]) {
        createLog(
            new Error(messages.storeNotFound(params.store, fnName)),
            "error",
            params.store
        );
    }
}

export function valideState(params, states, fnName) {
    if (!states[`"${params.state}"`]) {
        createLog(
            new Error(messages.stateNotFound(params.state, fnName)),
            "error",
            params.store,
        );
    }
}

export function valideType(value, t, fnName, storeName) {
    if (type(value) !== t) {
        createLog(
            new Error(messages.valueType(fnName, t)),
            "error",
            storeName,
        );
    }
}