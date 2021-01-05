import { createBiscuit, getRepo, addRepo, newRepo } from "../index";


createBiscuit({
    repo: {
        name: "testStore",
        initial: { value: "test", status: 200 }
    },
    states: {
        testState1: "TEST/ACTION-1",
        testState2: "TEST/ACTION-2"
    }
});

it("get storage test", () => {
    expect(getRepo("testStore").value).toEqual("test");
    expect(getRepo("testStore").status).toEqual(200);
    expect(getRepo("testStore")).toEqual({ value: "test", status: 200 });
});

it("get storage test write error", () => {
    try {
        getRepo("testStore").value = "write"
    } catch (e) {
        expect(e.message).toEqual("Cannot assign to read only property 'value' of object '#<Object>'");
    }
});

it("add key by storage", () => {
    addRepo("testStore", { write: "test" });
    expect(getRepo("testStore").write).toEqual("test");
});

it("create new storage", () => {
    newRepo("testNewStore", { name: "John" });
    expect(getRepo("testNewStore")).toEqual({ name: "John" });
});

it("new storage name type", () => {
    try {
        newRepo(1)
    } catch (e) {
        expect(e.message).toEqual("biscuit newRepo error: storage name is not a string.");
    }
});


it("new storage initial type", () => {
    try {
        newRepo("newTestStorage-1", [])
    } catch (e) {
        expect(e.message).toEqual("Biscuit -> newRepo error: field should be a \"object\".");
    }
});

it("new storage exist key", () => {
    try {
        newRepo("newTestStorage-exist")
        newRepo("newTestStorage-exist")
    } catch (e) {
        expect(e.message).toEqual("Biscuit -> newRepo error: the \"newTestStorage-exist\" repository already exists.");
    }
});

it("get storage not exist key", () => {
    try {
        getRepo("newTestStorage-not-exist")
    } catch (e) {
        expect(e.message).toEqual("Biscuit -> getRepo error: store \"newTestStorage-not-exist\" not found.");
    }
});

it("add storage not exist instance", () => {
    try {
        newRepo("newTestStorage-not-exist-1")
        addRepo("newTestStorage-not-exist-1")
    } catch (e) {
        expect(e.message).toEqual("Biscuit -> newRepo error: field should be a \"object\".");
    }
});

it("add storage not valid type", () => {
    try {
        newRepo("newTestStorage-not-exist-2")
        addRepo("newTestStorage-not-exist-2", [])
    } catch (e) {
        expect(e.message).toEqual("Biscuit -> newRepo error: field should be a \"object\".");
    }
});

it("add storage not exist name", () => {
    try {
        newRepo("newTestStorage-not-exist-3")
        addRepo(1)
    } catch (e) {
        expect(e.message).toEqual("Biscuit -> addRepo error: field should be a \"string\".");
    }
});
