import { useEffect, useState } from "react";
import { showCadastreFalse } from "../../redux/slices/showCadastreSlice";
import { centralisedToggleFalse } from "../../redux/slices/centralisedToggleSlice";
import { decentralisedToggleFalse } from "../../redux/slices/decentralisedToggleSlice";
import { allDistrictsToggleFalse } from "../../redux/slices/allDistrictsToggleSlice";
import { showTransportTrue } from "../../redux/slices/showTransportSlice";
import { servicesActionFalse } from "../../redux/slices/servicesActionSlice";
import { useDispatch } from "react-redux";

const MonochromeStyle = ({
  mapStyleSetter,
  map,
  setSelectedDistricts,
  setMapStyleSetter,
  setShowCadastre,
}) => {
  const [toggleClass, setToggleClass] = useState("");
  const [toggle, setToggle] = useState(true);
  const dispatch = useDispatch();
  function monochromeStyleHandler() {
    map.setStyle("mapbox://styles/neon-factory/cllwomphb00i401qyfp8m9u97");
    dispatch(showCadastreFalse());

    setMapStyleSetter(3);

    setSelectedDistricts([]);
    dispatch(centralisedToggleFalse());
    dispatch(decentralisedToggleFalse());
    setShowCadastre(false);
    dispatch(allDistrictsToggleFalse());
    dispatch(showTransportTrue());
    // setIsModalActive(true);
    dispatch(servicesActionFalse());
  }

  const handleClick = () => {
    setToggle(true);
  };
  useEffect(() => {
    if (mapStyleSetter == 3) {
      setToggleClass("switch-btn switch-on");
    } else {
      setToggleClass("switch-btn");
    }
  }, [toggle, mapStyleSetter]);
  return (
    <div
      onClick={() => {
        monochromeStyleHandler();
        handleClick();
      }}
      className="toggleButton"
    >
      <div onClick={handleClick}>Monochrome</div>
      <div className={toggleClass}></div>
    </div>
  );
};

export default MonochromeStyle;
