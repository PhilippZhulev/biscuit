import { newRepo, createActionsTo, middleware } from "../../lib/store";
import slide from "./slider";

/** init new storage */
newRepo("model", { id: 0, dot: "", data: null });

/** bind new storage to actions */
const model = createActionsTo("model");

/** example middleware */
const middle = middleware(model);

middle.add((action, payload, state) => {
    if (typeof payload.id === "number") {
        console.log(action);
        state.dot += ".";
    }
});

middle.add(slide.connect);

export default model;
