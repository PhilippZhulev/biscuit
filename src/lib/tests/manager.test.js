import { createBiscuit, getRepo, getState, dispatch, newManager, addRepo } from "../index";

const { testState1, testState2, testState3 } = createBiscuit({
    repo: {
        name: "testStore",
        initial: { value: 0, id: 0 }
    },
    states: {
        testState1: "TEST/ACTION-1",
        testState2: "TEST/ACTION-2",
        testState3: "TEST/ACTION-3"
    }
});

const manager = newManager(testState1);

it("check manager.merge", (done) => {
    expect(getRepo("testStore").value).toEqual(0);
    dispatch(testState1, { value: 1 });

    setTimeout(() => {
        expect(getState(testState1).value).toEqual(1);
        expect(getRepo("testStore").value).toEqual(0);
        manager.merge();
        expect(getRepo("testStore").value).toEqual(1);
        done();
    }, 100);
}); 

it("check manager.pull", () => {
    expect(getRepo("testStore").value).toEqual(1);
    addRepo("testStore", { value: 3 });
    expect(getRepo("testStore").value).toEqual(3);
    expect(getState(testState1).value).toEqual(1);
    manager.pull();
    expect(getState(testState1).value).toEqual(3);
}); 

it("check manager.replaceStore", (done) => {
    const first = {value: 3, id: 0};
    const last = { value: 50, id: 100, name: "test-name" };

    expect(getRepo("testStore")).toEqual(first);
    dispatch(testState1, last);

    setTimeout(() => {
        expect(getState(testState1)).toEqual(last);
        manager.replaceRepo();
        expect(getRepo("testStore")).toEqual(last);
        done();
    }, 100);
}); 

it("check manager.replaceState", () => {
    const first = { value: 50, id: 100, name: "test-name" };
    const last = { value: 10, id: 10, name: "test-name-1" };

    expect(getRepo("testStore")).toEqual(first);
    addRepo("testStore", last);
    expect(getRepo("testStore")).toEqual(last);
    expect(getState(testState1)).toEqual(first);
    manager.replaceState();
    expect(getState(testState1)).toEqual(last);
}); 

it("check manager.mergeState", () => {
    const first = { value: 10, id: 10, name: "test-name-1" };
    const last = { value: 0, id: 0 };
    
    expect(getState(testState1)).toEqual(first);
    expect(getState(testState2)).toEqual(last);
    manager.mergeState(testState2);
    expect(getState(testState2)).toEqual(first);

});

it("check manager.compareStates", () => {
    expect(manager.compareStates(testState2)).toEqual(true);
    expect(manager.compareStates(testState3)).toEqual(false);
}); 

it("check manager.compareWithState", () => {
    expect(manager.compareWithState()).toEqual(true);
    addRepo("testStore", { value: 999 });
    expect(manager.compareWithState()).toEqual(false);
}); 

const first = { value: 10, id: 10, name: "test-name-1" };
const last = { value: 999, id: 10, name: "test-name-1" };

it("check manager.compareStateWithInstance", () => {
    expect(manager.compareStateWithInstance(first)).toEqual(true);
    expect(manager.compareStateWithInstance(last)).toEqual(false);
}); 

it("check manager.compareStoreWithInstance", () => {
    expect(manager.compareRepoWithInstance(first)).toEqual(false);
    expect(manager.compareRepoWithInstance(last)).toEqual(true);
}); 

it("check manager.close", () => {
    const first = { value: 999, id: 10, name: "test-name-1" };
    expect(getRepo("testStore")).toEqual(first);
    manager.clone("testStateClone");
    expect(getRepo("testStateClone")).toEqual(first);
}); 