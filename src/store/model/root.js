import { createStore } from "../../lib/index";
import slide from "./slider";
import adapter from "./adapter";

export const { modelInit, modelSuccess } = createStore({
    repo: {
        name: "model",
        initial: { id: 0, dot: "", data: null }
    },
    states: {
        modelInit: "MODEL_INIT",
        modelSuccess: "MODEL_SUCCESS"
    },
    middleware: [
        (context) => {
            if (typeof context.payload.id === "number") {
                context.state.dot += ".";
            }
        },
        adapter.connect,
        slide.connect
    ]
});
