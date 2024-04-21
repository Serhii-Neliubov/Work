import {useEffect, useState, useRef, useCallback, Fragment} from "react";

// MapBox
import mapboxgl from "mapbox-gl";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import MapboxDraw from "@mapbox/mapbox-gl-draw";

// Css
import "./App.css";
import "mapbox-gl/dist/mapbox-gl.css";
import "mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";
import pin from "./assets/images/pin.png";
import logo from "./assets/images/WISE_MAPPING_LOGO.png";
// Components
import ResetMap from "./components/ResetMap.jsx";
import PrintScreen from "./components/PrintScreen.jsx";
import AllDistrictsButton from "./components/ToggleMenu/AllDistrictsButton.jsx";
// Utils
import defaultDrawStyles from "./utils/DefaultDrawStyles";
//Map functions
import {
  removeCustomMarker,
  toggleDistrictsVisibility,
  toggleButton,
  createMarkerElement,
} from "./utils/MapFunctions";
import ToggleMenu from "./components/ToggleMenu/ToggleMenu.jsx";
// Redux
import { useDispatch, useSelector } from "react-redux";
import { openBrusselsChanging } from "./redux/slices/openBrusselsSlice";
import {
  centralisedDistrictsVisibleFalse,
  centralisedDistrictsVisibleTrue,
} from "./redux/slices/centralisedDistrictsVisibleSlice";
import {
  decentralisedDistrictsVisibleFalse,
  decentralisedDistrictsVisibleTrue,
} from "./redux/slices/decentralisedDistrictsVisibleSlice";
import {
  allDistrictsSelectedFalse,
  allDistrictsSelectedTrue,
} from "./redux/slices/allDistrictsSelectedSlice";
import {
  centralisedToggleFalse,
  centralisedToggleTrue,
} from "./redux/slices/centralisedToggleSlice";
import {
  decentralisedToggleFalse,
  decentralisedToggleTrue,
} from "./redux/slices/decentralisedToggleSlice";
import Container from "./components/Container.jsx";
import OpenTranportButton from "./components/ToggleMenu/OpenTranportButton.jsx";
import OpenCadastreButton from "./components/ToggleMenu/OpenCadastreButton.jsx";
import MapStyle from "./components/ToggleMenu/MapStyle.jsx";
import ToolsButton from "./components/ToolsButton.jsx";

