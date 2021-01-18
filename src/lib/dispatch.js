import { repositories } from "./repositories";
import { activeMiddlewares, getStateRepo } from "./helper";
import {
    emitter,
} from "./emitter";

export function dispatchProto({ action, prev, act, payData }) {
    /**
     * Call before state change
     * @param {function} fn callback
     * @public
     */
    this.before = (fn) => {
        fn(prev);
        return this;
    };

    /**
     * Merge state into repository
     * @public
     */
    this.merge = () => {
        repositories[action.repo].content = {
            ...act,
            ...payData
        };

        return this;
    };

    /**
     * Call after state change
     * @param {function} fn callback
     * @async
     * @public
     */
    this.after = async (fn) => {
        const call = function (resolve, e) {
            resolve({
                ...getStateRepo(action).content
            });
        }

        await new Promise((resolve) => {
            const task = emitter.subscribeAction(
                action.repo, (e) =>
                    call(resolve, e), action.state
            );
            task.remove();
        }).then(fn);
        return this;
    };
}

export async function dispatchInitMiddleware({action, payData, act}) {
    return await new Promise((resolve) => {
        activeMiddlewares(
            {
                action: action.state,
                repo: action.repo,
                payload: payData,
                state: act
            },
            (newPayload) => {
                resolve(newPayload);
            }
        );
    });
}