import React, { useEffect, useState } from "react";
import "./styles.css";
import { getState, dispatch, subscribeToState } from "./lib/store";
import subscribe from "./lib/react-store";
import { modelInit } from "./store/model/root";

/** subscribe to state */
subscribeToState(modelInit, (payload) => {
  console.log(payload);
});

function ExempleFirst({ id, dot, dispatchInitModel }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (count > 0) {
      /** update state */
      dispatchInitModel({ id: count });
    }
  }, [count, dispatchInitModel]);

  const handleCount = () => {
    setCount(count + 1);
  };

  return (
    <div className="App">
      <h1>TEST STORAGE</h1>
      <h2>id: {id}</h2>
      <button onClick={handleCount}>Клик</button>
      <div>{dot}</div>
    </div>
  );
}

/** state params to props */
const stateToProps = () => {
  const model = getState(modelInit);
  return {
    id: model.id,
    dot: model.dot
  };
};

/** dispatch to props */
const dispatchToProps = {
  dispatchInitModel: (params) => dispatch(modelInit, params)
};

/** subscribe component to store */
export default subscribe(stateToProps, dispatchToProps)(ExempleFirst);
