import React from "react";
import { observer } from "./lib/react-store";
import { modelInit } from "./store/model/root";

export default observer(
  (props) => {
    return (
      <div className="App">
        <h2>TEST OBSRVER: {props.id}</h2>
      </div>
    );
  },
  [modelInit]
);
