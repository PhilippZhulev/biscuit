/**
 * BISCUIT-STORE-REACT
 * @autor: Zhulev Philipp
 * @version: 1.0.0
 * @license MIT
 */

import React, { memo, useEffect, useRef, useState } from "react";
import { getState, dispatch } from "./store";
import { emitter } from "./emitter";
import { sandbox, throttle, debounce } from "./utils";

const boxThrottle = sandbox(throttle);
const boxDebounce = sandbox(debounce);

/**
 * subscriber react components
 * @param {function} stateToProps props list
 * @param {object} dispatchToProps dispatch list
 * @return {import("react").ReactElement}
 * @public
 */
export default function subscribe(stateToProps, dispatchToProps) {
    return (Element) => {
        return class extends React.Component {
            buf = [];

            constructor(props) {
                super(props);
                this.state = {
                    dispatchers: {}
                }
            }

            /** mount update event */
            componentDidMount() {
                const result = {}
                for (let param in dispatchToProps) {
                    const repoName = dispatchToProps[param].repo;
                    const task = emitter.subscribeAction(repoName, () => {
                        this.forceUpdate();
                    })

                    result[param] = (payload) => dispatch(dispatchToProps[param], payload);
                    this.buf.push(task);
                }

                this.setState({dispatchers: result})
            }

            /** unmount update event */
            componentWillUnmount() {
                for (let task in this.buf) {
                    task.remove();
                }
            }

            /** proxy element */
            render() {
                return (
                    <Element
                        {...this.props}
                        {...stateToProps()}
                        {...this.state.dispatchers || {}}
                    />
                );
            }
        };
    };
}

/**
 * the observer for the states of a component
 * @param {import("react").ReactElement} Element react element
 * @param {array} deps dependence on the state
 * @return {import("react").ReactElement}
 * @public
 */
export function observer(Element, deps) {
    let initial = {};

    /** Create decorator */
    const Decorator = (props) => {
        const [state, setState] = useState({});
        
        useEffect(() => {
            const tasks = [];

            for (let action of deps) {
                initial = { ...initial, ...getState(action) };

                const task = emitter.subscribeAction(action.repo, () => {
                    setState((prev) => ({ ...prev, ...getState(action) }));
                }, action.state);

                tasks.push(task);
            }
            setState(initial);
            return () => {
                for (let task of tasks) { 
                    task.remove();
                }
            }
        }, []);

        return <Element {...props} {...state} />;
    };

    /** memoization decorator */
    return memo(Decorator);
}

/**
 * huck subscribe repository state
 * @param {object} action state params
 * @param {boolean} update if false excludes update
 * @return {object}  repository state
 * @public
 */

export function useSubscribe(action, update = true) {
    const [state, setState] = useState(null);
    let value = useRef(getState(action));

    useEffect(() => {
        let cache = {};

        const task = emitter.subscribeAction(action.repo, (data) => {
            const n = data;

            if (update) {
                setState(data);
                return;
            }

            if (!(n in cache)) {
                setState(null);
            }

            cache[n] = data;
            value.current = cache[n];
        })

        return () => task.remove();
    }, [action, update]);

    return [
        state || value.current, (payload) =>
            dispatch(action, payload)
    ];
}

/**
 * huck dispatch
 * @param {...object} actions state params
 * @return {array[function]} dispatch
 * @public
 */
export function useDispatch(...actions) {
    return actions.map((action) =>
        (payload = {}) => dispatch(action, payload)
    );
}

/**
 * huck dispatch: throttle
 * @param {number} count throttle timer
 * @param {...object} actions state params
 * @return {array[function]}  dispatchers
 * @public
 */
export function useDispatchThrottle(count, ...actions) {
    return actions.map((action) =>
        (payload = {}) =>
            boxThrottle.run(dispatch, count)(action, payload)
    );
}

/**
 * huck dispatch: debounce
 * @param {number} count throttle timer
 * @param {...object} actions state params
 * @return {array[function]}  dispatchers
 * @public
 */
export function useDispatchDebounce(count, ...actions) {
    return actions.map((action) =>
        (payload = {}) =>
            boxDebounce.run(dispatch, count)(action, payload)
    );
}
