import React from "react";
import ReactDOM from "react-dom";

import ExempleFirst from "./ExempleFirst";
import ExempleTwo from "./ExsempleTwo";

import modelStateCollection, { modelInit } from "./store/model/actions";
import {
  combineStateCollections,
  storageManager,
  subscribeToState
} from "./lib/store";

combineStateCollections(modelStateCollection);

const manager = storageManager(modelInit);

subscribeToState(manager.props, (payload) => {
  console.log("store === state", manager.compareWithState());
});

const handleMerge = () => {
  manager.merge();
  manager.update();
};

const handlePull = () => {
  manager.pull();
  manager.update();
};

const handleRemove = () => {
  manager.remove();
  manager.update();
};

const rootElement = document.getElementById("root");
ReactDOM.render(
  <React.StrictMode>
    <button onClick={handleMerge}>слить в храилище</button>
    <button onClick={handlePull}>залить в состояние</button>
    <button onClick={handleRemove}>удалить хранилище</button>
    <ExempleFirst />
    <ExempleTwo />
  </React.StrictMode>,
  rootElement
);
