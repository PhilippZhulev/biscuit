import { slides, buffers } from "./core";
import { reader } from "./reader";
import { writer } from "./writer";

/**
 * create generators from the method buffer
 * @param {object} rb runtime buffer
 * @private
 */
const generator = function* (rb) {
  for (let key in rb) {
    yield slides[key](...rb[key].args);
  }
};

/**
 * algorithm for asynchronous method launch
 * @param {object} connector connect instance
 * @private
 */
export async function runtime(connector, payload) {
  await connector.fn({ ...reader, payload }, writer);
  const runtime = generator(buffers.runtime);
  const result = { value: null, done: false };

  while (!result.done) {
    const gen = runtime.next(result.value);
    result.done = gen.done;
  }
}