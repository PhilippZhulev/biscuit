import React, { useState } from "react";

export default function App() {
    const [state, setState] = useState({
        npm: true
    });

    const handleInstallType = (st) => {
        setState({ ...state, npm: st });
    };

    return (
        <div className={"app"}>
            <div className={"intro"}>
                <div className={"introTitle"}>
                    <div className={"introLogo"}>
                        <svg
                            version="1.1"
                            width="55px"
                            height="55px"
                            viewBox="0 0 1000 1000"
                        >
                            <g>
                                <path
                                    fill="#fff"
                                    d="M239,456.5c16.7,0,30.2-13.5,30.2-30.2v-2.1c0-16.7-13.5-30.2-30.2-30.2c-16.7,0-30.2,13.5-30.2,30.2v2.1C208.8,443,222.3,456.5,239,456.5L239,456.5z M380.3,640.3c16.7,0,30.2-13.5,30.2-30.2V608c0-16.6-13.5-30.1-30.2-30.1s-30.2,13.5-30.2,30.1v2.1C350.2,626.8,363.7,640.3,380.3,640.3L380.3,640.3z M648.9,628.3c16.7,0,30.2-13.5,30.2-30.2V596c0-16.7-13.5-30.2-30.2-30.2c-16.7,0-30.2,13.5-30.2,30.2v2.1C618.7,614.8,632.2,628.3,648.9,628.3L648.9,628.3z M832.6,472.8c16.6,0,30.2-13.5,30.2-30.2v-2.1c0-16.7-13.5-30.2-30.2-30.2c-16.7,0-30.2,13.5-30.2,30.2v2.1C802.5,459.3,816,472.8,832.6,472.8L832.6,472.8z M394.5,289c16.7,0,30.2-13.5,30.2-30.2v-2.1c0-16.7-13.5-30.2-30.2-30.2c-16.7,0-30.2,13.5-30.2,30.2v2.1C364.3,275.5,377.8,289,394.5,289L394.5,289z M663,286.9c16.7,0,30.2-13.5,30.2-30.2v-2.1c0-16.7-13.5-30.2-30.2-30.2c-16.7,0-30.2,13.5-30.2,30.2v2.1C632.9,273.4,646.4,286.9,663,286.9L663,286.9z M521.7,442.4c16.6,0,30.1-13.5,30.1-30.2v-2.1c0-16.7-13.5-30.2-30.1-30.2s-30.2,13.5-30.2,30.2v2.1C491.5,428.9,505,442.4,521.7,442.4L521.7,442.4z M990,434c0-91.1-49.4-176.1-139.1-239.2c-86.5-60.8-200.9-94.3-322.2-94.3c-121.3,0-235.7,33.5-322.2,94.3C126.1,251.4,78.1,325.7,69.1,406.2c-3.6,2.1-6.9,5-9.5,8.7C27.2,461.2,10,513.5,10,566c0,91.1,49.4,176.1,139.1,239.2c86.5,60.8,200.9,94.3,322.2,94.3c236.2,0,433.4-127.7,458.6-297.1c0.2-1.1,0.3-2.2,0.3-3.2C969.2,549.6,990,493.1,990,434L990,434z M528.7,160.8c221.1,0,401,122.6,401,273.2c0,150.6-179.9,273.2-401,273.2c-221.1,0-401-122.6-401-273.2C127.8,283.3,307.7,160.8,528.7,160.8L528.7,160.8z M744.4,765.5c-74.6,47.6-171.6,73.8-273.2,73.8c-221.1,0-401-122.6-401-273.2c0-19.3,3-38.2,8.8-56.7c19.5,62,63.1,118.6,127.5,163.9c86.5,60.8,200.9,94.3,322.2,94.3c112.1,0,218.3-28.7,302-81.1C809.4,715.7,780.3,742.6,744.4,765.5L744.4,765.5z"
                                />
                            </g>
                        </svg>
                    </div>
                    <div>
                        <b>Biscuit</b>-store <span>ver: 0.9.0 beta</span>
                    </div>
                </div>
                <p className={"introText"}>
          Library of tools for working with javascript application states
                </p>
                <button className={"btnStarted"}>Get started</button>
                <div className={"installPanel"}>
                    <section className={"installTitle"}>
            installation:
                        <button
                            onClick={() => handleInstallType(true)}
                            className={`btnMini ${state.npm ? "active" : ""}`}
                        >
              npm
                        </button>
                        <button
                            onClick={() => handleInstallType(false)}
                            className={`btnMini ${!state.npm ? "active" : ""}`}
                        >
              yarn
                        </button>
                    </section>
                    {state.npm ? (
                        <div>npm install @biscuit-store/core</div>
                    ) : (
                        <div>yarn add @biscuit-store/core</div>
                    )}
                    <span>if ReactJs, add</span>
                    {state.npm ? (
                        <div>npm install @biscuit-store/react</div>
                    ) : (
                        <div>yarn add @biscuit-store/react</div>
                    )}
                </div>
            </div>
            <div className={"box"}>
                <div className={"grid"}>
                    <div className={"tile"}>
                        <div className={"title"}>components-1 ACTION_A</div>
                    </div>
                    <div className={"tile"}>
                        <div className={"title"}>components-2 ACTION_B</div>
                    </div>
                    <div className={"tile"}>
                        <div className={"title"}>components-3 ACTION_C</div>
                    </div>
                    <div className={"tile"}>
                        <div className={"title"}>components-4 ACTION_D</div>
                    </div>
                    <div className={"tile"}>
                        <div className={"title"}>components-5 ACTION_F</div>
                    </div>
                    <div className={"tile"}>
                        <div className={"title"}>components-6 ACTION_G</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
