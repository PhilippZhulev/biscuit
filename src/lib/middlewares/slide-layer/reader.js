import { slides } from "./core";

export const reader = {
  call: (...fn) => {
    return {
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
  }
};
