/**
 * BISCUIT STORAGE REACTs
 * @autor: Zhulev Philipp
 * @version: 1.0.0
 * @license MIT
 */

import React, { useEffect, useState } from "react";
import { subscribeToState, getState, dispatch } from "./store";

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
