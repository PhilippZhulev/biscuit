
import { createStore, getState, dispatch } from "../index";

const { testState1, testState2 } = createStore({
    repo: {
        name: "testStore",
        initial: { value: "test" }
    },
    states: {
        testState1: "TEST/ACTION-1",
        testState2: "TEST/ACTION-2"
    }
});

it("getState: get value test", () => {
    expect(getState(testState1).value).toEqual("test");
    expect(getState(testState1)).toEqual({value: "test"});
});


it("getState: change value", (done) => {
    expect.assertions(2);
    expect(getState(testState2).value).toEqual("test");

    dispatch(testState2, { value: "test-1" });

    setTimeout(() => {
        expect(getState(testState2)).toEqual({ value: "test-1" });
        done();
    }, 100)
});

it("getState: error params type", () => {
    try {
        getState([])
    } catch (e) {
        expect(e.message).toEqual("Biscuit -> getState error: repository \"undefined\" not found.");
    }
});

it("getState: error state", () => {
    try {
        getState({state: "TEST/ACTION-NULL", repo: "testStore"})
    } catch (e) {
        expect(e.message).toEqual("Biscuit -> getState error: state \"TEST/ACTION-NULL\" not found.");
    }
});

it("getState: error store", () => {
    try {
        getState({state: "TEST/ACTION-1", repo: "testStore-NULL"})
    } catch (e) {
        expect(e.message).toEqual("Biscuit -> getState error: repository \"testStore-NULL\" not found.");
    }
});
