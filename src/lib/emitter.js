const messages = {
    notAction: (fn, name) => `biscuit ${fn} error: the '${name}' state does not exist`
}

export function emitter(action) {
    const taskBuffer = [];
    let taskId = 0;

    return {
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
        dispatchAction: (stateName, data) => {
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
