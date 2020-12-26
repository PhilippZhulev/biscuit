import React from "react";
import ReactDOM from "react-dom";
import { observer, useSubscribeToState } from "./lib/react-store";
import { counterAdd, counterClear } from "./store/root.js";

import { createBiscuit } from "@biscuit-store/core";

const { counterAdd, counterSuccess } = createBiscuit({
  store: {
    name: "counter",
    initial: { count: 0 }
  },
  actions: {
    counterInit: "COUNTER_ADD",
    counterSuccess: "COUNTER_SUCCESS"
  }
});

const Counter = () => {
  const [count, setCount] = useSubscribeToState(counterAdd);

  const handleClear = () => setCount({ counter: count + 1 });

  return <button onClick={handleClear}>clear</button>;
};

const App = observer(
  ({ count }) => {
    return (
      <div className="counter">
        <p>counter: {count}</p>
        <Counter />
      </div>
    );
  },
  [counterAdd, counterClear]
);

ReactDOM.render(<App />, document.getElementById("root"));
