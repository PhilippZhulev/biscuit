import React, { useState } from "react";
import Highlight from "react-highlight-updated";

export default function LayerTop() {
  const [state, setState] = useState({ view: 0, category: 0 });

  const handelCheckPreviev = (key, index) => {
    setState({ ...state, [key]: index });
  };

  return (
    <div className={"layer"}>
      <div className={"codeProvider"}>
        <section className={"codeProviderPreview"}>
          <div className={"codeProviderTopPanel"}>
            <div>
              <span>javascript + react</span>
            </div>
            <div>
              <span>reduce</span>
            </div>
            <div>
              <span>slide</span>
            </div>
          </div>
          <pre>
            {state.view === 0 && state.category === 0 ? (
              <Highlight language="javascript">
                {`
import { createBiscuit } from "@biscuit-store/core";

export const { counterAdd } = createBiscuit({
  store: {
    name: "counter",
    initial: { value: 0 }
  },
  actions: {
    counterAdd: "COUNTER_ADD"
  }
});
                `}
              </Highlight>
            ) : null}
            {state.view === 1 && state.category === 0 ? (
              <Highlight language="javascript">
                {`
import React from "react";
import { observer} from "@biscuit-store/core";
import { counterAdd } from "./store/root";

const App = observer(({ value }) => {
  return (
    <div className="counter">
      <p>counter: {value}</p>
      <Counter />
    </div>
  );
}, counterAdd);

          `}
              </Highlight>
            ) : null}
            {state.view === 2 && state.category === 0 ? (
              <Highlight language="javascript">
                {`
import React, { useEffect } from "react";
import { useSubscribeToState } from "@biscuit-store/core";
import { counterAdd } from "./store/root";

export default function Counter() {
  const [count, setCount] = useSubscribe(counterAdd);

  const handleCounterStart = () => {
    setCount({ value: count.value + 1 });
  };

  return <button onClick={handleCounterStart}>Add</button>;
};

          `}
              </Highlight>
            ) : null}
          </pre>
        </section>
        <section className={"codeProviderRightPanel"}>
          <div onClick={() => handelCheckPreviev("view", 0)}>
            <span>store/root.js</span>
          </div>
          <div onClick={() => handelCheckPreviev("view", 1)}>
            <span>App.jsx</span>
          </div>
          <div onClick={() => handelCheckPreviev("view", 2)}>
            <span>Counter.jsx</span>
          </div>
        </section>
      </div>
    </div>
  );
}
