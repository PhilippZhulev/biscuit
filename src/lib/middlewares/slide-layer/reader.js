import { slides } from "./core";
import { buffers } from "./core";

export const reader = {
    /**
   * an asynchronous function call with the return result
   * you can call several functions
   * @param {...function} fn target functions
   * @public
   */
    call: (...fn) => {
        return {
            /**
       * arguments for the function
       * @param {...any} props arguments
       * @public
       */
            args: async (...props) => {
                const result = await slides.call(fn, props);

                if (result.type === "multy") {
                    const data = [];
                    for (let i = 0; i < result.data.length; i++) {
                        data.push(await result.data[i]);
                    }

                    return data;
                }

                return result.data;
            }
        };
    },

    /**
   * stop execution for the specified time period
   * @param {number} count delay time to milliseconds
   * @public
   */
    delay: async (count) => {
        await new Promise((resolve) => {
            setTimeout(() => {
                resolve();
            }, count);
        });
    },

    execute: (fn, args) => {
        buffers.runtime.push({
            name: "execute",
            type: "reader",
            args: [fn, args],
            out: undefined
        });

        return buffers.runtime[buffers.runtime.length - 1];
    },

    executeAll: function (fns) {
        const result = [];
        for (let fn of fns) {
            result.push(fn);
        }

        return result;
    },

    all: slides.all,
    race: slides.race
};
