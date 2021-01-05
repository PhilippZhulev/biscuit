/**
 * BISCUIT-STORE-REACT
 * @autor: Zhulev Philipp
 * @version: 1.0.0
 * @license MIT
 */

import React, { memo, useEffect, useRef, useState } from "react";
import { getState, dispatch } from "./store";
import { emitters } from "./repositories";
import { sandbox, throttle, debounce } from "./utils";

const boxThrottle = sandbox(throttle);
const boxDebounce = sandbox(debounce);

/** to create parameters dependency */
const createDep = (params, value) => {
    params.actions[`"${value.state}"`] = value.repo;
    params.initial = { ...params.initial, ...getState(value) };
};

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
                    const actionName = `"${dispatchToProps[param].state}"`;
                    const id = emitters[actionName].subscribeAction(actionName, () => {
                        this.forceUpdate();
                    })

                    result[param] = (payload) => dispatch(dispatchToProps[param], payload);
                    this.buf.push({actionName, id});
                }

                this.setState({dispatchers: result})
            }

            /** unmount update event */
            componentWillUnmount() {
                for (let el in this.buf) {
                    emitters[el.actionName].removeSubscribeAction(el.id)
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
    const params = { actions: {}, initial: {} };

    /** check and create deps */
    if (Array.isArray(deps)) {
        for (let value of deps) {
            createDep(params, value);
        }
    } else {
        createDep(params, deps);
    }

    /** Create decorator */
    const Decorator = (props) => {
        const [state, setState] = useState(params.initial);
        
        useEffect(() => {
            const buf = [];

            for (let name in params.actions) {
                const id = emitters[name].subscribeAction(name, (data) => {
                    if (params.actions[`"${data.action}"`]) {
                        setState((prev) => ({ ...prev, ...data.payload }));
                    }
                })
                buf.push({id, name});
            }

            return () => {
                for (let el of buf) {
                    emitters[el.name].removeSubscribeAction(el.id)
                }
            };

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
        const actionName = `"${action}"`;

        const id = emitters[actionName].subscribeAction(actionName, (data) => {
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

        return () => emitters[actionName].removeSubscribeAction(id)
    }, [action, update]);

    return [state || value.current, (payload) => dispatch(action, payload)];
}

/**
 * huck dispatch
 * @param {object} action state params
 * @return {function} dispatch
 * @public
 */
export function useDispatch(action) {
    return (payload = {}) => dispatch(action, payload);
}

/**
 * huck dispatch: throttle
 * @param {object} action state params
 * @param {number} count throttle timer
 * @return {function}  dispatch
 * @public
 */
export function useDispatchThrottle(action, count) {
    return (payload) => boxThrottle.run(dispatch, count)(action, payload);
}

/**
 * huck dispatch: debounce
 * @param {object} action state params
 * @param {number} count throttle timer
 * @return {function}  dispatch
 * @public
 */
export function useDispatchDebounce(action, count) {
    return (payload) => boxDebounce.run(dispatch, count)(action, payload);
}
