import { slideLayer } from "../../lib/middlewares/slide-layer";

const slide = slideLayer();

const api = async (id) => {
  const response = await fetch(
    "https://jsonplaceholder.typicode.com/todos/" + id
  );
  const json = await response.json();
  return { data: json };
};

slide.take("MODEL_INIT", async (read, write) => {
  const ch = write.makeChan();
  read.call(api).args(read.payload.id).then(ch.add);
  write.chanToProvide("MODEL_SUCCESS", ch);
});

// slide.take("MODEL_INIT", async (read, write) => {
//   const data = await read.call(api).args(read.payload.id);
//   await read.delay(1000);
//   write.provide("MODEL_SUCCESS", data);
// });

export default slide;
