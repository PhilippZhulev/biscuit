import React from "react";
import ReactDOM from "react-dom";
import { observer, useDispatch } from "./lib//react-store";
import { createStore } from "./lib/index";
import { newAdapter } from "./lib/middlewares/adapter";

const adapter = newAdapter();

adapter.action("COUNTER/TIMER", (payload, state) => {
    return { ...payload, value: state.value + 1 };
});

adapter.action("COUNTER/READY", (payload, state, send) => {
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
        counterAdd: "COUNTER/TIMER",
        counterClear: "COUNTER/READY"
    },
    middleware: [adapter.connect]
});

const { counterAdd, counterClear } = counterStore.actions;

const App = observer(
    ({ value }) => {
        return (
            <div className="counter">
                <p>output: {value}</p>
            </div>
        );
    },
    [counterAdd, counterClear]
);

const Counter = () => {
    const [add, clear] = useDispatch(
        counterAdd, 
        counterClear
    );

    return (
        <div>
            <button onClick={() => add().after((s) => console.log(s))}>Add</ button>
            <button onClick={clear}>Clear</ button>
        </ div>
    )
}

ReactDOM.render(
    <React.Fragment>
        <Counter />
        <App />
    </ React.Fragment>,
    document.getElementById("root")
);
