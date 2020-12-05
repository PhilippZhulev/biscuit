import { newStorage, createActionTo, middleware } from "../../lib/store";

/** init new storage */
newStorage("model", { id: 0, dot: "", data: null });

/** bind new storage to actions */
const model = createActionTo("model");

/** example middleware */
middleware(model).add((action, payload, state) => {
  if (typeof payload.id === "number") {
    console.log(action);
    state.dot += ".";
  }
});

export default model;
