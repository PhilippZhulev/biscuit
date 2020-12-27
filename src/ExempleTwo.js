import React from "react";
import { useSubscribeToState } from "./lib/react-store";
import { modelInit, modelSuccess } from "./store/model/root";

export default function ExempleTwo() {
    /** hook subscriber the state from store */
    const clear = useDispatch(counterClear);

    /** clear timer */
    const handleClear = () => clear({ counter: 0 });

    return <button onClick={handleClear}>clear</button>;
}
