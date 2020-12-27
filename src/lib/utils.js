/**
 * throttle function
 * @param {function} callback target function
 * @param {number} limit counter
 * @return {function}
 */
export function throttle(callback, limit) {
    let waiting = false;
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

/**
 * debounce function
 * @param {function} callback target function
 * @param {number} limit counter
 * @return {function}
 */
export function debounce(callback, limit) {
    let isCooldown = false;

    return function () {
        if (isCooldown) return;
        callback.apply(this, arguments);
        isCooldown = true;
        setTimeout(() => (isCooldown = false), limit);
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

/** memoized function */
export const memoize = (fn, dep) => {
    let cache = {};
    return (...args) => {
        let n = args[0];
        if (n in cache) {
            return cache[n];
        } else {
            let result = fn(n);
            cache[n] = result;
            return result;
        }
    };
};
