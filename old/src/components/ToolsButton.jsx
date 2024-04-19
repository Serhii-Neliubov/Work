import {Fragment, useState} from "react";

export default function ToolsButton() {
    const [isOpen, setIsOpen] = useState(false);
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
            {isOpen &&
                <div className="toggleInputs">
                </div>
            }
        </Fragment>
    )
}