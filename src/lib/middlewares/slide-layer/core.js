import { dispatch } from "../../store";

export const buffers = {
  store: { list: [], index: 0 },
  result: {},
  runtime: {}
};

export function connectNext(key) {
  buffers.runtime = {};
  buffers.store.list.push(key);
  buffers.store.index++;
}

export const slides = {
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
    } else {
      console.error("no functions to call");
      return null;
    }
  },

  provide: function (action, instance) {
    dispatch(
      { store: buffers.store.list[buffers.store.index - 1], state: action },
      instance
    );
  }
};
