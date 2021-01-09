import { dispatch } from "../../store";
import { emitter } from "../../emitter";
import { sandbox, throttle, debounce } from "../../utils";
import { getRepoBuffer } from "./buffers"
import { getFunctionName, createChannel } from "./utils"

const boxThrottle = sandbox(throttle);
const boxDebounce = sandbox(debounce);

export const slides = {

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

    extractProvide: async (include, action) => {
        dispatch({ repo: getRepoBuffer(), state: action }, await include.out);
    },

    extractRaceProvide: function (includes, action) {
        this.extractRace(includes, (data) => {
            dispatch({ repo: getRepoBuffer(), state: action }, data);
        });
    },

    extractAllProvide: function (includes, action) {
        this.extractAll(includes, (data) => {
            dispatch({ repo: getRepoBuffer(), state: action }, data);
        });
    },

    provide: function (action, instance) {
        dispatch({ repo: getRepoBuffer(), state: action }, instance);
    },

    resolve: async (action) => {
        await dispatch({ repo: getRepoBuffer(), state: action }, {});
    },

    all: (fns) => Promise.all(fns),

    race: (fns) => Promise.race(fns),

    throttle: function (fn, timeout, args) {
        boxThrottle.run(this[getFunctionName(fn)], timeout)(...args);
    },

    debounce: function (fn, timeout, args) {
        boxDebounce.run(this[getFunctionName(fn)], timeout)(...args);
    },

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
        } 

        return null;
    },

    makeChan: () => {
        const id = "chan_" + Date.now();
        const manager = emitter(id);

        const state = { done: 0, finally: false };
        
        let buffer = {
            data: null
        };

        const add = (value) => {
            state.finally = true;
            buffer.data = value;
            manager.dispatchAction(id, {});
            
            return true;
        }

        return createChannel({manager, state, buffer, id, add});
    },

    chanProvide: async (action, ch, fn) => {
        const resp = {
            send: (data) => dispatch({ repo: getRepoBuffer(), state: action }, data)
        };

        ch.manager.subscribeAction(ch.id, () => {
            if (fn) {
                fn(ch.get(), resp);
                return;
            }

            resp.send(ch.get());
        });
    },

    extractChan: (ch, fn) => {
        ch.manager.subscribeAction(ch.id, () => {
            if (ch.state.finally) {
                fn(ch.get());
            }
        });
    }
};
