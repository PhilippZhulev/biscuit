const messages = {
    notAction: (fn, name) => `biscuit ${fn} error: the '${name}' state does not exist`
}

export function emitter(action) {
    const taskBuffer = [];
    let taskId = 0;

    return {

        /**
         * This method allows you to subscribe to an action. 
         * Creates a task that puts its own callback function,
         * which should then be started by the dispatcher
         * @param {string} stateName name of the state to subscribe to
         * @param {function} callback callback function that will be started by the dispatcher
         * @return {string} returned task id
         * @public
        */
        subscribeAction: (stateName, fn) => {
            if (stateName === action) {
                taskId = taskId + 1; 

                taskBuffer.push({
                    name: stateName,
                    data: null,
                    todo: fn,
                    launch: false,
                    id: taskId
                });

                return taskId
            } else {
                throw new Error(messages.notAction("subscribeAction", stateName))
            }
        },

        /**
         * Removes the task from the buffer 
         * thereby unsubscribing from the state.
         * @param {string} id task id
         * @param {boolean} isLaunch If true, the method will delete the task 
         * without only if it has worked at least once.
         * @return {string} returned task id
         * @public
        */
        removeSubscribeAction: (id, isLaunch = false) => {
            const targetIndex = taskBuffer.findIndex(
                (el) => {
                    const isId = el.id === id
                    if (isLaunch) {
                        return isId && el.launch;
                    }

                    return isId
                }
            );

            if (~targetIndex) {
                taskBuffer.splice(targetIndex, 1);
            }
        },

        /**
        * Starts all tasks that match the specified state name
        * and passes data to their callback functions.
        * @param {string} stateName name of the state to subscribe to
        * @param {object} data the transmitted data
        * @async
        * @public
        */
        dispatchAction: async (stateName, data) => {
            if (stateName === action) {
                for (let task of taskBuffer) {
                    if (task.name === stateName && task.data !== data) {
                        task.todo(data);
                        task.data = data;
                        task.launch = true;
                    }
                }
            } else {
                throw new Error(messages.notAction("dispatchAction", stateName))
            }
        },
    }
}
