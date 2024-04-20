import {Fragment, useEffect, useRef, useState} from "react";

export default function ToolsButton({colorPicker, changeColor, draw}) {
    const [currentMode, setCurrentMode] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const container = useRef();

    if (container.current) {
        container.current.style.display = isOpen ? "block" : "none";
    }

    if(currentMode) {
        console.log(currentMode)
    }

    useEffect(() => {
        if(!draw) return;

        setTimeout(() => {
            setCurrentMode(draw);
            console.log('draw', draw.getMode());
        }, 1000)

    }, [draw]);

    return (
        <Fragment>
            <button
                className={`BrusselsButton BrusselsButton_bg ${
                    isOpen ? "BrusselsButton_open" : ""
                }`}
                onClick={() => setIsOpen(!isOpen)}
            >
                tools
            </button>
            <div id='toolsContainer' ref={container}>
                <input
                    type="color"
                    ref={colorPicker}
                    id="colorPicker"
                    className="palette"
                    onChange={changeColor}
                />
            </div>
        </Fragment>
    )
}
