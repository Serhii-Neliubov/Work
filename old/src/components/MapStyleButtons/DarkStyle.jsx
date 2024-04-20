import React, { useEffect, useState } from "react";
import { centralisedToggleFalse } from "../../redux/slices/centralisedToggleSlice";
import { decentralisedToggleFalse } from "../../redux/slices/decentralisedToggleSlice";
import { allDistrictsToggleFalse } from "../../redux/slices/allDistrictsToggleSlice";
import { showTransportTrue } from "../../redux/slices/showTransportSlice";
import { servicesActionFalse } from "../../redux/slices/servicesActionSlice";
import { showCadastreFalse } from "../../redux/slices/showCadastreSlice";
import { useDispatch } from "react-redux";

const DarkStyle = ({
  mapStyleSetter,
  map,
  setSelectedDistricts,
  setMapStyleSetter,
  setShowCadastre,
}) => {
  const [toggleClass, setToggleClass] = useState("");
  const [toggle, setToggle] = useState(true);
  const dispatch = useDispatch();

  function darkStyleHandler() {
    map.setStyle("mapbox://styles/neon-factory/cllwooepi00i101pjf7im44oy");
    dispatch(showCadastreFalse());
    setMapStyleSetter(4);
    setSelectedDistricts([]);
    dispatch(centralisedToggleFalse());
    dispatch(decentralisedToggleFalse());
    setShowCadastre(false);
    dispatch(allDistrictsToggleFalse());
    // setIsModalActive(true);
    dispatch(showTransportTrue());

    dispatch(servicesActionFalse());
  }

  const handleClick = () => {
    setToggle(true);
  };
  useEffect(() => {
    if (mapStyleSetter == 4) {
      setToggleClass("switch-btn switch-on");
    } else {
      setToggleClass("switch-btn");
    }
  }, [toggle, mapStyleSetter]);
  return (
    <div
      onClick={() => {
        darkStyleHandler();
        handleClick();
      }}
      className="toggleButton"
    >
      <div>Dark</div>
      <div className={toggleClass}></div>
    </div>
  );
};

export default DarkStyle;
