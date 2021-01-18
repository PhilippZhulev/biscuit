import { createStore, getRepo, getState, dispatch } from "../index";
import { createLog } from "../debuger";

let middleTestVar = 0;

const { testState1, testState2 } = createStore({
    repo: {
        name: "testStorage",
        initial: { id: 200 }
    },
    states: {
        testState1: "TEST/ACTION-1",
        testState2: "TEST/ACTION-2"
    },
    middleware: [
        (context) => {
            if (context.payload.check) {
                middleTestVar = 201;
            }
        },
    ]
});

it("check new storage", () => {
    expect(getRepo("testStorage")).toEqual({ id: 200 });
});

it("check state vars", () => {
    expect(testState1.state).toEqual("TEST/ACTION-1");
    expect(testState1.repo).toEqual("testStorage");
    expect(testState2.state).toEqual("TEST/ACTION-2");
    expect(testState1.repo).toEqual("testStorage");
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

test("check debuger", (done) => {
    const log = "test-log"
    createStore({
        repo: {
            name: "testStorage-err",
            initial: { id: 200 }
        },
        states: {
            testStateERR: "TEST/ACTION-ERR",
        },
        debuger: function (e) {
            expect(e).toEqual(log);
            done();
        }
    });

    createLog(
        log,
        "log",
        "testStorage-err"
    );
});

test("check debuger", () => {
    const { testStateInitial1, testStateInitial2, testStateInitial3 } = createStore({
        repo: {
            name: "repo-1-test",
            initial: { id: 200 }
        },
        states: {
            testStateInitial1: {
                name: "TEST/ACTION-INITIAL1", 
                initial: { value: "test-200" }
            },
            testStateInitial2: "TEST/ACTION-INITIAL2",
            testStateInitial3: {
                name: "TEST/ACTION-INITIAL3", 
                initial: { value: "test-300", id: 250 }
            },
        }
    });

    expect(getState(testStateInitial1)).toEqual({ value: "test-200", id: 200 });
    expect(getState(testStateInitial2)).toEqual({ id: 200 });
    expect(getState(testStateInitial3)).toEqual({ value: "test-300", id: 250 });

});

it("no storage error", () => {
    try {
        createStore({})
    } catch (e) {
        expect(e.message).toEqual("Biscuit -> [object Object] error: \"repo.name\" require field.");
    }
});

it("no storage name error", () => {
    try {
        createStore({
            repo: {
                initial: { id: 200 }
            },
        })
    } catch (e) {
        expect(e.message).toEqual("Biscuit -> [object Object] error: \"repo.name\" require field.");
    }
});

it("storage store.name type error", () => {
    try {
        createStore({
            repo: {
                name: 1,
            },
        })
    } catch (e) {
        expect(e.message).toEqual("biscuit newRepo error: storage name is not a string.");
    }
});

it("action type error", () => {
    try {
        createStore({
            repo: {
                name: "testInitial2",
                initial: {}
            },
            states: []
        })
    } catch (e) {
        expect(e.message).toEqual("Biscuit -> createStore error: field \"actions\" should be a \"object\".");
    }
});

it("action field type error", () => {
    try {
        createStore({
            repo: {
                name: "testInitial3",
                initial: {}
            },
            states: {
                testAction: 1
            }
        })
    } catch (e) {
        expect(e.message).toEqual("Biscuit -> createStore error: field \"testAction\" should be a \"string\".");
    }
});

it("no middleware type error", () => {
    try {
        createStore({
            repo: {
                name: "testInitial3",
                initial: {}
            },
            states: {
                testAction: "ACT/TEST"
            },
            middleware: {}
        })
    } catch (e) {
        expect(e.message).toEqual("Biscuit -> createStore error: field \"middleware\" should be a \"array\".");
    }
});


it("no middleware field type error", () => {
    try {
        createStore({
            repo: {
                name: "testInitial4",
                initial: {}
            },
            states: {
                testAction: "ACT/TEST"
            },
            middleware: [
                "test"
            ]
        })
    } catch (e) {
        expect(e.message).toEqual("Biscuit -> createStore error: field \"0\" should be a \"function\".");
    }
});

it("no debuger type error", () => {
    try {
        createStore({
            repo: {
                name: "testInitial5",
                initial: {}
            },
            states: {
                testAction: "ACT/TEST"
            },
            debuger: []
        })
    } catch (e) {
        expect(e.message).toEqual("Biscuit -> createStore error: field \"debuger\" should be a \"function\".");
    }
});