import { buffers } from "./buffers";
import { slides } from "./core";

/** Set of methods for writing */
export const writer = {

    /**
     * This method creates a state change task 
     * similar to the built in dispatch methodThis 
     * method creates a state change task similar 
     * to the built in "dispatch" method
     * @param {string} action state name
     * @param {object} instance data object
     */
    provide: (action, instance) => {
        buffers.runtime.push({
            name: "provide",
            type: "writer",
            args: [action, instance],
            out: undefined
        });
    },

    /**
     * This method creates a task to call a state change event, 
     * without changing the data.
     * @param {string} action state name
     */
    resolve: async (action) => {
        await slides.resolve(action);
    },

    /**
     * This method creates a task to change the state, 
     * the second parameter takes the task from the "read.execute" method 
     * and retrieves data from it.
     * @param {string} action state name
     * @param {object} outer execute task
     */
    extractProvide: (action, outer) => {
        buffers.runtime.push({
            name: "extractProvide",
            type: "writer",
            args: [outer, action],
            out: undefined
        });
    },

    /**
     * This method creates a task to change the state, 
     * the second parameter takes an array of tasks 
     * from the " read.executeall" and retrieves data when it is ready.
     * @param {string} action state name
     * @param {array[object]} outers execute tasks
     */
    extractAllProvide: (action, outers) => {
        buffers.runtime.push({
            name: "extractAllProvide",
            type: "writer",
            args: [outers, action],
            out: undefined
        });
    },

    /**
     * This method creates a task to change the state, 
     * the second parameter takes an array of tasks from the " 
     * read.executeall" and retrieves data from the task that won the race.
     * @param {string} action state name
     * @param {array[object]} outers execute tasks
    */
    extractRaceProvide: (action, outer) => {
        buffers.runtime.push({
            name: "extractRaceProvide",
            type: "writer",
            args: [outer, action],
            out: undefined
        });
    },

    /**
     * This method creates a task to change the state, 
     * the second parameter accepts the channel and retrieves data from it. 
     * The third parameter can specify a callback function
     * that will return the channel data and the sending method, 
     * in this function you can parse the received data for example.
     * @param {string} action state name
     * @param {object} chan channel
     * @param {function(data, send)} fn callback function
     */
    chanProvide: (action, chan, fn = null) => {
        buffers.runtime.push({
            name: "chanProvide",
            type: "writer",
            args: [action, chan, fn],
            out: undefined
        });
    },

    /** create chanel */
    makeChan: slides.makeChan
};
