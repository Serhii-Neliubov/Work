import {Fragment, useRef, useState} from "react";

export default function ToolsButton({colorPicker, changeColor, drawMode}) {
    const [isOpen, setIsOpen] = useState(false);
    const container = useRef();

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
            <div id='toolsContainer' ref={container} onClick={e => console.log(e)}>
                <input
                    type="color"
                    ref={colorPicker}
                    id="colorPicker"
                    className="palette"
                    onChange={changeColor}
                />
                <div className='toolsButton_text'>
                    <span style={drawMode === 'draw_line_string' ? {color: '#4cc0ad'} : {}}>Line Tool</span>
                    <span style={drawMode === 'draw_polygon' ? {color: '#4cc0ad'} : {}}>Polygon Tool</span>
                    <span style={drawMode === 'draw_point' ? {color: '#4cc0ad'} : {}}>Marker Tool</span>
                    <span>Trash Tool</span>
                    <span>Color Tool</span>
                </div>
            </div>
        </Fragment>
    )
}
