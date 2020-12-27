import { dispatch } from "../../store";
import { sandbox, throttle, debounce } from "../../utils";

const boxThrottle = sandbox(throttle);
const boxDebounce = sandbox(debounce);

export const buffers = {
    store: [],
    result: {},
    runtime: []
};

function createChannel(manager, buffer, state, proxy) {
    return {
        manager,
        bufLen: buffer,
        data: proxy,
        state,
        rewrite: () => {
            state.done = 0;
            state.finally = false;
        },
        each: () => proxy.filter((el) => el !== null),
        add: (data) => (proxy[state.done] = data)
    };
}

export function connectNext() {
    buffers.runtime = [];
}

const getStoreBuffer = () => {
    return buffers.store[0];
};

export function getFunctionName(fn) {
    const thenFirst = fn.toString().substr("function ".length);
    const thenLast = thenFirst.substr(0, thenFirst.indexOf("("));

    return thenLast;
}

export const slides = {
    call: async function (fn, props) {
        const fns = [];
        await new Promise((resolve) => {
            for (let fun of fn) {
                queueMicrotask(() => {
                    fns.push(fun(...props));
                    if (fns.length === fn.length) {
                        resolve(fns);
                    }
                });
            }
        });

        if (fns.length === 1) {
            return { data: fns[0], type: "single" };
        } else if (fns.length > 1) {
            return { data: fns, type: "multy" };
        } else {
            console.error("no functions to call");
            return null;
        }
    },

    execute: (fn, args) => {
        return fn(args);
    },

    extract: async (include, fn) => {
        return fn(await include.out);
    },

    extractRace: async (includes, fn) => {
        return Promise.race(includes.map((include) => include.out)).then(fn);
    },

    extractAll: async (includes, fn) => {
        return Promise.all(includes.map((include) => include.out)).then(fn);
    },

    extractToProvide: async (include, action) => {
        dispatch({ store: getStoreBuffer(), state: action }, await include.out);
    },

    extractRaceToProvide: function (includes, action) {
        this.extractRace(includes, (data) => {
            dispatch({ store: getStoreBuffer(), state: action }, data);
        });
    },

    extractAllToProvide: function (includes, action) {
        this.extractAll(includes, (data) => {
            dispatch({ store: getStoreBuffer(), state: action }, data);
        });
    },

    provide: function (action, instance) {
        dispatch({ store: getStoreBuffer(), state: action }, instance);
    },

    chanToProvide: async (action, ch, fn = null, waitLen = 1) => {
        const resp = {
            send: (data) => dispatch({ store: getStoreBuffer(), state: action }, data)
        };
        ch.manager.addEventListener("slide.update.chan", () => {
            if (fn && ch.state.done === waitLen) {
                setTimeout(() => {
                    fn(ch.data, resp);
                }, 0);
            } else if (ch.bufLen === 1) {
                setTimeout(() => {
                    resp.send(ch.data[0]);
                }, 0);
            }
        });
    },

    resolve: async (action) => {
        await dispatch({ store: getStoreBuffer(), state: action }, {});
    },

    all: (fns) => Promise.all(fns),

    race: (fns) => Promise.race(fns),

    throttle: function (fn, timeout, args) {
        boxThrottle.run(this[getFunctionName(fn)], timeout)(...args);
    },

    debounce: function (fn, timeout, args) {
        boxDebounce.run(this[getFunctionName(fn)], timeout)(...args);
    },

    makeChan: (buffer = 1, initial = null) => {
        const state = { done: 0, finally: false };
        const manager = new EventTarget();
        const proxy = new Proxy(new Array(buffer).fill(initial), {
            set: (target, prop, value) => {
                if (state.done !== buffer) {
                    state.done++;
                    state.finally = state.done === buffer;
                    manager.dispatchEvent(new CustomEvent("slide.update.chan"));
                    target[prop] = value;
                } else {
                    console.error("Write error:", "Attempt to write to a filled channel");
                }
            },
            get: (traget, prop) => {
                setTimeout(() => {
                    traget[prop] = null;
                }, 0);
                return traget[prop];
            }
        });
        return createChannel(manager, buffer, state, proxy);
    }
};
