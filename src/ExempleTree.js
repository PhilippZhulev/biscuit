import React from "react";
import { observer } from "./lib/react-store";
import { modelSuccess } from "./store/model/root.js";


const App = observer(
    ({ data }) => {
        console.log(data)
        return (
            <div className="counter">
                <p>text: {data}</p>
            </div>
        );
    },
    [modelSuccess]
);

export default App