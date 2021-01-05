import { createBiscuit, getRepo, getState, dispatch } from "../index";

const { testState1, testState2, testState3, testState4 } = createBiscuit({
    repo: {
        name: "testDispatchStore",
        initial: { value: 0 }
    },
    states: {
        testState1: "TEST/DIS/ACTION-1",
        testState2: "TEST/DIS/ACTION-2",
        testState3: "TEST/DIS/ACTION-3",
        testState4: "TEST/DIS/ACTION-4"
    }
});

it("check dispatch default", (done) => {
    dispatch(testState1, { value: 1 });
    
    setTimeout(() => {
        expect(getState(testState1).value).toEqual(1);
        done();
    }, 50)
}); 

it("check dispatch callback", (done) => {
    dispatch(testState2, ({value}) => ({value: value + 2}));
    
    setTimeout(() => {
        expect(getState(testState2).value).toEqual(2);
        done();
    }, 50)
}); 

it("check dispatch merge", (done) => {
    dispatch(testState3, { value: 4 }).merge();
    
    setTimeout(() => {
        expect(getState(testState3).value).toEqual(4);
        expect(getRepo("testDispatchStore").value).toEqual(4);
        done();
    }, 50)
}); 

it("check dispatch before void", (done) => {
    expect.assertions(1);
    dispatch(testState4, { value: 4 }).before((prev) => {
        expect(prev.value).toEqual(0);
        done();
    });
}); 

test("check dispatch after void", (done) => {
    expect.assertions(1);
    dispatch(testState4, { value: 8 }).after((state) => {
        expect(state.value).toEqual(8);
        done();
    });
}); 

test("check dispatch merge -> after void", (done) => {
    expect.assertions(2);
    dispatch(testState4, { value: 12 }).merge().after((state) => {
        expect(state.value).toEqual(12);
    });

    setTimeout(() => {
        expect(getRepo("testDispatchStore").value).toEqual(12);
        done();
    }, 50)
}); 

it("check dispatch params type error", () => {
    try {
        dispatch([], { value: 5 });
    } catch (e) {
        expect(e.message).toEqual("Biscuit -> dispatch error: store \"undefined\" not found.");
    }
}); 

it("check dispatch params.state not found", () => {
    try {
        dispatch({state: "TEST/DIS/ACTION-NOT", store: "testDispatchStore"}, { value: 5 });
    } catch (e) {
        expect(e.message).toEqual("Biscuit -> dispatch error: state \"TEST/DIS/ACTION-NOT\" not found.");
    }
}); 