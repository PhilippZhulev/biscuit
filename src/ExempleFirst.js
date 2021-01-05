import React, { useEffect, useState } from "react";
import "./styles.css";
import { getState, subscribeToState } from "./lib/store";
import subscribe from "./lib/react-store";
import { modelInit, modelSuccess } from "./store/model/root";

/** subscribe to state */
subscribeToState(modelSuccess, (payload) => {
    console.log(payload);
});

//getState(modelInit).id = 10; 

function ExempleFirst({ id, dot, modelInit }) {
    const [count, setCount] = useState(0);

    useEffect(() => {
        if (count > 0) {
            /** update state */
            modelInit({ id: count }).before((state) => {
                console.log(state);
            });
        }
    }, [count, modelInit]);

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
    modelInit,
};

/** subscribe component to store */
export default subscribe(stateToProps, dispatchToProps)(ExempleFirst);
