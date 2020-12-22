import { createLog } from "./store";

const readError = "biscuit read error: ";
const messages = {
  storeRequired: readError + "store require field.",
  storeInitialObject: readError + "store field should be a object.",
  storeString: readError + "store field should be a string.",
  actionsType: readError + "actions field should be a object.",
  middlewareNotArray: readError + "middleware field should be a array.",
  middlewareNotKeyFunc: (key) =>
    readError + `middleware item "${key}" should be a function.`,
  debugerNotFunc: readError + "debuger field should be a array.",
  storeNotValid: readError + `store not valid.`,
  actionNotValid: readError + `action not valid.`,
  storeNotFound: (name) => readError + `store "${name}" not found.`,
  stateNotFound: (name) => readError + `state "${name}" not found.`,
  actionString: readError + "action must be of type string",
  isFunction: readError + "fn must be of function"
};

export function creaateBiscuitValidator(params) {
  if (!params.store) {
    createLog(new Error(messages.storeRequired), "error");
  }

  if (typeof params.store.name !== "string") {
    createLog(new Error(messages.storeString), "error");
  }

  if (typeof params.store.initial !== "object") {
    createLog(new Error(messages.storeInitialObject), "error");
  }

  if (
    params.actions &&
    typeof params.actions !== "object" &&
    Array.isArray(params.actions)
  ) {
    createLog(new Error(messages.actionsType), "error");
  }

  if (!Array.isArray(params.middleware)) {
    createLog(new Error(messages.middlewareNotArray), "error");
  } else {
    for (let key in params.middleware) {
      if (typeof params.middleware[key] !== "function") {
        createLog(new Error(messages.middlewareNotKeyFunc(key)), "error");
      }
    }
  }

  if (params.debuger && typeof params.debuger === "function") {
    createLog(new Error(messages.debugerNotFunc), "error");
  }
}

export function actionValidation(act, states, storage) {
  if (typeof act.state !== "string") {
    createLog(new Error(messages.storeNotValid), "error");
    return;
  }

  if (typeof act.store !== "string") {
    createLog(new Error(messages.actionNotValid), "error");
    return;
  }

  if (!states[`"${act.state}"`]) {
    createLog(new Error(messages.stateNotFound(act.state)), "error");
  }

  if (!storage[act.store]) {
    createLog(new Error(messages.storeNotFound(act.store)), "error");
  }
}

export function stateValidator(state, states) {
  if (typeof state !== "string") {
    createLog(new Error(messages.actionNotValid), "error");
    return;
  }

  if (!states[`"${state}"`]) {
    createLog(new Error(messages.stateNotFound(state)), "error");
  }
}

export function storeValidator(store, storage) {
  if (typeof store !== "string") {
    createLog(new Error(messages.storeNotValid), "error");
    return;
  }

  if (!storage[store]) {
    createLog(new Error(messages.storeNotFound(store)), "error");
  }
}

export function actionCallbackValidator(act, fn) {
  if (typeof act !== "string") {
    createLog(new Error(messages.actionString), "error");
    return;
  }

  if (typeof fn !== "function") {
    createLog(new Error(messages.isFunction), "error");
    return;
  }
}
