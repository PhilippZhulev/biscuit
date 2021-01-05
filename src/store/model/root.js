import { createBiscuit } from "../../lib/index";
import slide from "./slider";
import reduce from "./reduce";

export const { modelInit, modelSuccess } = createBiscuit({
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
        reduce.connect,
        slide.connect
    ]
});
