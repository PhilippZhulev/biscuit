import { slideLayer, call, provide } from "../../lib/middlewares/slide-layer";

const slide = slideLayer();

slide.take("MODEL_INIT", function* (payload) {
  const data = yield call((id) => {
    return fetch("https://jsonplaceholder.typicode.com/todos/" + id)
      .then((response) => response.json())
      .then((json) => json);
  }).args(payload.id);

  provide("MODEL_SUCCESS", { data });

  yield (function () {
    console.log(data);
  })();
});

export default slide.connect;
