import { buffers } from "./core";

export const writer = {
  provide: (action, instance) => {
    buffers.runtime["provide"] = {
      type: "provide",
      args: [action, instance]
    };
  }
};
