import React from "react";
import ReactDOM from "react-dom";

import "./styles.css";

import { createBiscuit } from "./lib/store";
import { observer, useSubscribe } from "./lib/react-store";

const { counterAdd } = createBiscuit({
  store: {
    name: "counter",
    initial: { value: 0 }
  },
  actions: {
    counterAdd: "COUNTER_ADD"
  }
});

const Counter = () => {
  const [count, setCount] = useSubscribe(counterAdd);

  const handleCounterStart = () => {
    setCount({ value: count.value + 1 });
  };

  return <button onClick={handleCounterStart}>Add</button>;
};

const App = observer(({ value }) => {
  return (
    <div className="counter">
      <p>counter: {value}</p>
    </div>
  );
}, counterAdd);

const rootElement = document.getElementById("root");
ReactDOM.render(
  <React.StrictMode>
    {/* <button onClick={handleMerge}>слить в храилище</button>
    <button onClick={handlePull}>залить в состояние</button>
    <button onClick={handleRemove}>удалить хранилище</button>
    <ExempleFirst />
    <ExempleTwo />
    <ExempleTree /> */}
    <App />
    <Counter />
  </React.StrictMode>,
  rootElement
);
