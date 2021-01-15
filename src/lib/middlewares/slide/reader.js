import { slides } from "./core";
import { buffers } from "./buffers";

/* Reader contains methods for retrieving data. **/
export const reader = {
    /**
     * An asynchronous function call with the return result
     * you can call several functions
     * @param {args[function]} fn target functions
     * @public
     */
    call: (...fn) => {
        return {
            /**
             * Arguments for the function
             * @param {any} props arguments
             * @public
             */
            args: async (...props) => {
                const result = await slides.call(fn, props);

                if (result.type === "multy") {
                    const data = [];
                    for (let i = 0; i < result.data.length; i++) {
                        data.push(await result.data[i]);
                    }

                    return data;
                }

                return result.data;
            }
        };
    },

    /**
     * Stop execution for the specified time period
     * @param {number} count delay time to milliseconds
     * @public
     */
    delay: async (count) => {
        await new Promise((resolve) => {
            setTimeout(() => {
                resolve();
            }, count);
        });
    },

    /**
     * This method is similar to the "read.call". 
     * The difference is that this method performs 
     * an operation on the child thread and returns the task.
     * To extract data from a task, use the "read.extract" method.
     * @param {args[function]} fn method to run
     * @param {any} args arguments
     * @return {object} task
     * @public
     */
    execute: (fn, ...args) => {
        buffers.runtime.push({
            name: "execute",
            type: "reader",
            args: [fn, args],
            out: undefined
        });

        return buffers.runtime[buffers.runtime.length - 1];
    },

    
    /**
     * This method is executed in the main thread. 
     * Accepts multiple "read.execute" methods. 
     * Creates a task buffer that is subsequently 
     * executed via " read.extractAll"
     * @param {array[functions]} fns execute functions
     * @return {array} tasks
     * @public
     */
    executeAll: function (...fns) {
        const result = [];
        for (let fn of fns) {
            result.push(fn);
        }

        return result;
    },

    /**
     * This method retrieves data from 
     * the task created by the " read.execute".
     * @param {object} include read.execute task
     * @param {function} callback A callback function that 
     * returns data extracted from the task.
    */
    extract: (include, callback) => {
        buffers.runtime.push({
            name: "extract",
            type: "reader",
            args: [include, callback],
            out: undefined
        });
    },

    /**
     * This method extracts data from the task that won the race. 
     * The task pool is created using the "read.executeAll".
     * @param {array[object]} includes task array
     * @param {function} callback A callback function that 
     * returns data extracted from the task.
    */
    extractRace: (includes, callback) => {
        buffers.runtime.push({
            name: "extractRace",
            type: "reader",
            args: [includes, callback],
            out: undefined
        });
    },

    /**
     * This method retrieves data from the task pool. 
     * The task pool is created using the " read.executeAll".
     * @param {array} includes task array
     * @param {function} callback A callback function that 
     * returns data extracted from the task.
    */
    extractAll: (includes, callback) => {
        buffers.runtime.push({
            name: "extractAll",
            type: "reader",
            args: [includes, callback],
            out: undefined
        });
    },

    /**
     * This method retrieves the channel data
     * @param {object} includes channel variable
     * @param {function} callback A callback function that 
     * returns data extracted from the channel.
    */
    extractChan: (ch, fn) => {
        buffers.runtime.push({
            name: "extractChan",
            type: "reader",
            args: [ch, fn],
            out: undefined
        });
    },

    /**
     * Creates a throttled function that only invokes func 
     * at most once per every wait milliseconds. 
     * @param {function} fn target function
     * @param {number} timeout wait time by milliseconds
     * @param {args[any]} args arguments
     * @public
     * 
    */
    throttle: (fn, timeout, ...args) => {
        buffers.runtime.push({
            name: "throttle",
            type: "reader",
            args: [fn, timeout, args],
            out: undefined
        });
    },

    /**
     * Creates a throttled function that only invokes func 
     * at most once per every wait milliseconds. 
     * @param {function} fn target function
     * @param {number} timeout wait time by milliseconds
     * @param {args[any]} args arguments
     * @public
     * 
    */
    debounce: (fn, timeout, ...args) => {
        buffers.runtime.push({
            name: "debounce",
            type: "reader",
            args: [fn, timeout, args],
            out: undefined
        });
    },

    all: slides.all,
    race: slides.race
};
