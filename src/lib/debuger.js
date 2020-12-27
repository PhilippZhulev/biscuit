import { emitters } from "./emittes";

/** debug messages */
const messages = {
    debugNotFound: "biscuit failed: debug type not found."
};

/** debuger list */
export const debugCollection = {};

/** debug listener */
emitters.storeEmitter.addEventListener("store.handle.debug", function (e) {
    if (!debugCollection.length) {
        switch (e.detail.type) {
        case "error":
            console.error(e.detail.data.message);
            break;
        case "warn":
            console.warn(e.detail.data);
            break;
        default:
            console.error(messages.debugNotFound);
        }
        return;
    }

    for (let key in debugCollection) {
        try {
            debugCollection[key](e.detail);
        } catch (e) {
            console.error(e);
        }
    }
});
