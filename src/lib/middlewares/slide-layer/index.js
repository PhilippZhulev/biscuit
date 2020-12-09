import { connectNext } from "./core";
import { runtime } from "./runtime";

export function slideLayer() {
  const connectors = [];

  return {
    connect: (state, payload, _, key) => {
      for (let connector of connectors) {
        if (connector.act === state) {
          runtime(connector, payload);
        }
      }
      connectNext(key);
    },

    take: (act, fn) => {
      if (typeof act !== "string") {
        console.error("action must be of type string");
        return;
      }

      if (typeof fn !== "function") {
        console.error("generator must be of function");
        return;
      }

      connectors.push({ act, fn });
    }
  };
}
