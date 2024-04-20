import {Fragment, useRef, useState} from "react";

export default function ToolsButton({colorPicker, changeColor}) {
    const [isOpen, setIsOpen] = useState(false);
    const container = useRef();

    // Use optional chaining to access container.current safely
    if (container.current) {
        container.current.style.display = isOpen ? "block" : "none";
    }

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
