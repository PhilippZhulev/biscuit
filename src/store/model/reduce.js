import { newReduceLayer } from "../../lib/middlewares/reduce-layer";

const reduce = newReduceLayer();

reduce.action("MODEL_INIT", (payload) => {
    if (payload.id) {
        payload.id = payload.id * 2;
    }

    return payload;
});

export default reduce;
