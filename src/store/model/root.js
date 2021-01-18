import { createStore } from "../../lib/index";
import slide from "./slider";
import adapter from "./adapter";
import { newAdapter } from "../../lib/middlewares/adapter";


const modelStore = createStore({
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

export const { modelInit, modelSuccess } = modelStore.actions

const adapt = newAdapter();

// As you can see the adapters are very easy to read. 
// Just call the action method from the variable with the adapter instance, 
// specify the name of the action as the first argument, 
// and pass the callback function as the second.
adapt.action("COUNTER/TIMER", (payload, state) => {
    // Next, just return the new object configuration
    return { ...payload, value: state.value + 1 };
});

// You should also know that Biscuit out of the box is asynchronous. 
// this means that you can use asynchronous capabilities in the adapter.
// Just pass the data through calling the third argument instead of "return".
adapt.action("COUNTER/READY", (payload, state, send) => {
    // The callback function provides you with three arguments:
    // - The first is the payload, 
    // - The second is the store data, 
    // - The third is the function returned to send changes.
    const value = state.value;
    setTimeout(() => {
        send({ ...payload, value: state.value - value });
    }, 100)
});


const counterStore = createStore({
    repo: {
        name: "counter",
        initial: { value: 0, ready: false }
    },
    states: {
        counterTimer: "COUNTER/TIMER",
        counterReady: "COUNTER/READY"
    },
    middleware: [adapt.connect]
});

export const { store } = counterStore;
export const { counterTimer, counterReady } = counterStore.actions;

// store.subscribe((state) => {
//     console.log(state.value);
// });

// setInterval(() => {
//     counterTimer.dispatch();
// }, 1000);

// setInterval(() => {
//     counterReady.dispatch().after((state) => {
//         console.log("Был произведен сброс до:", state.value);
//     });
// }, 5000);

