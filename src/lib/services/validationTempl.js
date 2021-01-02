export const creaateBiscuittemplate = {
    store: {
        type: "object",
        require: true,
        keys: {
            name: {
                type: "string",
                require: true,
            },
            initial: {
                type: "object",
            }
        }
    },
    actions: {
        type: "object",
        require: false,
        keys: {
            "*": {
                type: "string",
            },
        }
    },
    middleware: {
        type: "array",
        require: false,
        keys: {
            "*": {
                type: "function",
            },
        }
    },
    debuger: {
        type: "function",
        require: false,
    }
}