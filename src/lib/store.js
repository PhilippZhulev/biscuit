/**
 * BISCUIT STORAGE
 * @autor: Zhulev Philipp
 * @version: 1.0.0
 * @license MIT
 */

/** storage instance */
const storage = {};
/** states instance */
const states = {};

/** middlewares list */
const middlewares = {};

/**
 * active middleware functions
 * @param {string} action action name
 * @param {string} key store name
 * @param {object} payload change items
 * @param {object} store
 * @private
 */
function activeMiddlewares(action, key, payload, store) {
  if (middlewares[key]) {
    middlewares[key].forEach((middle) => {
      middle(action, payload, store);
    });
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
        console.error("Getter fields not writable");
      }
    });
  } else {
    console.error("key not found");
  }
}

/**
 * add data by store
 * @param {string} key store key
 * @param {object} instance setter object
 * @public
 */
export function addStorage(key, instance) {
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
  return gettter(storage, { ...storage[key] }, key);
}

/**
 * create state to storage
 * @param {string} key store key
 * @return {object} voids
 * @public
 */
export function createActionTo(key) {
  return {
    /** add state action name
     * @param {string} action action name
     * @public
     */
    state: (action) => {
      states[`"${action}"`] = { [key]: storage[key] };
    },
    /** store key */
    store: key
  };
}

/**
 * get state to storage
 * @param {string} key store key
 * @param {string} action action, state name
 * @return {object}
 * @public
 */
export function getState(key, action) {
  const act = states[`"${action}"`];
  return gettter(act, { ...act[key] }, key);
}

/**
 * upadete storage state
 * @param {object} params store and state
 * @param {object} payload new data
 * @return {object} voids
 * @public
 */
export function dispatch(params, payload) {
  /** init voids */
  const voids = {
    merge: () => {}
  };

  if (`"${params.state}"` in states) {
    const act = states[`"${params.state}"`][params.store];

    /** initial middlewares */
    activeMiddlewares(params.state, params.store, payload, act);

    /** update state data */
    states[`"${params.state}"`][params.store] = {
      ...act,
      ...payload
    };

    /** create update event */
    document.dispatchEvent(
      new CustomEvent("store.update", {
        detail: {
          action: params.state,
          store: params.store,
          payload: states[`"${params.state}"`][params.store]
        }
      })
    );

    /**
     * merge state into storage
     * @public
     */
    voids.merge = () => {
      if (`"${params.state}"` in states) {
        storage[params.store] = act;
      }
    };
  } else {
    console.error("action not found");
  }

  return voids;
}

/**
 * state subscription
 * @param {object} params store and state
 * @param {function} fn callback
 * @public
 */
export function subscribeToState(params, fn) {
  document.addEventListener("store.update", (e) => {
    const g = getState(e.detail.store, params.state);
    if (params.store && params.state) {
      if (e.detail.action === params.state && e.detail.store === params.store) {
        fn(g);
      }
    } else if (params.state) {
      if (e.detail.action === params.state) {
        fn(g);
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
export function storageManager(params) {
  return {
    /**
     * merge state into storage
     * @public
     */
    merge: () => {
      storage[params.store] = {
        ...storage[params.store],
        ...states[params.state][params.store]
      };
    },
    /**
     * substitute storage into state
     * @public
     */
    substituteStore: () => {
      storage[params.store] = storage[params.state][params.store];
    },
    /**
     * substitute storage into state
     * @public
     */
    substituteState: () => {
      states[params.state][params.store] = storage[params.store];
    },
    /**
     * combine states
     * @param {string} state
     * @public
     */
    mergeState: (state) => {
      states[state][params.store] = {
        ...states[state][params.store],
        ...states[params.state][params.store]
      };
    },
    /**
     * removes the repository and its copies from all states
     * @public
     */
    remove: () => {
      delete storage[params.store];
      Object.keys(states[params.state]).forEach((item) => {
        if (item === params.store) {
          delete states[params.state][params.store];
        }
      });
    },
    /**
     * remove empty states
     * @public
     */
    removeEmptyState: () => {
      Object.keys(states[params.state]).forEach((item) => {
        if (Object.keys(item).length === 0) {
          delete states[params.state];
        }
      });
    }
  };
}
