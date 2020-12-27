import React, { useState, useRef, useEffect, useCallback } from "react";
import Highlight from "react-highlight-updated";

export default function LayerTop() {
  const frameRef = useRef(null);
  const [state, setState] = useState({ view: 0, category: 0, lines: 0 });

  useEffect(() => {
    if (frameRef.current) {
      const h = frameRef.current.scrollHeight;
      setState({
        ...state,
        lines: Math.ceil(h / 18)
      });
    }
  }, [frameRef.current]);

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
          <div ref={frameRef} className={"codeFlexWrapper"}>
            <section className={"codeLines"}>
              {new Array(state.lines).fill(0).map((_, i) => {
                return <div key={i}>{i}</div>;
              })}
            </section>
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
import { useSubscribe } from "@biscuit-store/react";
import { counterAdd } from "./store/root";

export const Counter = () => {
  const [count, dispatchCount] = useSubscribe(counterAdd);
  const handleAdd = () => {
    dispatchCount({ value: count.value + 1 });
  };

  return <button onClick={handleAdd}>Add</button>;
};

              `}
                </Highlight>
              ) : null}
              {state.view === 2 && state.category === 0 ? (
                <Highlight language="javascript">
                  {`
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

              `}
                </Highlight>
              ) : null}
            </pre>
          </div>
        </section>
        <section className={"codeProviderRightPanel"}>
          <div onClick={() => handelCheckPreviev("view", 0)}>
            <span>store/root.js</span>
          </div>
          <div onClick={() => handelCheckPreviev("view", 1)}>
            <span>Counter.jsx</span>
          </div>
          <div onClick={() => handelCheckPreviev("view", 2)}>
            <span>App.jsx</span>
          </div>
        </section>
      </div>
    </div>
  );
}
