
export const buffers = {
    repo: [],
    result: {},
    runtime: []
};

/** get repository buffer */
export const getRepoBuffer = () => {
    return buffers.repo[0];
};