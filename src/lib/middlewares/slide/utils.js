import {buffers} from "./buffers"

/**
 * to obtain the name of the function
 *  @param {function} fn
*/
export function getFunctionName(fn) {
    const thenFirst = fn.toString().substr("function ".length);
    const thenLast = thenFirst.substr(0, thenFirst.indexOf("("));

    return thenLast;
}

/**
 * Сlearing the buffer of the scheduler when you run the next middleware
*/
export function connectNext() {
    buffers.runtime = [];
}

/**
 * Auxiliary function for creating a channel
 * @param {object}
*/
export function createChannel({manager, state, buffer, id, add}) {
    return {
        manager,
        id,
        state,
        add,
        get: () => {
            const res = { ...buffer.data };
            state.finally = false;
            buffer.data = null;

            return res
        }
    };
}