function App() {
  const dispatch = useDispatch();

  const [map, setMap] = useState(null);
  const [draw, setDraw] = useState(null);
  const [drawMode, setDrawMode] = useState(null);

  const openBrussels = useSelector((state) => state.openBrussels.value);
  const [showCadastre, setShowCadastre] = useState(false);
  const [showLoader, setShowLoader] = useState(true);

  const isCentralisedDistrictsVisible = useSelector(
    (state) => state.centralisedDistrictsVisible.value
  );
  const isAllDistrictsVisible = useSelector(
    (state) => state.allDistrictsVisible.value
  );
  const isDecentralisedDistrictsVisible = useSelector(
    (state) => state.decentralisedDistrictsVisible.value
  );

  const [selectedDistricts, setSelectedDistricts] = useState([]);
  const colorPicker = useRef();
  const geocoderContainer = useRef();
  const newDrawFeature = useRef(false);
  const sidebarButton = useRef();
  const sidebar = useRef();
  const allDistricts = [
    "SW",
    "SE",
    "CD",
    "EU",
    "NE",
    "NW",
    "Airport",
    "Louise",
    "North",
    "South",
  ];
  const centralisedDistricts = ["Louise", "North", "South", "CD", "EU"];
  const decentralisedDistricts = ["NE", "NW", "SW", "SE"];

  const [Sqm, setSqml] = useState(0);

  const [mapStyleSetter, setMapStyleSetter] = useState(1);
  const [hoveredFeatureId, setHoveredFeatureId] = useState(null);

  const MAPBOX_ACCESS_TOKEN = useRef(
    "pk.eyJ1IjoibmVvbi1mYWN0b3J5IiwiYSI6ImNrcWlpZzk1MzJvNWUyb3F0Z2UzaWZ5emQifQ.T-AqPH9OSIcwSLxebbyh8A"
  );

  const customTilesetLayer = {
    id: "custom-tileset-layer",
    type: "fill",
    source: {
      type: "vector",
      url: "mapbox://neon-factory.12ssh55s",
    },
    "source-layer": "Bruxelles_Cadastre_complet-7xijuk",
    paint: {
      "fill-color": [
        "case",
        ["boolean", ["feature-state", "hover"], false],
        "black",
        "rgba(255, 255, 255, 0)",
      ],
      "fill-opacity": 0.2,
    },
  };

  const customTilesetLineLayer = {
    id: "custom-tileset-line-layer",
    type: "line",
    source: {
      type: "vector",
      url: "mapbox://neon-factory.12ssh55s",
    },
    "source-layer": "Bruxelles_Cadastre_complet-7xijuk",
    paint: {
      "line-color": [
        "match",
        ["get", "CaPaKey"], // The attribute to match
        "specificValue1",
        "rgb(255, 0, 0)", // When CaPaKey matches specificValue1
        "specificValue2",
        "rgb(0, 255, 0)", // When CaPaKey matches specificValue2
        "rgba(255, 255, 255, 0)", // Default color when there is no match
      ],
    },
  };

  useEffect(() => {
    if (!map || !showCadastre) return;

    const handleMouseMove = (e) => {
      map.getCanvas().style.cursor = "pointer";

      if (hoveredFeatureId) {
        map.setFeatureState(
          {
            source: "custom-tileset-layer",
            sourceLayer: "Bruxelles_Cadastre_complet-7xijuk",
            id: hoveredFeatureId,
          },
          { hover: false }
        );
      }

      if (e.features.length > 0) {
        const newHoveredFeatureId = e.features[0].id;
        setHoveredFeatureId(newHoveredFeatureId);
        map.setFeatureState(
          {
            source: "custom-tileset-layer",
            sourceLayer: "Bruxelles_Cadastre_complet-7xijuk",
            id: newHoveredFeatureId,
          },
          { hover: true }
        );

        const CaPaKey = e.features[0].properties.CaPaKey;
        map.setPaintProperty("custom-tileset-layer", "fill-color", [
          "match",
          ["get", "CaPaKey"],
          CaPaKey,
          "rgba(0,0,0, 0.4)",
          "rgba(255,255,255,0)",
        ]);
      }
    };

    const handleMouseLeave = () => {
      map.getCanvas().style.cursor = "";

      if (hoveredFeatureId) {
        map.setFeatureState(
          {
            source: "custom-tileset-layer",
            sourceLayer: "Bruxelles_Cadastre_complet-7xijuk",
            id: hoveredFeatureId,
          },
          { hover: false }
        );
        setHoveredFeatureId(null);

        map.setPaintProperty(
          "custom-tileset-layer",
          "fill-color",
          "rgba(255,255,255,0)"
        );
      }
    };

    map.on("mousemove", "custom-tileset-layer", handleMouseMove);
    map.on("mouseleave", "custom-tileset-layer", handleMouseLeave);

    return () => {
      map.off("mousemove", "custom-tileset-layer", handleMouseMove);
      map.off("mouseleave", "custom-tileset-layer", handleMouseLeave);
    };
  }, [map, showCadastre, hoveredFeatureId]);

  useEffect(() => {
    if (!map) return;

    if (!showCadastre && hoveredFeatureId) {
      map.setPaintProperty(
        "custom-tileset-layer",
        "fill-color",
        "rgba(255,255,255,0)"
      );

      map.setFeatureState(
        {
          source: "custom-tileset-layer",
          sourceLayer: "Bruxelles_Cadastre_complet-7xijuk",
          id: hoveredFeatureId,
        },
        { hover: false }
      );

      setHoveredFeatureId(null);
    }
  }, [map, showCadastre, hoveredFeatureId]);

  useEffect(() => {
    if (!map || !hoveredFeatureId) return;

    const featureState = {
      source: "custom-tileset-layer",
      sourceLayer: "Bruxelles_Cadastre_complet-7xijuk",
      id: hoveredFeatureId,
    };

    map.setFeatureState(featureState, { hover: true });
    return () => {
      map.setFeatureState(featureState, { hover: false });
    };
  }, [map, hoveredFeatureId]);
  const resetLayerStyles = useCallback(() => {
    map.setPaintProperty("custom-tileset-line-layer", "line-color", [
      "match",
      ["get", "CaPaKey"],
      "specificValue1",
      "rgb(255, 0, 0)",
      "specificValue2",
      "rgb(0, 255, 0)",
      "rgba(255, 255, 255, 0)",
    ]);
  });

  const [selectedFeatures, setSelectedFeatures] = useState([]);

  useEffect(() => {
    if (map) {
      if (showCadastre) {
        map.on("click", "custom-tileset-layer", function (e) {
          let features = map.queryRenderedFeatures(e.point, {
            layers: ["custom-tileset-layer"],
          });

          if (features.length > 0) {
            let feature = features[0];
            let index = selectedFeatures.indexOf(feature.properties.CaPaKey);
            if (index === -1) {
              setSelectedFeatures([
                ...selectedFeatures,
                feature.properties.CaPaKey,
              ]);
              map.setFeatureState(
                {
                  source: "custom-tileset-layer",
                  sourceLayer: "Bruxelles_Cadastre_complet-7xijuk",
                  id: feature.id,
                },
                { selected: true }
              );
            } else {
              const updatedSelectedFeatures = [...selectedFeatures];
              updatedSelectedFeatures.splice(index, 1);
              setSelectedFeatures(updatedSelectedFeatures);
              map.setFeatureState(
                {
                  source: "custom-tileset-layer",
                  sourceLayer: "Bruxelles_Cadastre_complet-7xijuk",
                  id: feature.id,
                },
                { selected: false }
              );
            }
          }
        });
      }
      if (showCadastre) {
        map.on("idle", function () {
          if (selectedFeatures.length === 0) {
            resetLayerStyles();
          } else {
            const lineColorExpression = [
              "match",
              ["to-string", ["get", "CaPaKey"]],
              ...selectedFeatures.flatMap((feature) => [
                String(feature),
                "rgb(255,0,0)",
              ]),
              "rgba(255,255,255,0)",
            ];
            map.setPaintProperty(
              "custom-tileset-line-layer",
              "line-color",
              lineColorExpression
            );
          }
        });
      }
      return () => {
        map.off("click", "custom-tileset-layer");
        map.off("idle");
      };
    }
  }, [map, selectedFeatures, showCadastre, resetLayerStyles]);

  useEffect(() => {
    if (map && map.isStyleLoaded()) {
      const updateStyles = () => {
        if (!showCadastre && selectedDistricts.length === 0) {
          resetLayerStyles();
        } else if (selectedFeatures.length === 0) {
          resetLayerStyles();
        } else {
          const lineColorExpression = [
            "match",
            ["to-string", ["get", "CaPaKey"]],
            ...selectedFeatures.flatMap((feature) => [
              String(feature),
              "rgb(255,0,0)",
            ]),
            "rgba(255,255,255,0)",
          ];
          map.setPaintProperty(
            "custom-tileset-line-layer",
            "line-color",
            lineColorExpression
          );
        }
      };

      map.on("idle", updateStyles);

      return () => {
        map.off("idle", updateStyles);
      };
    }
  }, [selectedFeatures, map, showCadastre, selectedDistricts.length]);

  useEffect(() => {
    setTimeout(() => {
      setShowLoader(false);
    }, 3000);
    mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN.current;

    let mapSettings = {
      container: "map",
      style: "mapbox://styles/neon-factory/clle3pwwc010r01pm1k5f605b",
      center: [4.387564, 50.845193],
      zoom: 10.8,
      preserveDrawingBuffer: true,
    };

    let map = new mapboxgl.Map(mapSettings);
    let imageElement = document.createElement("img");
    imageElement.src = pin;

    map.on('styledata', function() {
      if(!map.hasImage('custom-marker')){
        map.addImage('custom-marker', imageElement);
      }
    });

    map.on('draw.modechange', function (e) {
      setDrawMode(e.mode);
    });

    setMap(map);


    let geocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      mapboxgl: mapboxgl,
      placeholder: "Your Address Here",
      marker: {
        draggable: true,
        element: createMarkerElement(),
        animate: false,
      },
      clearOnBlur: false,
    });

    const draw = new MapboxDraw({
      userProperties: true,
      controls: {
        combine_features: false,
        uncombine_features: false,
      },
      marker: false,
      styles: defaultDrawStyles,
    });

    const drawAdapter = {
      onAdd: function (map){
          const container = document.getElementById("toolsContainer");
          const sidebar = document.getElementsByClassName("mainToggleButtons");
          const mapContainer = draw.onAdd(map);

          const mapboxGL = container.getElementsByClassName('mapboxgl-ctrl-group');
          if(mapboxGL.length){
            container.removeChild(mapboxGL[0]);
          }

          container.appendChild(mapContainer);
          sidebar[0].appendChild(container);

          return document.createElement('span');
      },
      onRemove: function (map){
        return draw.onRemove(map);
      },
    }

    function addLayerIfAbsent(map, layer) {
      if (!map.getLayer(layer.id)) {
        map.addLayer(layer);
      }
    }
    map.on("styledata", function () {
      addLayerIfAbsent(map, customTilesetLayer);
      addLayerIfAbsent(map, customTilesetLineLayer);
    });

    const marker = document.getElementById("distance-marker");
    map.on("draw.delete", function () {
      document.getElementById("distance-marker").style.display = "none";
    });

    setDraw(draw);

    map.addControl(new mapboxgl.NavigationControl());

    map.on("load", function () {
      addLayerIfAbsent(map, customTilesetLayer);
      addLayerIfAbsent(map, customTilesetLineLayer);
      map.addControl(drawAdapter);
      map.setLayoutProperty("poi-label", "visibility", "none");
    });

    map.on("click", function (e) {
      if (!newDrawFeature.current) {
        var drawFeatureAtPoint = draw.getFeatureIdsAt(e.point);

        MAPBOX_ACCESS_TOKEN.current = drawFeatureAtPoint.length
          ? drawFeatureAtPoint[0]
          : "";
        if (drawFeatureAtPoint.length) {
          var clickedFeature = draw.get(drawFeatureAtPoint[0]);
          showPolygonArea(clickedFeature);
        } else {
          setSqml(0);
        }
      }

      newDrawFeature.current = false;
    });

    map.on("click", "0", function (e) {
      const clickedPolygon = e.features[0];
      showPolygonArea(clickedPolygon);
    });

    function showPolygonArea(polygonFeature) {
      const area = turf.area(polygonFeature.geometry);
      const sqm = Math.round(area * 100) / 100;

      setSqml(sqm);
    }

    let drawingCompleted = false;
    map.on("draw.create", function (e) {
      const feature = e.features[0];

      if (feature.geometry.type === "LineString") {
        const distance = turf.length(feature);

        let displayedDistance;

        if (distance < 1000) {
          displayedDistance = Math.round(distance * 1000).toString();
        } else {
          displayedDistance =
            distance.toLocaleString(undefined, { minimumFractionDigits: 2 }) +
            " m";
        }

        const lastCoord =
          feature.geometry.coordinates[feature.geometry.coordinates.length - 1];

        const markerPosition = new mapboxgl.LngLat(lastCoord[0], lastCoord[1]);

        document.getElementById("distance-value").textContent =
          displayedDistance + " m";

        marker.style.left = `${map.project(markerPosition).x}px`;
        marker.style.top = `${map.project(markerPosition).y}px`;
        marker.style.display = "block";
      } else if (feature.geometry.type === "Polygon") {
        drawingCompleted = false;
      }

      newDrawFeature.current = true;
      updateArea(e);

      map.once("dblclick", function (dblClickEvt) {
        if (drawingCompleted) {
          const featuresAtClick = map.queryRenderedFeatures(dblClickEvt.point);
          if (featuresAtClick.length > 0) {
            const selectedFeature = featuresAtClick[0];
            if (selectedFeature.geometry.type === "Polygon") {
              map.setFeatureProperty(selectedFeature.id, "active", "false");
            }
          }
        }
      });
    });

    map.on("draw.create", function (e) {
      const feature = e.features[0];

      if (feature.geometry.type === "Polygon") {
        drawingCompleted = true;
      }
    });

    document
      .getElementById("distance-close")
      .addEventListener("click", function () {
        hideDistanceMenu();
      });

    function hideDistanceMenu() {
      marker.style.display = "none";
    }

    map.on("draw.delete", function () {
      newDrawFeature.current = true;
      setSqml(0);
    });

    map.on("draw.update", function (e) {
      const updatedFeature = e.features[0];

      if (updatedFeature.geometry.type === "LineString") {
        const distance = turf
          .length(updatedFeature)
          .toFixed(3)
          .toLocaleString(undefined, { minimumFractionDigits: 2 });

        const secondPointCoord = updatedFeature.geometry.coordinates[1];

        const menuPosition = new mapboxgl.LngLat(
          secondPointCoord[0],
          secondPointCoord[1]
        );

        if (distance < 1000) {
          document.getElementById("distance-value").textContent = `${(
            distance * 1000
          ).toFixed(0)} m`;
        } else {
          document.getElementById(
            "distance-value"
          ).textContent = `${distance} m`;
        }

        marker.style.left = `${map.project(menuPosition).x}px`;
        marker.style.top = `${map.project(menuPosition).y}px`;
      } else if (updatedFeature.geometry.type === "Polygon") {
        const area = turf.area(updatedFeature.geometry);
        const sqm = Math.round(area * 100) / 100;
        setSqml(sqm);
      }
    });

    const geocoderContainerRef = geocoderContainer.current;
    geocoderContainerRef.appendChild(geocoder.onAdd(map));

    function updateArea(e) {
      const selectedFeature = e.features[0];
      if (selectedFeature) {
        const area = turf.area(selectedFeature.geometry);
        const sqm = Math.round(area * 100) / 100;
        setSqml(sqm);
      }
    }

    return () => {
      geocoderContainerRef.removeChild(geocoderContainerRef.firstChild);
    };
  }, []);

  function changeColor() {
    let selectedColor = colorPicker.current.value;
    if (MAPBOX_ACCESS_TOKEN.current !== "" && typeof draw === "object") {
      draw.setFeatureProperty(
        MAPBOX_ACCESS_TOKEN.current,
        "portColor",
        selectedColor
      );

      let feat = draw.get(MAPBOX_ACCESS_TOKEN.current);
      draw.add(feat);
    }
  }

  function allDistrictsButtonHandler() {
    if (isAllDistrictsVisible) {
      dispatch(decentralisedToggleTrue());
      dispatch(centralisedToggleTrue());
      dispatch(decentralisedDistrictsVisibleFalse());
      dispatch(centralisedDistrictsVisibleFalse());

      setSelectedDistricts(allDistricts);
      toggleDistrictsVisibility(selectedDistricts, map);

      if (mapStyleSetter === 1) {
        map.setStyle("mapbox://styles/neon-factory/clle3pwwc010r01pm1k5f605b");
        setShowCadastre(false);
      } else if (mapStyleSetter === 2) {
        map.setStyle("mapbox://styles/neon-factory/cllwohnul00im01pfe5adhc90");
        setShowCadastre(false);
      } else if (mapStyleSetter === 3) {
        map.setStyle("mapbox://styles/neon-factory/cllwomphb00i401qyfp8m9u97");
        setShowCadastre(false);
      } else {
        map.setStyle("mapbox://styles/neon-factory/cllwooepi00i101pjf7im44oy");
        setShowCadastre(false);
      }
      dispatch(allDistrictsSelectedTrue());
    } else {
      dispatch(decentralisedToggleFalse());
      dispatch(decentralisedDistrictsVisibleTrue());
      dispatch(centralisedToggleFalse());
      dispatch(centralisedDistrictsVisibleTrue());
      setSelectedDistricts([]);
      allDistricts.forEach((district) => {
        if (selectedDistricts.includes(district)) {
          toggleButton(district, selectedDistricts, map);
        }
      });
      toggleDistrictsVisibility(selectedDistricts, map);
      dispatch(allDistrictsSelectedFalse());
    }
  }

  function centralisedDistrictsButtonHandler() {
    if (isCentralisedDistrictsVisible) {
      dispatch(decentralisedToggleFalse());

      dispatch(decentralisedDistrictsVisibleTrue());
      setSelectedDistricts(centralisedDistricts);
      toggleDistrictsVisibility(centralisedDistricts, map);

      dispatch(centralisedDistrictsVisibleFalse());
    } else {
      const withoutCentralisedDistricts = selectedDistricts.filter(
        (district) => !centralisedDistricts.includes(district)
      );
      setSelectedDistricts(withoutCentralisedDistricts);
      toggleDistrictsVisibility(withoutCentralisedDistricts, map);
      dispatch(centralisedDistrictsVisibleTrue());
    }
  }

  function toggleSidebar() {
    sidebar.current.classList.toggle("sidebar-active");
    sidebarButton.current.classList.toggle("closeSidebar");
  }

  function decentralisedDistrictsButtonHandler() {
    if (isDecentralisedDistrictsVisible) {
      dispatch(centralisedToggleFalse());

      dispatch(centralisedDistrictsVisibleTrue());

      setSelectedDistricts(decentralisedDistricts);
      toggleDistrictsVisibility(decentralisedDistricts, map);

      dispatch(decentralisedDistrictsVisibleFalse());
    } else {
      const withoutDecentralisedDistricts = selectedDistricts.filter(
        (district) => !decentralisedDistricts.includes(district)
      );
      setSelectedDistricts(withoutDecentralisedDistricts);
      toggleDistrictsVisibility(withoutDecentralisedDistricts, map);
      dispatch(decentralisedDistrictsVisibleTrue());
    }
  }

  return (
    <Fragment>
      {showLoader &&
          <div className="loading__img">
            <img src={logo} alt="loading"/>
          </div>
      }
      <Container>
        <button
            ref={sidebarButton}
            className="activeSidebar"
            onClick={toggleSidebar}
        />
        <div ref={sidebar} className="sidebar">
          <div className="logo">
            <img src={logo} alt='Image'/>
          </div>
          <div className="content-buttons">
            <div className="mainToggleButtons">
              <div ref={geocoderContainer}></div>
              <MapStyle map={map} />
              <button
                  onClick={() => dispatch(openBrusselsChanging())}
                  className={`BrusselsButton BrusselsButton_bg ${
                      openBrussels ? "BrusselsButton_open" : ""
                  }`}
              >
                Brussels
              </button>
              {openBrussels && (
                  <div className="toggleContainer">
                    <ToggleMenu
                        toggleButton={toggleButton}
                        map={map}
                        selectedDistricts={selectedDistricts}
                        centralisedDistrictsButtonHandler={
                          centralisedDistrictsButtonHandler
                        }
                        decentralisedDistrictsButtonHandler={
                          decentralisedDistrictsButtonHandler
                        }
                    />
                    <AllDistrictsButton
                        allDistrictsButtonHandler={allDistrictsButtonHandler}
                    >
                      All Districts
                    </AllDistrictsButton>
                  </div>
              )}
              <OpenTranportButton map={map}/>
              <OpenCadastreButton
                  showCadastre={showCadastre}
                  setShowCadastre={setShowCadastre}
                  map={map}
              />
              <ToolsButton drawMode={drawMode} colorPicker={colorPicker} changeColor={changeColor}/>
            </div>
            <div className="down-sidebar__buttons">
              <ResetMap
                  setSelectedFeatures={setSelectedFeatures}
                  mapStyleSetter={mapStyleSetter}
                  setSqml={setSqml}
                  draw={draw}
                  map={map}
                  setShowCadastre={setShowCadastre}
                  removeCustomMarker={removeCustomMarker}
                  setSelectedDistricts={setSelectedDistricts}
              />
              <PrintScreen />
            </div>
          </div>
        </div>

        <div
            id="map"
            style={{
              flex: 1,
              position: "relative",
            }}
        />

        <div id="distance-marker" className="distance-marker">
          <div id="distance-value"></div>
          <div className="distance-close" id="distance-close">
            ×
          </div>
        </div>

        <div className="calculation-box">
          <div id="calculated-area">{Sqm}.SQM</div>
        </div>
      </Container>
    </Fragment>
  );
}

export default App;
