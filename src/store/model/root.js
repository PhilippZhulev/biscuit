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
  middleware: [
    (action, payload, state) => {
      if (typeof payload.id === "number") {
        state.dot += ".";
      }
    },
    slide.connect
  ]
});
