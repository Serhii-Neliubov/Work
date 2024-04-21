import { useDispatch, useSelector } from "react-redux";
import { mapStyleButtonChanging } from "../../redux/slices/mapStyleButtonSlice";
import DefaultStyle from "../MapStyleButtons/DefaultStyle";
import DarkStyle from "../MapStyleButtons/DarkStyle";
import MonochromeStyle from "../MapStyleButtons/MonochromeStyle";
import SatelliteStyle from "../MapStyleButtons/SatelliteStyle";
import {Fragment} from "react";

const OpenMapStyleButton = ({
  map,
  setMapStyleSetter,
  mapStyleSetter,
  setSelectedDistricts,
  setShowCadastre,
}) => {
  const dispatch = useDispatch();
  const mapStyleButtonOpen = useSelector(
    (state) => state.mapStyleButton.value
  );
  return (
    <Fragment>
      <button
        onClick={() => dispatch(mapStyleButtonChanging())}
        className={`mapStyleButton ${
          mapStyleButtonOpen ? "mapStyleButton_open" : ""
        }`}
      >
        map style
      </button>
      {mapStyleButtonOpen ? (
        <div className="toggleInputs">
          <DefaultStyle
            map={map}
            setShowCadastre={setShowCadastre}
            mapStyleSetter={mapStyleSetter}
            setMapStyleSetter={setMapStyleSetter}
            setSelectedDistricts={setSelectedDistricts}
          />
          <DarkStyle
            map={map}
            setShowCadastre={setShowCadastre}
            mapStyleSetter={mapStyleSetter}
            setMapStyleSetter={setMapStyleSetter}
            setSelectedDistricts={setSelectedDistricts}
          />
          <MonochromeStyle
            setShowCadastre={setShowCadastre}
            setMapStyleSetter={setMapStyleSetter}
            map={map}
            mapStyleSetter={mapStyleSetter}
            setSelectedDistricts={setSelectedDistricts}
          />
          <SatelliteStyle
            setShowCadastre={setShowCadastre}
            map={map}
            mapStyleSetter={mapStyleSetter}
            setMapStyleSetter={setMapStyleSetter}
            setSelectedDistricts={setSelectedDistricts}
          />
        </div>
      ) : null}
    </Fragment>
  );
};

export default OpenMapStyleButton;
