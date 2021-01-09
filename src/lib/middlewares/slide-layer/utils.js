import {buffers} from "./buffers"

export function getFunctionName(fn) {
    const thenFirst = fn.toString().substr("function ".length);
    const thenLast = thenFirst.substr(0, thenFirst.indexOf("("));

    return thenLast;
}

export function connectNext() {
    buffers.runtime = [];
}

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