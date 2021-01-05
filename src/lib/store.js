/**
 * BISCUIT STORAGE
 * @autor: Zhulev Philipp
 * @version: 1.0.0
 * @license MIT
 */
import {
    storage,
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
 * This method allows you to add new values to the store. 
 * Accepts the storage name and object.
 * @param {string} name storage name
 * @param {object} instance object with added data
 * @public
 */
export function addStorage(name, instance) {
    valideType(name, "string", "addStorage");
    valideType(instance, "object", "newStorage", name);
    valideStorage({store: name}, storage, "getStorage");
    storage[name] = { ...storage[name], ...instance };
}

/**
 * This method is used to get data from the storage by its key. 
 * Warning: Storage data cannot be changed directly. 
 * You can replace the values either with the "addStorage" 
 * method or with state injection via "manager".
 * @param {string} name storage name
 * @return {object} storage data
 * @public
 */
export function getStorage(name) {
    valideStorage({store: name}, storage, "getStorage");
    return gettter({ ...storage[name] });
}

/**
 * This method is needed to get the storage state
 * Warning: Storage data cannot be changed directly.
 * You can replace the values either with the "dispatch (...)" 
 * method or with an implementation via "manager".
 * @param {object} params the parameters of the action
 * @return {object} state data
 * @public
 */
export function getState(params) {
    valideStorage(params, storage, "getState");
    valideState(params, states, "getState");

    const act = states[`"${params.state}"`];
    return gettter({ ...act[params.store] });
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
 * @param {object} params the parameters of the action
 * @param {object | function} payload payload data or callback function
 * @return {object} returns methods: before, after, merge
 * @async
 * @public
 */
export function dispatch(params, payload = {}) {
    valideStorage(params, storage, "dispatch");
    valideState(params, states, "dispatch");

    /** init voids */
    const voids = {
        merge: null,
        before: null,
        after: null
    };

    (async function () {
        const actionStr = `"${params.state}"`;
        const act = states[actionStr][params.store];
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
            if (`"${params.state}"` in states) {
                storage[params.store] = {
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
                    action: params.state,
                    store: params.store,
                    payload: payData,
                    state: act
                },
                (newPayload) => {
                    resolve(newPayload);
                }
            );
        });

        /** update state data */
        states[actionStr][params.store] = {
            ...act,
            ...payData
        };

        /** create dispatch action */
        emit.dispatchAction(actionStr, {
            action: params.state,
            store: params.store,
            payload: states[actionStr][params.store] 
        })
    })();

    return voids;
}

/**
 * This is one of the most important methods. 
 * Allows you to subscribe to the state. and tracks its change. 
 * The first argument takes the parameters of the action. 
 * results can be obtained through the callback of the second argument or through the return promise.
 * @param {object} params the parameters of the action
 * @param {function} fn callback
 * @callback
 * @async
 * @public
 */
export async function subscribeToState(params, fn = () => { }) {
    valideStorage(params, storage, "subscribeToState");
    valideState(params, states, "subscribeToState");

    const emit = emitters[`"${params.state}"`];
    const call = (data, resolve) => {
        const g = getState({ store: data.store, state: params.state });
        if (data.action === params.state && data.store === params.store) {
            resolve(g);
        }
    }

    const res = await new Promise((resolve) => {
        const id = emit.subscribeAction(`"${params.state}"`, (data) => call(data, resolve));
        emit.removeSubscribeAction(id, true);
    });

    fn(res);
    return res;
}

/**
 * The State Manager allows you to manage the storage and its state. 
 * Provides a set of methods for two-way merge, replace, copy, 
 * and other actions between the selected storage and state.
 * @param {object} params the parameters of the action
 * @return {object} returns a set of methods
 * @public
 */
export function newManager(params) {
    valideStorage(params, storage, "newManager");
    valideState(params, states, "newManager");

    return {
        /**
         * This method will combine data from the state with data from the storage.
         * @public
         */
        merge: () => {
            storage[params.store] = {
                ...storage[params.store],
                ...states[`"${params.state}"`][params.store]
            };
        },

        /**
         * This method will merge data from the storage with data from the state.
         * @public
         */
        pull: () => {
            states[`"${params.state}"`][params.store] = {
                ...states[`"${params.state}"`][params.store],
                ...storage[params.store]
            };
        },

        /**
         * This method will replace the data from the storage with state data.
         * @public
         */
        replaceStore: () => {
            storage[params.store] = { ...states[`"${params.state}"`][params.store] };
        },

        /**
         * This method will replace the data from the state with the storage data.
         * @public
         */
        replaceState: () => {
            states[`"${params.state}"`][params.store] = { ...storage[params.store] };
        },

        /**
         * This method will merge the data of the selected state 
         * with the data of the state specified in the arguments.
         * @param {object} targetParams the action that you want to merge
         * @public
         */
        mergeState: (targetParams) => {
            valideStorage(targetParams, storage, "newManager.mergeState");
            valideState(targetParams, states, "newManager.mergeState");

            states[`"${targetParams.state}"`][params.store] = {
                ...states[`"${targetParams.state}"`][params.store],
                ...states[`"${params.state}"`][params.store]
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
            delete storage[params.store];
            Object.keys(states[`"${params.state}"`]).forEach((item) => {
                if (item === params.store) {
                    delete states[`"${params.state}"`][params.store];
                }
            });
        },

        /**
         * This method deletes all states that do not contain data.
         * @public
         */
        removeEmptyState: () => {
            Object.keys(states[`"${params.state}"`]).forEach((item) => {
                if (Object.keys(item).length === 0) {
                    delete states[`"${params.state}"`];
                }
            });
        },

        /**
         * This method compares two states for identity
         * WARNING: states should not contain methods
         * @param {object} targetParams the action that you want to compare
         * @return {bool}
         * @public
         */
        compareStates: (targetParams) => {
            valideStorage(targetParams, storage, "newManager.compareStates");
            valideState(targetParams, states, "newManager.compareStates");
            return compareObject(
                states[`"${params.state}"`][params.store],
                states[`"${targetParams.state}"`][params.store]
            );
        },

        /**
         * Сompare state and store
         * WARNING: states should not contain methods
         * @return {bool}
         * @public
         */
        compareWithState: () => {
            return compareObject(
                storage[params.store],
                states[`"${params.state}"`][params.store]
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
            return compareObject(states[`"${params.state}"`][params.store], instance);
        },

        /**
         * compare store and instance object
         * WARNING: states should not contain methods
         * @param {object} instance object instance
         * @return {bool}
         * @public
         */
        compareStoreWithInstance: (instance) => {
            return compareObject(storage[params.store], instance);
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
            storage[name] = { ...storage[params.store] };
            states[`"${params.state}"`][name] = {
                ...states[`"${params.state}"`][params.store]
            };
        },

        /**
         * Updates the status of the repository. 
         * This method is equivalent to dispatch(...)
         * @public
         */
        update: () => {
            dispatch(params, {});
        },

        /**
         * Returns parameters of the selected action
         * @public
         */
        props: params
    };
}
