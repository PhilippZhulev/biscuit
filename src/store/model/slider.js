import { newSlide } from "../../lib/middlewares/slide";

const slide = newSlide();

const api = async (id) => {
    const response = await fetch(
        "https://jsonplaceholder.typicode.com/todos/" + id
    );
    const json = await response.json();
    return { data: json.title };
};

slide.take("MODEL_INIT", (read, write) => {
    const ch = write.makeChan();
    read.call(api).args(read.payload.id).then(ch.add);
    read.throttle(write.chanProvide, 1000, "MODEL_SUCCESS", ch);
});

export default slide;
