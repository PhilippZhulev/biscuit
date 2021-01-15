import { dispatch } from "../../store";
import { emitter } from "../../emitter";
import { sandbox, throttle, debounce } from "../../utils";
import { getRepoBuffer } from "./buffers"
import { getFunctionName, createChannel } from "./utils"

const boxThrottle = sandbox(throttle);
const boxDebounce = sandbox(debounce);

export const slides = {
    /** 
     * This method returns the task
     * @param {function} fn
     * @param {any} args
     */
    execute: (fn, args) => {
        return fn(args);
    },

    /**
     * Retrieving data from a task
     * @param {object} include task
     * @param {function} fn callback function
     */
    extract: async (include, fn) => {
        return fn(await include.out);
    },

    /**
     * Extracting data from the task that won the race
     * @param {object} include task
     * @param {function} fn callback function
     */
    extractRace: async (includes, fn) => {
        return Promise.race(includes.map((include) => include.out)).then(fn);
    },

    /**
     * Retrieving data from tasks after they are completed
     * @param {object} include task
     * @param {function} fn callback function
     */
    extractAll: async (includes, fn) => {
        return Promise.all(includes.map((include) => include.out)).then(fn);
    },

    /**
     * Retrieving data from a task and sending it to a state
     * @param {object} include task
     * @param {function} action state name
     */
    extractProvide: async (include, action) => {
        dispatch({ repo: getRepoBuffer(), state: action }, await include.out);
    },

    /**
     * Retrieving data from race-winning tasks after
     * they are completed and sending to the state
     * @param {object} include task
     * @param {function} action state name
     */
    extractRaceProvide: function (includes, action) {
        this.extractRace(includes, (data) => {
            dispatch({ repo: getRepoBuffer(), state: action }, data);
        });
    },

    /**
     * Retrieving data from tasks after they 
     * are completed and sending it to the state
     * @param {object} include task
     * @param {function} action state name
     */
    extractAllProvide: function (includes, action) {
        this.extractAll(includes, (data) => {
            dispatch({ repo: getRepoBuffer(), state: action }, data);
        });
    },

    /** 
     * Sending will take place
     * @param {object} include task
     * @param {function} action state name
     */
    provide: function (action, instance) {
        dispatch({ repo: getRepoBuffer(), state: action }, instance);
    },

    /** 
     * Сalling a state change 
     * @param {function} action
    */
    resolve: async (action) => {
        await dispatch({ repo: getRepoBuffer(), state: action }, {});
    },

    /** 
     * Running multiple "read.call" functions
     * @param {array[function]} fns
    */
    all: (fns) => Promise.all(fns),

    /** 
    * Running multiple "read.call" functions
    * @param {array[function]} fns
    */
    race: (fns) => Promise.race(fns),

    /** 
    * Runs the function once in the specified time interval
    * @param {function} fn target function
    * @param {number} timeout delay time
    * @param {array[any]} args arguments
    */
    throttle: function (fn, timeout, args) {
        boxThrottle.run(this[getFunctionName(fn)], timeout)(...args);
    },

    /** 
    * Starts the function with a delay for the specified time
    * @param {function} fn target function
    * @param {number} timeout delay time
    * @param {array[any]} args arguments
    */
    debounce: function (fn, timeout, args) {
        boxDebounce.run(this[getFunctionName(fn)], timeout)(...args);
    },

    /** 
    * Starts the function with a delay for the specified time
    * @param {function} fn target function
    * @param {number} timeout delay time
    * @param {array[any]} args arguments
    */
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

    /**
     * method for creating a channel*
     * @return {object} channel
    */
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
                fn(ch.get(), resp.send);
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
