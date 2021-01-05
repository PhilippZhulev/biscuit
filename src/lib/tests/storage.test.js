import { createBiscuit, getStorage, addStorage, newStorage } from "../index";


createBiscuit({
    store: {
        name: "testStore",
        initial: { value: "test", status: 200 }
    },
    actions: {
        testState1: "TEST/ACTION-1",
        testState2: "TEST/ACTION-2"
    }
});

it("get storage test", () => {
    expect(getStorage("testStore").value).toEqual("test");
    expect(getStorage("testStore").status).toEqual(200);
    expect(getStorage("testStore")).toEqual({ value: "test", status: 200 });
});

it("get storage test write error", () => {
    try {
        getStorage("testStore").value = "write"
    } catch (e) {
        expect(e.message).toEqual("Cannot assign to read only property 'value' of object '#<Object>'");
    }
});

it("add key by storage", () => {
    addStorage("testStore", { write: "test" });
    expect(getStorage("testStore").write).toEqual("test");
});

it("create new storage", () => {
    newStorage("testNewStore", { name: "John" });
    expect(getStorage("testNewStore")).toEqual({ name: "John" });
});

it("new storage name type", () => {
    try {
        newStorage(1)
    } catch (e) {
        expect(e.message).toEqual("biscuit newStorage error: storage name is not a string.");
    }
});


it("new storage initial type", () => {
    try {
        newStorage("newTestStorage-1", [])
    } catch (e) {
        expect(e.message).toEqual("Biscuit -> newStorage error: field should be a \"object\".");
    }
});

it("new storage exist key", () => {
    try {
        newStorage("newTestStorage-exist")
        newStorage("newTestStorage-exist")
    } catch (e) {
        expect(e.message).toEqual("Biscuit -> newStorage error: the \"newTestStorage-exist\" repository already exists.");
    }
});

it("get storage not exist key", () => {
    try {
        getStorage("newTestStorage-not-exist")
    } catch (e) {
        expect(e.message).toEqual("Biscuit -> getStorage error: store \"newTestStorage-not-exist\" not found.");
    }
});

it("add storage not exist instance", () => {
    try {
        newStorage("newTestStorage-not-exist-1")
        addStorage("newTestStorage-not-exist-1")
    } catch (e) {
        expect(e.message).toEqual("Biscuit -> newStorage error: field should be a \"object\".");
    }
});

it("add storage not valid type", () => {
    try {
        newStorage("newTestStorage-not-exist-2")
        addStorage("newTestStorage-not-exist-2", [])
    } catch (e) {
        expect(e.message).toEqual("Biscuit -> newStorage error: field should be a \"object\".");
    }
});

it("add storage not exist name", () => {
    try {
        newStorage("newTestStorage-not-exist-3")
        addStorage(1)
    } catch (e) {
        expect(e.message).toEqual("Biscuit -> addStorage error: field should be a \"string\".");
    }
});
