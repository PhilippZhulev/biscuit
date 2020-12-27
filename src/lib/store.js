/**
 * BISCUIT STORAGE
 * @autor: Zhulev Philipp
 * @version: 1.0.0
 * @license MIT
 */

import { emitters } from "./emittes";
import { debugCollection } from "./debuger";
import {
    creaateBiscuitValidator,
    actionValidation,
    stateValidator,
    storeValidator
} from "./validation";

/** debug messages */
const messages = {
    writeError: "biscuit write error: Getter fields not writable.",
    notKey: "biscuit read error: key not found."
};

/** storage instance */
const storage = {};
/** states instance */
const states = {};

/** middlewares list */
const middlewares = {};

/** actions collection */
let collections = {};

/**
 * create log for biscuit debuger
 * @param {any} data is error -> new Error, is warn -> string
 * @param {string} type error || warn
 * @public
 */
export const createLog = function (data, type = "error") {
    emitters.storeEmitter.dispatchEvent(
        new CustomEvent("store.handle.debug", {
            detail: {
                data,
                type
            }
        })
    );
};

/**
 * active middleware functions
 * @param {object} context action context
 * @param {function} fn callback
 * @private
 */
async function activeMiddlewares(context, fn = () => null) {
    if (middlewares[context.store]) {
        await middlewares[context.store].forEach((middle) => {
            middle(context, fn);
        });
    } else {
        fn(context.payload);
    }
}

/**
 * get store data void
 * @param {string} store store name
 * @param {object} instance geeter object
 * @param {string} key store key
 * @return {object}
 * @private
 */
function gettter(store, instance, key) {
    if (key in store) {
        return new Proxy(instance, {
            set: () => {
                createLog(new Error(messages.writeError), "error");
            }
        });
    } else {
        createLog(new Error(messages.notKey), "error");
    }
}

/**
 * compare two objects
 * @param {object} firstState first object
 * @param {object} lastState last object
 * @return {bool}
 * @private
 */
function compareObject(firstState, lastState) {
    let propInFirst = 0;
    let propInLast = 0;
    let prop;

    if (firstState === lastState) {
        return true;
    }

    if (
        firstState == null ||
    typeof firstState !== "object" ||
    lastState == null ||
    typeof lastState !== "object"
    ) {
        return false;
    }

    for (prop in firstState) {
        propInFirst += 1;
    }

    for (prop in lastState) {
        propInLast += 1;

        if (
            !(prop in firstState) ||
      !compareObject(firstState[prop], lastState[prop])
        ) {
            return false;
        }
    }

    return propInFirst === propInLast;
}

/**
 * add data by store
 * @param {string} key store key
 * @param {object} instance setter object
 * @public
 */
export function addStorage(key, instance) {
    storeValidator(key, storage);
    storage[key] = { ...storage[key], ...instance };
}

/**
 * init new storage
 * @param {string} key store key
 * @param {object} initial initial object
 * @public
 */
export function newStorage(key, initial) {
    storage[key] = initial;
}

/**
 * get data by key
 * @param {string} key store key
 * @return {object} key data
 * @public
 */
export function getStorage(key) {
    storeValidator(key, storage);
    return gettter(storage, { ...storage[key] }, key);
}

/**
 * create state to storage
 * @param {string} key store key
 * @return {object} voids
 * @public
 */
export function createActionsTo(key) {
    storeValidator(key, storage);
    return {
    /** add state action name
     * @param {string} action action name
     * @public
     */
        state: (action) => {
            states[`"${action}"`] = { [key]: storage[key] };
            const actionParams = { state: action, store: key };
            return { ...actionParams };
        },
        /** store key */
        store: key
    };
}

/**
 * create state collection
 * @param {any} action
 * @return {object} voids
 * @public
 */
export function stateCollection(...action) {
    const collection = {};
    return {
    /**
     * init state collection
     * @return {object} actions colecction
     * @public
     */
        init: () => {
            for (let i = 0; i < action.length; i++) {
                collection[action[i].store].push({ ...action[i] });
            }

            return collection;
        }
    };
}

/**
 * merge state collections
 * @param {any} collection
 * @public
 */
export function combineStateCollections(...collection) {
    collection.forEach((item) => {
        collections = { ...collections, ...item.init() };
    });
}

/**
 * get state collections
 * @return {object} voids
 * @public
 */
export const getStateCollection = {
    /**
   * get all collections
   * @return {object} collections object
   * @public
   */
    all: () => ({ ...collections }),

    /**
   * get collecton from store
   * @param {string} state state name
   * @return {array} state list
   * @public
   */
    fromStore: (store) => ({ ...collections[store] }),

    /**
   * filtring collecton by state
   * @param {string} stateName state name
   * @return {array} state list
   * @public
   */
    outOfState: (stateName) => {
        stateValidator(stateName, states);

        let out = null;
        Object.keys(collections).forEach((key) => {
            out = collections[key].filter(({ state }) => state === stateName);
        });

        return out;
    }
};

/**
 * get state to storage
 * @param {string} key store key
 * @param {string} action action, state name
 * @return {object}
 * @public
 */
export function getState(params) {
    actionValidation(params, states, storage);

    const act = states[`"${params.state}"`];
    return gettter(act, { ...act[params.store] }, params.store);
}

