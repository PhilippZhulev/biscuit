import { runtime } from "./runtime";

export function newSlideLayer() {
    const connectors = [];

    return {
        /** connector for biscuit middleware
         * launches tasks from the scheduler when an action is triggered
         * @param {object} context context contains action parameters
         * @public
         */
        connect: (context) => {
            for (let connector of connectors) {
                if (connector.act === context.action) {
                    runtime(connector, context.payload, context.repo);
                }
            }
        },

        /** take action
         * adds an action to the scheduler
         * @param {string} act action name
         * @param {function} fn callback function
         * @public
         */
        take: (act, fn) => {
            connectors.push({ act, fn });
        }
    };
}
