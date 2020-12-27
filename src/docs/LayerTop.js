import React, { useState, useRef, useEffect } from "react";
import Highlight from "react-highlight-updated";
import { startReactCodeInit, startReactCodeCount, startReactCodeObserver } from "./codeCollection"

const topMenuData = [
    {
        title: "javascript + react",
        id: 0,
    },
    {
        title: "reduce",
        id: 1,
    },
    {
        title: "slide",
        id: 2,
    },
]

const leftMenuData = [
    {
        title: "store/root.js",
        id: 0,
    },
    {
        title: "Counter.jsx",
        id: 1,
    },
    {
        title: "App.jsx",
        id: 2,
    },
]

export default function LayerTop() {
    const frameRef = useRef(null);
    const [state, setState] = useState({ view: 0, category: 0, lines: 0 });

    useEffect(() => {
        if (frameRef.current) {
            const h = frameRef.current.scrollHeight;
            setState((s) => (
                {
                    ...s,
                    lines: Math.ceil(h / 18)
                }
            ));
        }
    }, [frameRef]);

    const handelCheckPreviev = (key, index) => {
        setState({ ...state, [key]: index });
    };

    return (
        <div className={"layer"}>
            <div className={"codeProvider"}>
                <section className={"codeProviderPreview"}>
                    <div className={"codeProviderTopPanel"}>
                        {
                            topMenuData.map((item) => (
                                <div key={item.id} onClick={() => handelCheckPreviev("category", item.id)}>
                                    <span>{item.title}</span>
                                </div>
                            ))
                        }
                    </div>
                    <div ref={frameRef} className={"codeFlexWrapper"}>
                        <section className={"codeLines"}>
                            {new Array(state.lines).fill(0).map((_, i) => {
                                return <div key={i}>{i}</div>;
                            })}
                        </section>
                        <pre>
                            {state.view === 0 && state.category === 0 ? (
                                <Highlight language="javascript">
                                    {startReactCodeInit}
                                </Highlight>
                            ) : null}
                            {state.view === 1 && state.category === 0 ? (
                                <Highlight language="javascript">
                                    {startReactCodeCount}
                                </Highlight>
                            ) : null}
                            {state.view === 2 && state.category === 0 ? (
                                <Highlight language="javascript">
                                    {startReactCodeObserver}
                                </Highlight>
                            ) : null}
                        </pre>
                    </div>
                </section>
                <section className={"codeProviderRightPanel"}>
                    {
                        leftMenuData.map((item) => (
                            <div key={item.id} onClick={() => handelCheckPreviev("view", item.id)}>
                                <span>{item.title}</span> 
                            </div>
                        ))
                    }
                </section>
            </div>
        </div>
    );
}
