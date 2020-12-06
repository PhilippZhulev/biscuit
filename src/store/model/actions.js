import model from "./root";
import { stateCollection } from "../../lib/store";

/** actions list */
export const modelInit = model.state("MODEL_INIT");
export const modelSuccess = model.state("MODEL_SUCCESS");

export default stateCollection(modelInit, modelSuccess);
