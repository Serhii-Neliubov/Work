import {Fragment, useEffect, useRef, useState} from "react";

export default function ToolsButton({colorPicker, changeColor, drawMode}) {
    const [isOpen, setIsOpen] = useState(false);
    const container = useRef();

    if (container.current) {
        container.current.style.display = isOpen ? "block" : "none";
    }

    return (
        <Fragment>
            {drawMode}
            <button
                className={`BrusselsButton BrusselsButton_bg ${
                    isOpen ? "BrusselsButton_open" : ""
                }`}
                onClick={() => setIsOpen(!isOpen)}
            >
                tools
            </button>
            <div id='toolsContainer' ref={container} onClick={e => console.log(e)}>
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
