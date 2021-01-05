/**
 * BISCUIT STORAGE
 * @autor: Zhulev Philipp
 * @version: 1.0.0
 * @license MIT
 */
import {
    repositories,
    states,
    emitters
} from "./repositories";
import {
    activeMiddlewares,
    gettter,
    compareObject
} from "./helper";
import {
    valideStorage,
    valideState,
    valideType
} from "./services/validation";

/**
 * This method allows you to add new values to the repository. 
 * Accepts the storage name and object.
 * @param {string} name repository name
 * @param {object} instance object with added data
 * @public
 */
export function addRepo(name, instance) {
    valideType(name, "string", "addRepo");
    valideType(instance, "object", "newRepo", name);
    valideStorage({repo: name}, repositories, "getRepo");
    repositories[name] = { ...repositories[name], ...instance };
}

/**
 * This method is used to get data from the storage by its key. 
 * Warning: Storage data cannot be changed directly. 
 * You can replace the values either with the "addRepo" 
 * method or with state injection via "manager".
 * @param {string} name storage name
 * @return {object} storage data
 * @public
 */
export function getRepo(name) {
    valideStorage({repo: name}, repositories, "getRepo");
    return gettter({ ...repositories[name] });
}

/**
 * This method is needed to get the storage state
 * Warning: Storage data cannot be changed directly.
 * You can replace the values either with the "dispatch (...)" 
 * method or with an implementation via "manager".
 * @param {object} action the parameters of the action
 * @return {object} state data
 * @public
 */
export function getState(action) {
    valideStorage(action, repositories, "getState");
    valideState(action, states, "getState");

    const act = states[`"${action.state}"`];
    return gettter({ ...act[action.repo] });
}

/**
 * This is one of the most important methods. 
 * allows you to asynchronously update and change the state of the storage.
 * 
 * The first argument accepts action parameters, 
 * the second argument accepts an object with new data 
 * or a callback function that returns the past state 
 * as an argument and returns a new state.
 * 
 * Dispatch also returns several methods for working with states.
 * @param {object} action the parameters of the action
 * @param {object | function} payload payload data or callback function
 * @return {object} returns methods: before, after, merge
 * @async
 * @public
 */
export function dispatch(action, payload = {}) {
    valideStorage(action, repositories, "dispatch");
    valideState(action, states, "dispatch");

    /** init voids */
    const voids = {
        merge: null,
        before: null,
        after: null
    };

    (async function () {
        const actionStr = `"${action.state}"`;
        const act = states[actionStr][action.repo];
        const prev = { ...act };
        const emit = emitters[actionStr];

        /** if the function 
         * then pass the current state to the callback  */
        let payData = typeof payload === "function"
            ? payload(prev)
            : payload

        /**
         * Call before state change
         * @param {function} fn callback
         * @public
         */
        voids.before = (fn) => {
            fn(prev);
            return voids;
        };

        /**
         * Merge state into storage
         * @public
         */
        voids.merge = () => {
            if (`"${action.state}"` in states) {
                repositories[action.repo] = {
                    ...act,
                    ...payData
                };
            }

            return voids;
        };

        /**
         * Call after state change
         * @param {function} fn callback
         * @async
         * @public
         */
        voids.after = async (fn) => {
            const call = function (resolve) {
                resolve({
                    ...act,
                    ...payData
                });
            }

            await new Promise((resolve) => {
                const id = emit.subscribeAction(actionStr, () => call(resolve));
                emit.removeSubscribeAction(id, true);
            }).then(fn)
            return voids;
        };

        /** initial middlewares */
        payData = await new Promise((resolve) => {
            activeMiddlewares(
                {
                    action: action.state,
                    repo: action.repo,
                    payload: payData,
                    state: act
                },
                (newPayload) => {
                    resolve(newPayload);
                }
            );
        });

        /** update state data */
        states[actionStr][action.repo] = {
            ...act,
            ...payData
        };

        /** create dispatch action */
        emit.dispatchAction(actionStr, {
            action: action.state,
            repo: action.repo,
            payload: states[actionStr][action.repo] 
        })
    })();

    return voids;
}

/**
 * This is one of the most important methods. 
 * Allows you to subscribe to the state. and tracks its change. 
 * The first argument takes the parameters of the action. 
 * results can be obtained through the callback of the second argument or through the return promise.
 * @param {object} action the parameters of the action
 * @param {function} fn callback
 * @callback
 * @async
 * @public
 */
export async function subscribeToState(action, fn = () => { }) {
    valideStorage(action, repositories, "subscribeToState");
    valideState(action, states, "subscribeToState");

    const emit = emitters[`"${action.state}"`];
    const call = (data, resolve) => {
        const g = getState({ repo: data.repo, state: action.state });
        if (data.action === action.state && data.repo === action.repo) {
            resolve(g);
        }
    }

    const res = await new Promise((resolve) => {
        const id = emit.subscribeAction(`"${action.state}"`, (data) => call(data, resolve));
        emit.removeSubscribeAction(id, true);
    });

    fn(res);
    return res;
}

