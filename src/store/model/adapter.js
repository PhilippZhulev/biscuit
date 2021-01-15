import { newAdapter } from "../../lib/middlewares/adapter";

const adapter = newAdapter();

adapter.action("MODEL_INIT", (payload) => {
    if (payload.id) {
        payload.id = payload.id * 2;
    }

    return payload;
});

export default adapter;
