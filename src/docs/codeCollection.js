
export const startReactCodeInit = 
`
import { createStore } from "@biscuit-store/core";

export const { counterAdd } = createStore({
  repo: {
    name: "counter",
    initial: { value: 0 }
  },
  actions: {
    counterAdd: "COUNTER_ADD"
  }
});
`

export const startReactCodeCount = 
`
import React from "react";
import { useSubscribe } from "@biscuit-store/react";
import { counterAdd } from "./store/root";

export const Counter = () => {
  const [count, dispatchCount] = useSubscribe(counterAdd);
  const handleAdd = () => {
    dispatchCount({ value: count.value + 1 });
  };

  return <button onClick={handleAdd}>Add</button>;
};
`

export const startReactCodeObserver = 
`
import React from "react";
import { observer } from "@biscuit-store/react";
import { counterAdd } from "./store/root";

const CounterOutput = observer(({ value }) => {
  return (
    <div className="counter">
      <p>counter: {value}</p>
    </div>
  );
}, counterAdd);
`