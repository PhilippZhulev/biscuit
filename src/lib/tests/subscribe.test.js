import { createBiscuit, dispatch, subscribeToState} from "../index";


const { testState1, testState2 } = createBiscuit({
    store: {
        name: "testStore",
        initial: { value: 0 }
    },
    actions: {
        testState1: "TEST/ACTION-1",
        testState2: "TEST/ACTION-2"
    }
});

it("check subscribeToState one call", async () => {
    expect.assertions(1);
    setTimeout(() => {
        dispatch(testState1, {});
    }, 100)

    await subscribeToState(testState1, (state) => {
        expect(state).toEqual({ value: 0 });
    });
}); 

it("check subscribeToState callback", async () => {
    expect.assertions(2);
    setTimeout(() => {
        dispatch(testState1, (prev) => ({ value: prev.value + 1 }));
    }, 100)

    subscribeToState(testState1, (state) => {
        expect(state).toEqual({ value: 1 });
    });

    const result = await subscribeToState(testState1).then((state) => {
        return state
    });

    expect(result).toEqual({ value: 1 });
}); 

it("check subscribeToState with different states", async () => {
    expect.assertions(2);

    setTimeout(() => {
        dispatch(testState1, { value: "test-1" });
        dispatch(testState2, { value: "test-2" });
    }, 100)

    subscribeToState(testState1, (state) => {
        expect(state).toEqual({ value: "test-1" });
    });

    await subscribeToState(testState2, (state) => {
        expect(state).toEqual({ value: "test-2" });
    });
}); 

it("check action type error", (done) => {
    expect.assertions(1);

    setTimeout(() => {
        dispatch(testState1, { value: "test-1" });
    }, 100)

    subscribeToState([], () => { }).catch((e) => {
        expect(e.message).toEqual("Biscuit -> subscribeToState error: store \"undefined\" not found.");
        done();
    });
}); 

it("check action state type error", (done) => {
    expect.assertions(1);

    setTimeout(() => {
        dispatch(testState1, { value: "test-1" });
    }, 100)

    subscribeToState({ state: "TEST/ACTION-NOT", store: "testStore"}, () => { }).catch((e) => {
        expect(e.message).toEqual("Biscuit -> subscribeToState error: state \"TEST/ACTION-NOT\" not found.");
        done();
    });
}); 

it("check action store type error", (done) => {
    expect.assertions(1);

    setTimeout(() => {
        dispatch(testState1, { value: "test-1" });
    }, 100)

    subscribeToState({ state: "TEST/ACTION-1", store: "testStore-not"}, () => { }).catch((e) => {
        expect(e.message).toEqual("Biscuit -> subscribeToState error: store \"testStore-not\" not found.");
        done();
    });
}); 