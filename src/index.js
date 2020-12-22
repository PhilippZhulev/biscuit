import React from "react";
import ReactDOM from "react-dom";

// import ExempleFirst from "./ExempleFirst";
// import ExempleTwo from "./ExempleTwo";
// import ExempleTree from "./ExempleTree";
import "./styles.css";
import { modelInit } from "./store/model/root";
import {
  //combineStateCollections,
  storageManager,
  subscribeToState
} from "./lib/store";
import App from "./App";

//combineStateCollections(modelStateCollection);

const manager = storageManager(modelInit);

subscribeToState(manager.props, (payload) => {
  console.log("store === state", manager.compareWithState());
});

// const handleMerge = () => {
//   manager.merge();
//   manager.update();
// };

// const handlePull = () => {
//   manager.pull();
//   manager.update();
// };

// const handleRemove = () => {
//   manager.remove();
//   manager.update();
// };

const rootElement = document.getElementById("root");
ReactDOM.render(
  <React.StrictMode>
    {/* <button onClick={handleMerge}>слить в храилище</button>
    <button onClick={handlePull}>залить в состояние</button>
    <button onClick={handleRemove}>удалить хранилище</button>
    <ExempleFirst />
    <ExempleTwo />
    <ExempleTree /> */}
    <App />
  </React.StrictMode>,
  rootElement
);
