/**
 * BISCUIT STORAGE REACTs
 * @autor: Zhulev Philipp
 * @version: 1.0.0
 * @license MIT
 */

import React, { memo, useEffect, useRef, useState } from "react";
import { subscribeToState, getState, dispatch } from "./store";
import { sandbox, throttle, debounce } from "./utils";
import { emitters } from "./emittes";

const boxThrottle = sandbox(throttle);
const boxDebounce = sandbox(debounce);

/** to create parameters dependency */
const createDep = (params, value) => {
  params.actions[`${value.state}`] = value.store;
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
    return class extends React.PureComponent {
      /** mount update event */
      componentDidMount() {
        emitters.storeEmitter.addEventListener("store.update", () =>
          this.forceUpdate()
        );
      }

      /** unmount update event */
      componentWillUnmount() {
        emitters.storeEmitter.removeEventListener("store.update", () =>
          this.forceUpdate()
        );
      }

      /** proxy element */
      render() {
        return (
          <Element {...this.props} {...stateToProps()} {...dispatchToProps} />
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
      const fn = (e) => {
        if (params.actions[`${e.detail.action}`]) {
          setState({ ...state, ...e.detail.payload });
        }
      };

      emitters.storeEmitter.addEventListener("store.update", fn);
      return () => {
        emitters.storeEmitter.removeEventListener("store.update", fn);
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return <Element {...props} {...state} />;
  };

  /** memoization decorator */
  return memo(Decorator);
}

/**
 * huck subscribe store state
 * @param {object} params state params
 * @param {boolean} update if false excludes update
 * @return {object}  store state
 * @public
 */

export function useSubscribe(params, update = true) {
  const [state, setState] = useState(null);
  let value = useRef(getState(params));
  useEffect(() => {
    let cache = {};
    subscribeToState(params, (instance) => {
      const n = instance;

      if (update) {
        setState(instance);
        return;
      }

      if (!(n in cache)) {
        setState(null);
      }
      cache[n] = instance;
      value.current = cache[n];
    });
  }, [params, update]);
  return [state || value.current, (payload) => dispatch(params, payload)];
}

/**
 * huck dispatch
 * @param {object} params state params
 * @return {function} dispatch
 * @public
 */
export function useDispatch(params) {
  return (payload = {}) => dispatch(params, payload);
}

/**
 * huck dispatch: throttle
 * @param {object} params state params
 * @param {number} count throttle timer
 * @return {function}  dispatch
 * @public
 */
export function useDispatchThrottle(params, count) {
  return (payload) => boxThrottle.run(dispatch, count)(params, payload);
}

/**
 * huck dispatch: debounce
 * @param {object} params state params
 * @param {number} count throttle timer
 * @return {function}  dispatch
 * @public
 */
export function useDispatchDebounce(params, count) {
  return (payload) => boxDebounce.run(dispatch, count)(params, payload);
}
