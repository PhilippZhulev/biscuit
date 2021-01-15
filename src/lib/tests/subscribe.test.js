import { createStore, dispatch, subscribeToState} from "../index";


const { testState1, testState2 } = createStore({
    repo: {
        name: "testStore",
        initial: { value: 0 }
    },
    states: {
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
        expect(e.message).toEqual("Biscuit -> subscribeToState error: repository \"undefined\" not found.");
        done();
    });
}); 

it("check action state type error", (done) => {
    expect.assertions(1);

    setTimeout(() => {
        dispatch(testState1, { value: "test-1" });
    }, 100)

    subscribeToState({ state: "TEST/ACTION-NOT", repo: "testStore"}, () => { }).catch((e) => {
        expect(e.message).toEqual("Biscuit -> subscribeToState error: state \"TEST/ACTION-NOT\" not found.");
        done();
    });
}); 

it("check action store type error", (done) => {
    expect.assertions(1);

    setTimeout(() => {
        dispatch(testState1, { value: "test-1" });
    }, 100)

    subscribeToState({ state: "TEST/ACTION-1", repo: "testStore-not"}, () => { }).catch((e) => {
        expect(e.message).toEqual("Biscuit -> subscribeToState error: repository \"testStore-not\" not found.");
        done();
    });
}); 