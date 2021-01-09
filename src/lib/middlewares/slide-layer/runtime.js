import { slides } from "./core";
import { reader } from "./reader";
import { writer } from "./writer";
import { connectNext } from "./utils"
import { buffers } from "./buffers"


/**
 * create generators from the method buffer
 * @param {object} rb runtime buffer
 * @private
 */
const generator = function* (rb) {
    for (let key in rb) {
        rb[key].out = yield slides[rb[key].name](...rb[key].args);
    }
};

/**
 * algorithm for asynchronous method launch
 * @param {object} connector connect instance
 * @private
 */
export async function runtime(connector, payload, key) {
    buffers.repo[0] = key;

    await connector.fn({ ...reader, payload }, writer);
    const runtime = generator(buffers.runtime);
    const result = { value: null, done: false };

    while (!result.done) {
        const gen = runtime.next(result.value);
        result.value = gen.value;
        result.done = gen.done;
    }
    connectNext();
}
