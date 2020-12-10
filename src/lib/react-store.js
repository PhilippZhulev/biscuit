/**
 * BISCUIT STORAGE REACTs
 * @autor: Zhulev Philipp
 * @version: 1.0.0
 * @license MIT
 */

import React, { memo, useEffect, useState } from "react";
import { subscribeToState, getState, dispatch } from "./store";
import { sandbox, throttle } from "./utils";

const boxThrottle = sandbox(throttle);

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
      /** mount update event */
      componentDidMount() {
        document.addEventListener("store.update", () => this.forceUpdate());
      }

      /** unmount update event */
      componentWillUnmount() {
        document.removeEventListener("store.update", () => this.forceUpdate());
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
export function observer(Element, deps = []) {
  const d = deps.map((dep) => dep.state);
  const Decorator = (props) => {
    const [state, setState] = useState({});
    useEffect(() => {
      const fn = (e) => {
        if (d.includes(e.detail.action)) {
          setState(e.detail.payload);
        }
      };
      document.addEventListener("store.update", fn);
      return () => {
        document.removeEventListener("store.update", fn);
      };
    }, []);

    return <Element {...props} {...state} />;
  };

  return memo(Decorator);
}

/**
 * huck subscribe store state
 * @param {object} params state params
 * @return {object}  store state
 * @public
 */
export function useSubscribeToState(params) {
  const [state, setState] = useState(getState(params));
  useEffect(() => {
    subscribeToState(params, (instance) => {
      setState(instance);
    });
  }, [params]);

  return [state, (payload) => dispatch(params, payload)];
}

/**
 * huck dispatch
 * @param {object} params state params
 * @return {function}  dispatch
 * @public
 */
export function useDispatch(params) {
  return (payload) => dispatch(params, payload);
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
