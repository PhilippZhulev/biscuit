import { createBiscuit } from "../../lib/store";
import slide from "./slider";

export const { modelInit, modelSuccess } = createBiscuit({
  store: {
    name: "model",
    initial: { id: 0, dot: "", data: null }
  },
  actions: {
    modelInit: "MODEL_INIT",
    modelSuccess: "MODEL_SUCCESS"
  },
  middlewares: [
    (action, payload, state) => {
      if (typeof payload.id === "number") {
        console.log(action);
        state.dot += ".";
      }
    },
    slide.connect
  ]
});
