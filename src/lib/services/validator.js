import { createLog } from "../store";

const readError = (fn = "read") =>  `biscuit -> ${fn} error: `;
const messages = {
    storeRequired: (key, fnName) => readError(fnName) + `"${key}" require field.`,
    storeType: (key, type, fnName) => readError(fnName) + `field "${key}" should be a "${type}".`,
    storeInitialObject: readError + "store field should be a object.",
    storeString: readError + "store field should be a string.",
    actionsType: readError + "actions field should be a object.",
    middlewareNotArray: readError + "middleware field should be a array.",
    middlewareNotKeyFunc: (key) =>
        readError + `middleware item "${key}" should be a function.`,
    debugerNotFunc: readError + "debuger field should be a function.",
    storeNotValid: readError + `store not valid.`,
    actionNotValid: readError + `action not valid.`,
    storeNotFound: (name, fnName) => readError(fnName) + `store "${name}" not found.`,
    stateNotFound: (name, fnName) => readError(fnName) + `state "${name}" not found.`,
    actionString: readError + "action must be of type string",
    isFunction: readError + "fn must be of function",
    storeKeyExist: (key, fnName) => readError(fnName) + `the "${key}" repository already exists.`,
};


function type(value) {
    const regex = /^\[object (\S+?)\]$/;
    const matches = Object.prototype.toString.call(value).match(regex) || [];

    return (matches[1] || 'undefined').toLowerCase();
}


export const Validator = function(fnName, templ, target) {
    return {
        checkStorageKeyNotExist: (storage, key) => {
            if (!storage[key]) {
                createLog(new Error(messages.storeNotFound(key, fnName)), "error");
            }
        },
        checkStorageKeyExist: (storage, key) => {
            if (storage[key]) {
                createLog(new Error(messages.storeKeyExist(key, fnName)), "error");
            }
        },
        isCustomCheck: (...params) => {
            for (let param of params) {
                if (param.type !== type(param.value)) {
                    createLog(new Error(messages.storeType(param.key, param.type, fnName)), "error");
                }

                if (param.require && !param.value) {
                    createLog(new Error(messages.storeRequired(param.key, fnName)), "error");
                }
            }
        },
        isRequired: (key) => {
            if (templ[key].require && !target[key]) {
                createLog(new Error(messages.storeRequired(key, fnName)), "error");
            } 
        },
        isFieldType: (key) => {
            if (target[key] && templ[key].type !== type(target[key])) {
                createLog(new Error(messages.storeType(key, templ[key].type, fnName)), "error");
            } 
        },
        isObjectFieldType: (key) => {
            if (target[key] && templ[key].keys) {
                for (let el in templ[key].keys) {
                    if (el !== '*' && templ[key].keys[el].require && !target[key][el]) {
                        createLog(new Error(messages.storeRequired(`${key}.${el}`, fnName)), "error");
                    }

                    if (el === '*' && target[key]) {
                        for (let prop in target[key]) { 
                            if (templ[key].keys['*'].type !== type(target[key][prop])) {
                                createLog(new Error(messages.storeType(prop, templ[key].keys['*'].type, fnName)), "error");
                            }
                        }
                    }
                }
            } 
        }
    }
}