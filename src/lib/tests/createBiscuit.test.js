import { getStorage, getState, dispatch, createBiscuit } from "../store";

let middleTestVar = 0;
let errTestVar = null;

const { testState1, testState2 } = createBiscuit({
    store: {
        name: "testStorage",
        initial: { id: 200 }
    },
    actions: {
        testState1: "TEST/ACTION-1",
        testState2: "TEST/ACTION-2"
    },
    middleware: [
        (context) => {
            if (context.payload.check) {
                middleTestVar = 201;
            }
        },
    ],
    debuger: function (e) {
        errTestVar = e.message;
    }
});

it("check new storage", () => {
    expect(getStorage("testStorage")).toEqual({ id: 200 });
});

it("check state vars", () => {
    expect(testState1).toEqual({ state: "TEST/ACTION-1", store: "testStorage" });
    expect(testState2).toEqual({ state: "TEST/ACTION-2", store: "testStorage" });
});

it("checking the existence of a state", () => {
    expect(getState(testState1)).toEqual({ id: 200 });
    expect(getState(testState2)).toEqual({ id: 200 });
});

test("check middleware", async () => {
    dispatch(testState1, { check: true });
    const result = await new Promise((resolve) => {
        setTimeout(() => {
            resolve(middleTestVar);
        }, 100);
    });
    expect(result).toEqual(201);
});

test("check debuger", () => {
    new Promise((resolve) => {
        getStorage("testStorage").id = "";
        setTimeout(() => {
            resolve(errTestVar);
        }, 100);
    }).then((result) => {
        expect(result).toEqual("biscuit write error: Getter field \"testStorage\" not writable.");
    });
});

it("no storage error", () => {
    try {
        createBiscuit({})
    } catch (e) {
        expect(e.message).toEqual("biscuit -> createBiscuit error: \"store\" require field.");
    }
});

it("no storage name error", () => {
    try {
        createBiscuit({
            store: {
                initial: { id: 200 }
            },
        })
    } catch (e) {
        expect(e.message).toEqual("biscuit -> createBiscuit error: \"store.name\" require field.");
    }
});

it("storage store.name type error", () => {
    try {
        createBiscuit({
            store: {
                name: 1,
            },
        })
    } catch (e) {
        expect(e.message).toEqual("biscuit -> newStorage error: field \"name\" should be a \"string\".");
    }
});

it("action type error", () => {
    try {
        createBiscuit({
            store: {
                name: "testInitial2",
                initial: {}
            },
            actions: []
        })
    } catch (e) {
        expect(e.message).toEqual("biscuit -> createBiscuit error: field \"actions\" should be a \"object\".");
    }
});

it("action field type error", () => {
    try {
        createBiscuit({
            store: {
                name: "testInitial3",
                initial: {}
            },
            actions: {
                testAction: 1
            }
        })
    } catch (e) {
        expect(e.message).toEqual("biscuit -> createBiscuit error: field \"testAction\" should be a \"string\".");
    }
});

it("no middleware type error", () => {
    try {
        createBiscuit({
            store: {
                name: "testInitial3",
                initial: {}
            },
            actions: {
                testAction: "ACT/TEST"
            },
            middleware: {}
        })
    } catch (e) {
        expect(e.message).toEqual("biscuit -> createBiscuit error: field \"middleware\" should be a \"array\".");
    }
});


it("no middleware field type error", () => {
    try {
        createBiscuit({
            store: {
                name: "testInitial4",
                initial: {}
            },
            actions: {
                testAction: "ACT/TEST"
            },
            middleware: [
                "test"
            ]
        })
    } catch (e) {
        expect(e.message).toEqual("biscuit -> createBiscuit error: field \"0\" should be a \"function\".");
    }
});

it("no debuger type error", () => {
    try {
        createBiscuit({
            store: {
                name: "testInitial5",
                initial: {}
            },
            actions: {
                testAction: "ACT/TEST"
            },
            debuger: []
        })
    } catch (e) {
        expect(e.message).toEqual("biscuit -> createBiscuit error: field \"debuger\" should be a \"function\".");
    }
});