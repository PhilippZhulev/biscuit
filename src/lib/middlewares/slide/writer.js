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
     * the second parameter takes the task from the "execute" method 
     * and retrieves data from it.
     * @param {string} action state name
     * @param {string} outer execute task
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
     * 
     */
    extractAllProvide: (action, outer) => {
        buffers.runtime.push({
            name: "extractAllProvide",
            type: "writer",
            args: [outer, action],
            out: undefined
        });
    },

    extractRaceProvide: (action, outer) => {
        buffers.runtime.push({
            name: "extractRaceProvide",
            type: "writer",
            args: [outer, action],
            out: undefined
        });
    },

    chanProvide: (action, chan, fn = null, waitLen = 1) => {
        buffers.runtime.push({
            name: "chanProvide",
            type: "writer",
            args: [action, chan, fn, waitLen],
            out: undefined
        });
    },

    makeChan: slides.makeChan
};
