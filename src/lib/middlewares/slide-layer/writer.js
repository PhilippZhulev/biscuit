import { buffers } from "./core";
import { slides } from "./core";

export const writer = {
    provide: (action, instance) => {
        buffers.runtime.push({
            name: "provide",
            type: "writer",
            args: [action, instance],
            out: undefined
        });
    },

    resolve: async (action) => {
        await slides.resolve(action);
    },

    extract: (include, callback) => {
        buffers.runtime.push({
            name: "extract",
            type: "writer",
            args: [include, callback],
            out: undefined
        });
    },

    extractRace: (includes, callback) => {
        buffers.runtime.push({
            name: "extractRace",
            type: "writer",
            args: [includes, callback],
            out: undefined
        });
    },

    extractAll: (includes, callback) => {
        buffers.runtime.push({
            name: "extractAll",
            type: "writer",
            args: [includes, callback],
            out: undefined
        });
    },

    extractToProvide: (action, outer) => {
        buffers.runtime.push({
            name: "extractToProvide",
            type: "writer",
            args: [outer, action],
            out: undefined
        });
    },

    extractAllToProvide: (action, outer) => {
        buffers.runtime.push({
            name: "extractAllToProvide",
            type: "writer",
            args: [outer, action],
            out: undefined
        });
    },

    extractRaceToProvide: (action, outer) => {
        buffers.runtime.push({
            name: "extractRaceToProvide",
            type: "writer",
            args: [outer, action],
            out: undefined
        });
    },

    chanToProvide: (action, chan, fn = null, waitLen = 1) => {
        buffers.runtime.push({
            name: "chanToProvide",
            type: "writer",
            args: [action, chan, fn, waitLen],
            out: undefined
        });
    },

    throttle: (fn, timeout, ...args) => {
        buffers.runtime.push({
            name: "throttle",
            type: "writer",
            args: [fn, timeout, args],
            out: undefined
        });
    },

    debounce: (fn, timeout, ...args) => {
        buffers.runtime.push({
            name: "debounce",
            type: "writer",
            args: [fn, timeout, args],
            out: undefined
        });
    },

    makeChan: slides.makeChan
};
