import React from "react";
import ReactDOM from "react-dom";

import ExempleFirst from "./ExempleFirst";
import ExempleTree from "./ExempleTree";
import "./styles.css";
//import Main from "./docs/Main";

//combineStateCollections(modelStateCollection);

//const manager = biscuitManager(modelInit);

// subscribeToState(manager.props, (payload) => {
//     console.log("store === state", manager.compareWithState());
// });

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
        <button onClick={handleRemove}>удалить хранилище</button> */}
        <ExempleFirst />
        <ExempleTree />
        {/* /<Main /> */}
    </React.StrictMode>,
    rootElement
);