/**
 * upadete storage state
 * @param {object} params store and state
 * @param {object} payload new data
 * @return {object} voids
 * @public
 */
export function dispatch(params, payload) {
    actionValidation(params, states, storage);

    /** init voids */
    const voids = {
        merge: () => {},
        before: null,
        after: null
    };

    (async function () {
        const act = states[`"${params.state}"`][params.store];
        const prev = { ...act };

        /**
     * call before state change
     * @param {function} fn callback
     * @public
     */
        voids.before = (fn) => {
            fn(prev);
        };
        /** initial middlewares */
        payload = await new Promise((resolve) => {
            activeMiddlewares(
                {
                    action: params.state,
                    store: params.store,
                    payload: payload,
                    state: act
                },
                (newPayload) => {
                    resolve(newPayload);
                }
            );
        });

        /** update state data */
        states[`"${params.state}"`][params.store] = {
            ...act,
            ...payload
        };

        /** create update event */
        emitters.storeEmitter.dispatchEvent(
            new CustomEvent("store.update", {
                detail: {
                    action: params.state,
                    store: params.store,
                    payload: states[`"${params.state}"`][params.store]
                }
            })
        );

        /**
     * call after state change
     * @param {function} fn callback
     * @public
     */
        voids.after = (fn) => {
            fn({ ...act });
        };

        /**
     * merge state into storage
     * @public
     */
        voids.merge = () => {
            if (`"${params.state}"` in states) {
                storage[params.store] = act;
            }

            return voids;
        };
    })();

    return voids;
}

/**
 * state subscription
 * @param {object} params store and state
 * @param {function} fn callback
 * @public
 */
export function subscribeToState(params, fn) {
    actionValidation(params, states, storage);

    emitters.storeEmitter.addEventListener("store.update", async (e) => {
        const g = getState({ store: e.detail.store, state: params.state });
        if (params.store && params.state) {
            if (e.detail.action === params.state && e.detail.store === params.store) {
                await fn(g);
            }
        } else if (params.state) {
            if (e.detail.action === params.state) {
                await fn(g);
            }
        }
    });
}

/**
 * initial actions
 * @param {object} store store params
 * @param {array} actions actions list
 * @public
 */
export function initialActions(store, actions) {
    storeValidator(store, storage);
    actions.forEach((item) => {
        store.state(item);
    });
}

/**
 * initial middleware
 * @param {string} store store name
 * @return {object} voids
 * @public
 */
export function middleware(store) {
    const s = store.store;
    return {
    /**
     * Add middleware function
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
 * managing storage and its states
 * @param {object} params store and state params
 * @return {object} voids
 * @public
 */
export function biscuitManager(params) {
    actionValidation(params, states, storage);

    return {
    /**
     * merge state into storage
     * @public
     */
        merge: () => {
            storage[params.store] = {
                ...storage[params.store],
                ...states[`"${params.state}"`][params.store]
            };
        },

        /**
     * pull state into storage
     * @public
     */
        pull: () => {
            states[`"${params.state}"`][params.store] = {
                ...states[`"${params.state}"`][params.store],
                ...storage[params.store]
            };
        },

        /**
     * substitute storage into state
     * @public
     */
        substituteStore: () => {
            storage[params.store] = { ...storage[`"${params.state}"`][params.store] };
        },

        /**
     * substitute storage into state
     * @public
     */
        substituteState: () => {
            states[`"${params.state}"`][params.store] = { ...storage[params.store] };
        },

        /**
     * combine states
     * @param {string} state
     * @public
     */
        mergeState: (state) => {
            states[state][params.store] = {
                ...states[state][params.store],
                ...states[`"${params.state}"`][params.store]
            };
        },

        /**
     * removes the repository and its copies from all states
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
     * remove empty states
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
     * compare two state
     * WARNING: states should not contain methods
     * @param {string} state state name
     * @return {bool}
     * @public
     */
        compareStates: (state) => {
            return compareObject(
                states[`"${params.state}"`][params.store],
                states[`"${state}"`][params.store]
            );
        },

        /**
     * compare state and store
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
     * clone storage and state
     * @param {string} name new name
     * @public
     */
        clone: (name) => {
            storage[name] = { ...storage[params.store] };
            states[`"${params.state}"`][name] = {
                ...states[`"${params.state}"`][params.store]
            };
        },

        /**
     * update state
     * @public
     */
        update: () => {
            dispatch(params, {});
        },

        /**
     * input params
     * @public
     */
        props: params
    };
}

/**
 * add custom debuger
 * @param {string} store store name
 * @param {function} fn debugger callback function
 * @public
 */
export function createDebuger(store, fn) {
    storeValidator(store, storage);
    debugCollection[store] = fn;
}

/**
 * initial biscuit storage
 * @param {object} params storage settings
 * @return {object} action list
 * @public
 */
export function createBiscuit(params) {
    creaateBiscuitValidator(params);
    newStorage(params.store.name, params.store.initial);
    const a = createActionsTo(params.store.name);
    const stateList = {};
    if (params.actions) {
        for (let key in params.actions) {
            stateList[key] = a.state(params.actions[key]);
        }
    }
    if (params.middleware && params.middleware.length > 0) {
        const middle = middleware(a);
        for (let fn of params.middleware) {
            middle.add(fn);
        }
    }

    if (params.debuger) {
        createDebuger(params.store.name, params.debuger);
    }

    return stateList;
}
