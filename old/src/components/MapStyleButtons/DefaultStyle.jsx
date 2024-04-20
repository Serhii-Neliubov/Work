import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { decentralisedToggleFalse } from "../../redux/slices/decentralisedToggleSlice";
import { allDistrictsToggleFalse } from "../../redux/slices/allDistrictsToggleSlice";
import { centralisedToggleFalse } from "../../redux/slices/centralisedToggleSlice";
import { showCadastreFalse } from "../../redux/slices/showCadastreSlice";
import { showTransportTrue } from "../../redux/slices/showTransportSlice";
import { servicesActionFalse } from "../../redux/slices/servicesActionSlice";

const DefaultStyle = ({
  mapStyleSetter,
  map,
  setMapStyleSetter,
  setSelectedDistricts,
  setShowCadastre,
}) => {
  const [toggleClass, setToggleClass] = useState("");
  const [toggle, setToggle] = useState(true);
  const dispatch = useDispatch();

  function defaultStyleHandler() {
    map.setStyle("mapbox://styles/neon-factory/clle3pwwc010r01pm1k5f605b");
    dispatch(showCadastreFalse());
    setMapStyleSetter(1);
    dispatch(showTransportTrue());
    setShowCadastre(false);
    dispatch(servicesActionFalse());

    setSelectedDistricts([]);
    dispatch(centralisedToggleFalse());

    // setIsModalActive(false);
    dispatch(decentralisedToggleFalse());

    dispatch(allDistrictsToggleFalse());
  }
  const handleClick = () => {
    setToggle(true);
  };
  useEffect(() => {
    if (mapStyleSetter == 1) {
      setToggleClass("switch-btn switch-on");
    } else {
      setToggleClass("switch-btn");
    }
  }, [toggle, mapStyleSetter]);
  return (
    <div
      onClick={() => {
        handleClick();
        defaultStyleHandler();
      }}
      className="toggleButton"
    >
      <div onClick={handleClick}>Default</div>
      <div className={toggleClass}></div>
    </div>
  );
};

export default DefaultStyle;
