import { emitter } from "./emitter";
import { debugCollection, createLog } from "./debuger";
import {
    collections,
    storage,
    states,
    middlewares,
    emitters
} from "./repositories";

import {
    storageRequire,
    valideStorage,
    valideType
} from "./services/validation";

/** debug messages */
const messages = {
    storageNameError: (fnName) =>  `biscuit ${fnName} error: storage name is not a string.`,
};

/**
 * This method is responsible for creating a new repository. 
 * Takes as the first argument a string with the repository name. 
 * and the initial state of the storage as the second argument
 * @param {string} name storage name
 * @param {object} initial initial object
 * @public
 */
export function newStorage(name, initial = {}) {
    if (typeof name !== "string") {
        createLog(
            new Error(messages.storageNameError("newStorage")),
            "error",
        );
    }
    valideType(initial, "object", "newStorage", name);
    storage[name] = initial;
}

/**
 * This method binds states to the storage via the "add" method.
 * Gets the storage name string as an argument.
 * @param {string} name name of the linked storage
 * @return {object} returns the "add" method
 * @public
 */
export function createActionsTo(name) {
    valideStorage({store: name}, storage, "createActionsTo");
    return {
    /** This method binds the state to the selected storagee
     * @param {string} action state name
     * @public
     */
        add: (action) => {
            const actionStr = `"${action}"`;

            emitters[actionStr] = emitter(actionStr)
            states[actionStr] = { [name]: storage[name] };
            const actionParams = { state: action, store: name };

            return { ...actionParams };
        },
        /** store key */
        store: name
    };
}

/**
 * This helper method takes the first parameter "createactionsTo" 
 * and adds actions to it from the string array of the second argument.
 * @param {object} createActions createactionsto(storage name) method
 * @param {array} actions actions string array
 * @public
 */
export function initialActions(createActions, actions) {    
    actions.forEach((item) => {
        createActions.add(item);
    });
}

/**
 * This helper method converts the actions received via the argument to an array
 * @param {any} action accepts multiple actions as arguments
 * @return {object} returns the "compile" method
 * @public
 */
export function stateCollection(...action) {
    const collection = {};
    return {
        /**
         * compile state collection
         * @return {object} actions collection
         * @public
         */
        compile: () => {
            for (let i = 0; i < action.length; i++) {
                collection[action[i].store].push({ ...action[i] });
            }

            return collection;
        }
    };
}

/**
 * This helper method can combine multiple collections of actions.
 * Accepts "stateCollection(...action)"
 * @param {any} collection array actions
 * @public
 */
export function combineStateCollections(...collection) {
    collection.forEach((item) => {
        collections = { ...collections, ...item.compile() };
    });
}

/**
 * A set of helper methods for extracting actions from collections
 * @static
 * @public
 */
export const getStateCollection = {
    /**
   * Get the entire collection actions
   * @return {object} collections instance
   * @public
   */
    all: () => ({ ...collections }),

    /**
   * Get a collection by matching the storage name
   * @param {string} store storage name
   * @return {object} collections instance
   * @public
   */
    fromStore: (store) => ({ ...collections[store] }),

    /**
   * Get the result filtered by state name
   * @param {string} stateName state name
   * @return {array} state list
   * @public
   */
    outOfState: (stateName) => {
        let out = null;
        Object.keys(collections).forEach((key) => {
            out = collections[key].filter(({ state }) => state === stateName);
        });

        return out;
    }
};

/**
 * This method allows you to add middleware for the state handler.
 * @param {string} params the parameters of the action
 * @return {object} returns a set of methods
 * @public
 */
export function middleware(params) {
    valideStorage(params, storage, "middleware");
    const s = params.store;
    return {
        /**
         * Adds a handler to the middleware task list.
         * @param {function} fn middle function
         * @public
         */
        add: (fn) => {
            if (middlewares[s]) {
                middlewares[s].push(fn);
            } else {
                middlewares[s] = [fn];
            }
        }
    };
}

/**
 * This method allows you to add your own debugger. 
 * The debugger will accept and output logs instead of the standard debugger.
 * @param {string} store a string with the name of the store
 * @param {function} fn debugger callback function
 * @public
 */
export function createDebuger(store, fn) {
    valideStorage({ store }, storage, "createDebuger");
    debugCollection[store] = fn;
}


/**
 * Monolithic method for creating a biscuit storage.
 * This is the preferred method for creating a repository.
 * @param {object} params an object containing the storage settings
 * @return {object} returns a set of actions
 * @public
 */
export function createBiscuit(params) {
    storageRequire(params.store, storage, "createBiscuit");
    storageRequire(params.store.name, storage, "createBiscuit");

    /** Create a new storage */
    newStorage(params.store.name, params.store.initial);
    const a = createActionsTo(params.store.name);
    const stateList = {};

    /** Adding States to the repository */
    if (params.actions) {
        for (let key in params.actions) {
            stateList[key] = a.add(params.actions[key]);
        }
    }

    /** Adding middleware to the repository */
    if (params.middleware && params.middleware.length > 0) {
        const middle = middleware(a);
        for (let fn of params.middleware) {
            middle.add(fn);
        }
    }

    /** Adding debuger to the repository */
    if (params.debuger) {
        createDebuger(params.store.name, params.debuger);
    }

    return stateList;
}