/**
 * Module of the library responsible for creating tasks and subscribing to them.
 * @param  {string} action action name
 * @return {object} methods
 * @public
*/
function createEmmitor() {
    let taskBuffer = {};

    return {
        /**
         * This method allows you to subscribe to an action. 
         * Creates a task that puts its own callback function,
         * which should then be started by the dispatcher
         * @param {string} stateName name of the state to subscribe to
         * @param {function} callback callback function that will be started by the dispatcher
         * @param {string} state store state
         * @return {string} returned task id
         * @public
        */
        subscribeAction: (taskName, callback, state) => {
            if (!taskBuffer[taskName]) {
                taskBuffer[taskName] = [];     
            }

            const task = {
                state,
                name: taskName,
                todo: callback,
                id: taskBuffer[taskName].length
            };
            taskBuffer[taskName][task.id] = task;
            return {
                params: task, 
                remove: () => {
                    taskBuffer[taskName].splice(task.id, 1)
                }
            }
        },

        /**
        * Starts all tasks that match the specified state name
        * and passes data to their callback functions.
        * @param {object} action action params
        * @async
        * @public
        */
        dispatchAction: (action) => {
            taskBuffer[action.repo].forEach((task) => {
                if (!task.state) {
                    task.todo(task); 
                } else {
                    if (task.state === action.state) {
                        task.todo(task); 
                    }
                }
            });
        }
    }
}


export const emitter = createEmmitor()