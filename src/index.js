import React from "react";
import ReactDOM from "react-dom";
import model from "./store/model/init";
import modelActions from "./store/model/actions";
import { initialActions } from "./lib/store";

import ExempleFirst from "./ExempleFirst";
import ExempleTwo from "./ExsempleTwo";

/** init bind actions to store */
initialActions(model, modelActions);

const rootElement = document.getElementById("root");
ReactDOM.render(
  <React.StrictMode>
    <ExempleFirst />
    <ExempleTwo />
  </React.StrictMode>,
  rootElement
);
