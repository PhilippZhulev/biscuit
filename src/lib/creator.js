import { emitter } from "./emitter";
import { debugCollection, createLog } from "./debuger";
import {
    collections,
    repositories,
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
    storageNameError: (fnName) => `biscuit ${fnName} error: storage name is not a string.`,
    stateTypeError: `biscuit createBiscuit error: the status field type must be either a string or an object.`,
};

/**
 * This method is responsible for creating a new repository. 
 * Takes as the first argument a string with the repository name. 
 * and the initial state of the storage as the second argument
 * @param {string} name storage name
 * @param {object} initial initial object
 * @public
 */
export function newRepo(name, initial = {}) {
    if (typeof name !== "string") {
        createLog(
            new Error(messages.storageNameError("newRepo")),
            "error",
        );
    }
    valideType(initial, "object", "newRepo", name);
    repositories[name] = initial;
}

/**
 * This method binds states to the storage via the "add" method.
 * Gets the storage name string as an argument.
 * @param {string} name name of the linked storage
 * @return {object} returns the "add" method
 * @public
 */
export function createStateTo(name) {
    valideStorage({repo: name}, repositories, "createActionsTo");
    return {
    /** This method binds the state to the selected storagee
     * @param {string} action state name
     * @public
     */
        bind: (action, initial = {}) => {
            const actionStr = `"${action}"`;

            emitters[actionStr] = emitter(actionStr)
            states[actionStr] = {
                ...states[actionStr],
                [name]: { ...repositories[name], ...initial }
            };

            return { ...{ state: action, repo: name } };
        },
        /** repository key */
        repo: name
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
        createActions.bind(item);
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
                collection[action[i].repo].push({ ...action[i] });
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
   * @param {string} repo storage name
   * @return {object} collections instance
   * @public
   */
    fromRepo: (repo) => ({ ...collections[repo] }),

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
 * @param {string} action the parameters of the action
 * @return {object} returns a set of methods
 * @public
 */
export function middleware(action) {
    valideStorage(action, repositories, "middleware");
    const s = action.repo;
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
 * @param {string} repo a string with the name of the repository
 * @param {function} fn debugger callback function
 * @public
 */
export function createDebuger(repo, fn) {
    valideStorage({ repo }, repositories, "createDebuger");
    debugCollection[repo] = fn;
}


/**
 * Monolithic method for creating a biscuit storage.
 * This is the preferred method for creating a repository.
 * @param {object} params an object containing the storage settings
 * @return {object} returns a set of actions
 * @public
 */
export function createBiscuit(params) {
    storageRequire(params.repo, repositories, "createBiscuit");
    storageRequire(params.repo.name, repositories, "createBiscuit");

    /** Create a new storage */
    newRepo(params.repo.name, params.repo.initial);
    const a = createStateTo(params.repo.name);
    const stateList = {};

    /** Adding States to the repository */
    if (params.states) {
        for (let key in params.states) {
            const param = params.states[key];
            const paramType = typeof param === "string"
            stateList[key] = a.bind(
                paramType ? param : param.name,
                paramType ? {} : param.initial
            );
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
        createDebuger(params.repo.name, params.debuger);
    }

    return stateList;
}