import { createBiscuit } from "../../lib/store";
import slide from "./slider";
import reduce from "./reduce";

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
        (context) => {
            if (typeof context.payload.id === "number") {
                context.state.dot += ".";
            }
        },
        reduce.connect,
        slide.connect
    ]
});
