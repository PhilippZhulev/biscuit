/**
 * throttle function
 * @param {function} callback target function
 * @param {number} limit counter
 * @return {function}
 */
export function throttle(callback, limit) {
  var waiting = false;
  return function () {
    if (!waiting) {
      callback.apply(this, arguments);
      waiting = true;
      setTimeout(function () {
        waiting = false;
      }, limit);
    }
  };
}

/** create encapsulation throttle */
export const sandbox = (fn) => {
  return {
    run: (function () {
      let throt = null;

      /** initial run  */
      const initialThrottle = (call, timer) => {
        if (!throt) {
          throt = fn(call, timer);
        }
      };

      /** initial run  */
      const throttleCaller = (...args) => {
        return throt(...args);
      };

      /** obscriber  */
      return (call, timer) => {
        initialThrottle(call, timer);
        return throttleCaller;
      };
    })()
  };
};
