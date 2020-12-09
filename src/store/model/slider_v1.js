import { slideLayer, call, provide } from "../../lib/middlewares/slide-layer";

const slide = slideLayer();

slide.take("MODEL_INIT", function* (payload) {
  const data = yield call(async (id) => {
    const response = await fetch(
      "https://jsonplaceholder.typicode.com/todos/" + id
    );
    const json = await response.json();
    return json;
  }).args(payload.id);

  yield console.log(data.export());

  yield provide("MODEL_SUCCESS", { data: data.export() });
});

export default slide;
