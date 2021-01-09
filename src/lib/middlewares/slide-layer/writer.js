import { buffers } from "./buffers";
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

    extractProvide: (action, outer) => {
        buffers.runtime.push({
            name: "extractProvide",
            type: "writer",
            args: [outer, action],
            out: undefined
        });
    },

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

    extractChan: (ch, fn) => {
        buffers.runtime.push({
            name: "extractChan",
            type: "writer",
            args: [ch, fn],
            out: undefined
        });
    },

    makeChan: slides.makeChan
};
