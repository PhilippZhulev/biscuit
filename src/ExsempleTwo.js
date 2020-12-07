import React from "react";
import { useSubscribeToState } from "./lib/react-store";
import { modelInit, modelSuccess } from "./store/model/actions";

export default function ExempleTwo() {
  /** hook subscriber the state from store */
  const [model, setModel] = useSubscribeToState(modelInit);
  const [success] = useSubscribeToState(modelSuccess);

  const handleMutable = () => {
    setModel({ data: "hooks success!!!" });
  };

  return (
    <div className="App">
      <h2>TEST HOOKS: {model.data}</h2>
      <p>id now: {model.id}</p>
      <button onClick={handleMutable}>Клик</button>
      <h3>fetch: {success.data?.title}</h3>
    </div>
  );
}
