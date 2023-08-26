import React from "react";

const ResetMap = ({
  map,
  setSelectedDistricts,
  removeCustomMarker,
  setIsActive,
  draw,
}) => {
  function resetMapButtonHandler() {
    removeCustomMarker();
    draw.deleteAll();
    map.flyTo({
      center: [4.387564, 50.838193],
      zoom: 11,
      bearing: 0,
      pitch: 0,
    });

    setSelectedDistricts([]);

    map.setStyle("mapbox://mapbox://styles/neon-factory/clle3pwwc010r01pm1k5f605b/neon-factory/clf8a2hoq001r01mukt9dgsmp");

    // Сбрасываем видимость надписей в боковой панели
    var sidebarLabels = document.querySelectorAll(".sidebar-label");
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
