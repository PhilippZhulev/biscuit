import { reduceLayer } from "../../lib/middlewares/reduce-layer";

const reduce = reduceLayer();

reduce.action("MODEL_INIT", (payload) => {
  if (payload.id) {
    payload.id = payload.id * 10;
  }

  return payload;
});

export default reduce;
