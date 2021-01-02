import { Validator } from "./validator"
import { creaateBiscuittemplate } from "./validationTempl"

export function creaateBiscuitValidator(params, fnName) {
    const validator = Validator(fnName, creaateBiscuittemplate, params);

    for (let key in creaateBiscuittemplate) {
        validator.isRequired(key)
        validator.isFieldType(key);
        validator.isObjectFieldType(key);
    }
}

export function actionValidation({params, states, storage}, fnName = "noName") {
    const validator = Validator(fnName);
    validator.isCustomCheck(
        { value: params, key: "params", type: "object", require: true },
    );
    validator.checkStorageKeyNotExist(storage, params.store);
    validator.checkStorageKeyNotExist(states, `"${params.state}"`);
}

export function stateValidator(state, states) {

}

export function storeValidator({ name, storage }, fnName = "noName") {
    const validator = Validator(fnName);
    validator.checkStorageKeyNotExist(storage, name);
}

export function addStoreValidator({ name, instance, storage }, fnName = "noName") {
    const validator = Validator(fnName);
    validator.isCustomCheck(
        { value: name, key: "name", type: "string", require: true },
        { value: instance, key: "instance", type: "object", require: true },
    );
    validator.checkStorageKeyNotExist(storage, name);
}

export function newStoreValidator({ name, initial, storage }, fnName = "noName") {
    const validator = Validator(fnName);
    
    validator.checkStorageKeyExist(storage, name);
    validator.isCustomCheck(
        { value: name, key: "name", type: "string", require: true },
        { value: initial, key: "initial", type: "object", require: false },
    );
}

export function actionCallbackValidator(act, fn) {

}

