
export function newAdapter() {
    const connectors = [];

    return {
        /** connector for biscuit middleware
         * launches tasks from the scheduler when an action is triggered
         * @param {object} context context contains action parameters
         * @param {function} callback callback function
         * @public
         */
        connect: (context, callback) => {
            let resolve = false;
            for (let connector of connectors) {
                if (connector.act === context.action) {
                    (async function () {
                        const update = connector.fn(
                            context.payload,
                            context.state,
                            callback
                        );
                
                        if (update) {
                            callback(update);
                        }
                    })();
                    resolve = true;
                }
            }

            if (!resolve) {
                callback(context.payload);
            }
        },

        /** create action
         * adds an action to the scheduler
         * @param {string} act action name
         * @param {function} fn callback function
         * @public
         */
        action: (act, fn) => {
            connectors.push({ act, fn });
        }
    };
}
