import React from "react";
import { useSubscribeToState } from "./lib/react-store";

export default function ExempleTwo() {
  /** hook subscriber the state from store */
  const [model, setModel] = useSubscribeToState({
    state: "MODEL_INIT",
    store: "model"
  });

  const handleMutable = () => {
    setModel({ data: "hooks success!!!" });
  };

  return (
    <div className="App">
      <h2>TEST HOOKS: {model.data}</h2>
      <p>id now: {model.id}</p>
      <button onClick={handleMutable}>Клик</button>
    </div>
  );
}
