import { dispatch } from "../../store";

const storeBuffer = { list: [], index: 0 };

export function slideLayer() {
  const connectors = [];

  return {
    connect: (state, payload, _, key) => {
      connectors.forEach((connector) => {
        if (connector.act === state) {
          const generator = connector.generator({ ...payload });
          const result = { value: null, done: false };

          (async function () {
            while (!result.done) {
              const gen = generator.next(result.value);
              const res = await gen.value;

              result.done = gen.done;

              if (typeof res === "object" && res._slideLayerMulty) {
                result.value = [];
                for (let i = 0; i < res.list.length; i++) {
                  result.value[i] = await res.list[i];
                }
              } else {
                result.value = res;
              }
            }
          })();
        }
      });
      storeBuffer.list.push(key);
      storeBuffer.index++;
    },
    take: (act, generator) => {
      if (typeof act !== "string") {
        console.error("action must be of type string");
        return;
      }

      if (typeof generator !== "function") {
        console.error("generator must be of function");
        return;
      }

      connectors.push({ act, generator });
    }
  };
}

export function call(...fn) {
  const fns = [];
  return {
    args: (...props) => {
      return new Promise((resolve) => {
        for (let fun of fn) {
          queueMicrotask(() => {
            fns.push(fun(...props));
            if (fns.length === fn.length) {
              resolve(fns);
            }
          });
        }
      }).then((res) => {
        if (fns.length === 1) {
          return fns[0];
        } else if (fns.length > 1) {
          return { list: fns, _slideLayerMulty: true };
        } else {
          console.error("no functions to call");
          return null;
        }
      });
    }
  };
}

export function provide(action, instance) {
  dispatch(
    { store: storeBuffer.list[storeBuffer.index - 1], state: action },
    instance
  );
}