/**
 * The State Manager allows you to manage the storage and its state. 
 * Provides a set of methods for two-way merge, replace, copy, 
 * and other actions between the selected storage and state.
 * @param {object} action the parameters of the action
 * @return {object} returns a set of methods
 * @public
 */
export function newManager(action) {
    valideStorage(action, repositories, "newManager");
    valideState(action, states, "newManager");

    return {
        /**
         * This method will combine data from the state with data from the storage.
         * @public
         */
        merge: () => {
            repositories[action.repo] = {
                ...repositories[action.repo],
                ...states[`"${action.state}"`][action.repo]
            };
        },

        /**
         * This method will merge data from the storage with data from the state.
         * @public
         */
        pull: () => {
            states[`"${action.state}"`][action.repo] = {
                ...states[`"${action.state}"`][action.repo],
                ...repositories[action.repo]
            };
        },

        /**
         * This method will replace the data from the storage with state data.
         * @public
         */
        replaceRepo: () => {
            repositories[action.repo] = { ...states[`"${action.state}"`][action.repo] };
        },

        /**
         * This method will replace the data from the state with the storage data.
         * @public
         */
        replaceState: () => {
            states[`"${action.state}"`][action.repo] = { ...repositories[action.repo] };
        },

        /**
         * This method will merge the data of the selected state 
         * with the data of the state specified in the arguments.
         * @param {object} targetAction the action that you want to merge
         * @public
         */
        mergeState: (targetAction) => {
            valideStorage(targetAction, repositories, "newManager.mergeState");
            valideState(targetAction, states, "newManager.mergeState");

            states[`"${targetAction.state}"`][action.repo] = {
                ...states[`"${targetAction.state}"`][action.repo],
                ...states[`"${action.state}"`][action.repo]
            };
        },

        /**
         * This method removes the storage and its copies from all states.
         * WARNING: This method can be useful for optimization, 
         * but it can make the code non-obvious, 
         * which will lead to difficulties in support.
         * @public
         */
        remove: () => {
            delete repositories[action.repo];
            Object.keys(states[`"${action.state}"`]).forEach((item) => {
                if (item === action.repo) {
                    delete states[`"${action.state}"`][action.repo];
                }
            });
        },

        /**
         * This method deletes all states that do not contain data.
         * @public
         */
        removeEmptyState: () => {
            Object.keys(states[`"${action.state}"`]).forEach((item) => {
                if (Object.keys(item).length === 0) {
                    delete states[`"${action.state}"`];
                }
            });
        },

        /**
         * This method compares two states for identity
         * WARNING: states should not contain methods
         * @param {object} targetAction the action that you want to compare
         * @return {bool}
         * @public
         */
        compareStates: (targetAction) => {
            valideStorage(targetAction, repositories, "newManager.compareStates");
            valideState(targetAction, states, "newManager.compareStates");
            return compareObject(
                states[`"${action.state}"`][action.repo],
                states[`"${targetAction.state}"`][action.repo]
            );
        },

        /**
         * Сompare state and repository
         * WARNING: states should not contain methods
         * @return {bool}
         * @public
         */
        compareWithState: () => {
            return compareObject(
                repositories[action.repo],
                states[`"${action.state}"`][action.repo]
            );
        },

        /**
         * compare state and instance object
         * WARNING: states should not contain methods
         * @param {object} instance object instance
         * @return {bool}
         * @public
         */
        compareStateWithInstance: (instance) => {
            return compareObject(states[`"${action.state}"`][action.repo], instance);
        },

        /**
         * compare repository and instance object
         * WARNING: states should not contain methods
         * @param {object} instance object instance
         * @return {bool}
         * @public
         */
        compareRepoWithInstance: (instance) => {
            return compareObject(repositories[action.repo], instance);
        },

        /**
         * Clones the selected storage and its state.
         * WARNING: It is best to avoid using this method, 
         * as the best practice would be to do initialization of repositories in one place. 
         * Copying the repository can lead to code support difficulties.
         * @param {string} name name for the new storage
         * @public
         */
        clone: (name) => {
            repositories[name] = { ...repositories[action.repo] };
            states[`"${action.state}"`][name] = {
                ...states[`"${action.state}"`][action.repo]
            };
        },

        /**
         * Updates the status of the repository. 
         * This method is equivalent to dispatch(...)
         * @public
         */
        update: () => {
            dispatch(action, {});
        },

        /**
         * Returns parameters of the selected action
         * @public
         */
        props: action
    };
}
