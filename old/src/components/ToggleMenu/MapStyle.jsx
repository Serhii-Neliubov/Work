import {Fragment, useState} from "react";

const STYLE_MODES = {
    DEFAULT: "default",
    DARK: "dark",
    MONOCHROME: "monochrome",
    SATELLITE: "satellite",
}

const STYLE_LINKS = {
    [STYLE_MODES.DEFAULT]: "mapbox://styles/neon-factory/clle3pwwc010r01pm1k5f605b",
    [STYLE_MODES.DARK]: "mapbox://styles/neon-factory/cllwooepi00i101pjf7im44oy",
    [STYLE_MODES.MONOCHROME]: "mapbox://styles/neon-factory/cllwomphb00i401qyfp8m9u97",
    [STYLE_MODES.SATELLITE]: "mapbox://styles/neon-factory/cllwohnul00im01pfe5adhc90",
}

const MapStyle = ({map}) => {
    const [currentStyle, setCurrentStyle] = useState(STYLE_MODES.DEFAULT);
    const [mapStyleButtonOpen, setMapStyleButtonOpen] = useState(false);

    const setMapStyleHandler = (styleMode) => {
        setCurrentStyle(styleMode);
        if(currentStyle === styleMode) return;
        map.setStyle(STYLE_LINKS[styleMode]);
    }

    return (
        <Fragment>
          <button
              onClick={() => setMapStyleButtonOpen(!mapStyleButtonOpen)}
              className={`mapStyleButton ${mapStyleButtonOpen ? "mapStyleButton_open" : ""}`}
          >
            map style
          </button>
          {mapStyleButtonOpen && (
              <div className="toggleInputs">
                <div className="toggleButton">
                  <div onClick={() => setMapStyleHandler('default')}>Default</div>
                  <div className={currentStyle === 'default' ? 'switch-btn switch-on': 'switch-btn'}/>
                </div>
                <div className="toggleButton">
                  <div onClick={() => setMapStyleHandler('dark')}>Dark</div>
                  <div className={currentStyle === 'dark' ? 'switch-btn switch-on': 'switch-btn'}/>
                </div>
                <div className="toggleButton">
                  <div onClick={() => setMapStyleHandler('monochrome')}>Monochrome</div>
                  <div className={currentStyle === 'monochrome' ? 'switch-btn switch-on': 'switch-btn'}/>
                </div>
                <div className="toggleButton">
                  <div onClick={() => setMapStyleHandler('satellite')}>Satellite</div>
                  <div className={currentStyle === 'satellite' ? 'switch-btn switch-on': 'switch-btn'}/>
                </div>
              </div>
          )}
        </Fragment>
    );
};

export default MapStyle;
