import {Fragment, useState} from "react";

export default function ToolsButton({colorPicker, changeColor}) {
    const [isOpen, setIsOpen] = useState(true);
    return (
        <Fragment>
            <button
                className={`mapStyleButton ${
                    isOpen ? "mapStyleButton_open" : ""
                }`}
                onClick={() => setIsOpen(!isOpen)}
            >
                tools
            </button>
            <div id='toolsContainer'>
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