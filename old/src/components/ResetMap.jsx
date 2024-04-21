import { useDispatch } from "react-redux";
import { controlActiveFalse } from "../redux/slices/ControlActiveSlice";
import { openBrusselsFalse } from "../redux/slices/openBrusselsSlice";
import { openTransportFalse } from "../redux/slices/openTransportSlice";
import { openCadastreFalse } from "../redux/slices/openCadastreSlice";
import { mapStyleButtonFalse } from "../redux/slices/mapStyleButtonSlice";
import { changeSqmValue } from "../redux/slices/sqmSlice";
import { selectedDistrictsChanging } from "../redux/slices/selectedDistrictsSlice";
import { centralisedDistrictTrue } from "../redux/slices/centralisedDistrictSliceActive";
import { showTransportTrue } from "../redux/slices/showTransportSlice";
import { centralisedDistrictsVisibleTrue } from "../redux/slices/centralisedDistrictsVisibleSlice";
import { servicesActionFalse } from "../redux/slices/servicesActionSlice";
import { allDistrictsVisibleTrue } from "../redux/slices/allDistrictsVisibleSlice";
import { decentralisedDistrictsVisibleTrue } from "../redux/slices/decentralisedDistrictsVisibleSlice";
import { centralisedToggleFalse } from "../redux/slices/centralisedToggleSlice";
import { decentralisedToggleFalse } from "../redux/slices/decentralisedToggleSlice";
import { allDistrictsToggleFalse } from "../redux/slices/allDistrictsToggleSlice";

const ResetMap = ({
  map,
  removeCustomMarker,
  draw,
  mapStyleSetter,
  setSelectedFeatures,
  setSelectedDistricts,
  setShowCadastre,

}) => {
  const dispatch = useDispatch();

  function resetMapButtonHandler() {
    setSelectedFeatures([]);
    removeCustomMarker();
    setSelectedDistricts([]);
    dispatch(centralisedToggleFalse());
    dispatch(allDistrictsToggleFalse());
    dispatch(decentralisedToggleFalse());
    dispatch(decentralisedDistrictsVisibleTrue());
    dispatch(showTransportTrue());
    dispatch(allDistrictsVisibleTrue());
    dispatch(servicesActionFalse());
    dispatch(centralisedDistrictsVisibleTrue());
    dispatch(changeSqmValue(0));
    dispatch(centralisedDistrictTrue());
    dispatch(selectedDistrictsChanging([]));
    dispatch(controlActiveFalse());
    dispatch(openBrusselsFalse());
    dispatch(openTransportFalse());
    setShowCadastre(false);
    dispatch(openCadastreFalse());
    dispatch(mapStyleButtonFalse());

    draw.deleteAll();
    map.flyTo({
      center: [4.387564, 50.845193],
      zoom: 10.8,
      bearing: 0,
      pitch: 0,
    });

    if (mapStyleSetter == 1) {
      map.setStyle("mapbox://styles/neon-factory/clle3pwwc010r01pm1k5f605b");
    } else if (mapStyleSetter == 2) {
      map.setStyle("mapbox://styles/neon-factory/cllwohnul00im01pfe5adhc90");
    } else if (mapStyleSetter == 3) {
      map.setStyle("mapbox://styles/neon-factory/cllwomphb00i401qyfp8m9u97");
    } else {
      map.setStyle("mapbox://styles/neon-factory/cllwooepi00i101pjf7im44oy");
    }

    const sidebarLabels = document.querySelectorAll(".sidebar-label");
    sidebarLabels.forEach(function (label) {
      label.classList.remove("hidden");
    });
  }
  return (
    <button onClick={resetMapButtonHandler} className="controlButton resetMap">
      Reset Map
    </button>
  );
};

export default ResetMap;
