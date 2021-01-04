import { slideLayer } from "../../lib/middlewares/slide-layer";

const slide = slideLayer();

const api = async (id) => {
    const response = await fetch(
        "https://jsonplaceholder.typicode.com/todos/" + id
    );
    const json = await response.json();
    return { data: json.title };
};

slide.take("MODEL_INIT", async (read, write) => {
    const ch = write.makeChan();
    read.call(api).args(read.payload.id).then(ch.add);
    write.chanToProvide("MODEL_SUCCESS", ch);
});

export default slide;
