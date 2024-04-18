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
import RightTopMenuText from "./components/RightTopMenuText.jsx";
// import MyModal from "./components/MyModal/MyModal";
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
import CircleMenu from "./components/CircleMenu";
import OpenTranportButton from "./components/ToggleMenu/OpenTranportButton.jsx";
import OpenCadastreButton from "./components/ToggleMenu/OpenCadastreButton.jsx";
import OpenMapStyleButton from "./components/ToggleMenu/OpenMapStyleButton.jsx";

function App() {
  const dispatch = useDispatch();

  const [map, setMap] = useState(null);
  const [draw, setDraw] = useState(null);

  const openBrussels = useSelector((state) => state.openBrussels.value);
  const activeSidebar = useSelector((state) => state.activeSidebar.value);
  const [showCadastre, setShowCadastre] = useState(false);
  const [showLoader, setShowLoader] = useState(true);
  const [showTool, setShowTool] = useState(true);
  const [showCircleMenu, setShowCircleMenu] = useState(true);

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
  const circleMenu = useRef();
  const mapTag = useRef();
  const colorPicker = useRef();
  const geocoderContainer = useRef();
  const newDrawFeature = useRef(false);
  const sidebarButton = useRef();
  const palette = document.querySelector(".palette");
  const circleMenuTool = document.querySelector(".circleMenuTool");
  const sidebar = useRef();
  const toolbarButton = useRef();
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
      // Сбросьте стиль дома
      map.setPaintProperty(
        "custom-tileset-layer",
        "fill-color",
        "rgba(255,255,255,0)"
      );

      // Установите состояние фичи в неактивное
      map.setFeatureState(
        {
          source: "custom-tileset-layer",
          sourceLayer: "Bruxelles_Cadastre_complet-7xijuk",
          id: hoveredFeatureId,
        },
        { hover: false }
      );

      // Обнулите hoveredFeatureId
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
              // Удаляем выбранный полигон из массива и восстанавливаем его стиль
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

    var draw = new MapboxDraw({
      // this is used to allow for custom properties for styling
      // it appends the word "user_" to the property
      userProperties: true,
      controls: {
        combine_features: false,
        uncombine_features: false,
      },
      marker: false,
      styles: defaultDrawStyles,
    });

    function addLayerIfAbsent(map, layer) {
      if (!map.getLayer(layer.id)) {
        map.addLayer(layer);
      }
    }
    map.on("move", function () {
      addLayerIfAbsent(map, customTilesetLayer);
      addLayerIfAbsent(map, customTilesetLineLayer);
    });

    map.on("style.load", function () {
      addLayerIfAbsent(map, customTilesetLayer);
      addLayerIfAbsent(map, customTilesetLineLayer);
    });

    const marker = document.getElementById("distance-marker");
    map.on("draw.delete", function () {
      // Скрываем маркер при удалении линии
      document.getElementById("distance-marker").style.display = "none";
    });

    setDraw(draw);

    map.addControl(new mapboxgl.NavigationControl());

    map.on("load", function () {
      addLayerIfAbsent(map, customTilesetLayer);
      addLayerIfAbsent(map, customTilesetLineLayer);
      map.addControl(draw);
      map.setLayoutProperty("poi-label", "visibility", "none");
    });

    map.on("click", function (e) {
      if (!newDrawFeature.current) {
        var drawFeatureAtPoint = draw.getFeatureIdsAt(e.point);

        //if another drawFeature is not found - reset drawFeatureID
        MAPBOX_ACCESS_TOKEN.current = drawFeatureAtPoint.length
          ? drawFeatureAtPoint[0]
          : "";
        if (drawFeatureAtPoint.length) {
          var clickedFeature = draw.get(drawFeatureAtPoint[0]);
          showPolygonArea(clickedFeature);
        } else {
          // Если фигура не была найдена, сбросьте отображение размера
          setSqml(0);
        }
      }

      newDrawFeature.current = false;
    });

    map.on("click", "0", function (e) {
      const clickedPolygon = e.features[0]; // Получаем информацию о кликнутом полигоне
      // Вызываем функцию для отображения метров полигона
      showPolygonArea(clickedPolygon);
    });

    function showPolygonArea(polygonFeature) {
      // eslint-disable-next-line no-undef
      const area = turf.area(polygonFeature.geometry);
      const sqm = Math.round(area * 100) / 100;

      // Выводим метры полигона в какой-либо элемент (например, модальное окно)
      setSqml(sqm);
    }

    let drawingCompleted = false;
    map.on("draw.create", function (e) {
      const feature = e.features[0];

      if (feature.geometry.type === "LineString") {
        // Если рисуется линия
        // eslint-disable-next-line no-undef
        const distance = turf.length(feature);

        let displayedDistance; // Исходное значение для отображения

        if (distance < 1000) {
          // Если расстояние меньше 1000 метров, умножаем его на 1000 и отображаем как целое число
          displayedDistance = Math.round(distance * 1000).toString();
        } else {
          // Иначе отображаем значение в метрах с двумя знаками после запятой
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
        // Если рисуется полигон, устанавливаем флаг drawingCompleted в false
        drawingCompleted = false;
      }

      newDrawFeature.current = true;
      updateArea(e);

      // Закрываем полигон при двойном клике
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
        // Если рисование полигона завершено, устанавливаем флаг drawingCompleted в true
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
      setSqml(0); // Сбрасываем размер при удалении фигуры
    });

    map.on("draw.update", function (e) {
      const updatedFeature = e.features[0];

      if (updatedFeature.geometry.type === "LineString") {
        // eslint-disable-next-line no-undef
        const distance = turf
          .length(updatedFeature)
          .toFixed(3)
          .toLocaleString(undefined, { minimumFractionDigits: 2 });

        // Получаем координаты второй точки линии
        const secondPointCoord = updatedFeature.geometry.coordinates[1];

        // Определяем позицию меню
        const menuPosition = new mapboxgl.LngLat(
          secondPointCoord[0],
          secondPointCoord[1]
        );

        // Обновляем текст в меню и позиционируем его
        if (distance < 1000) {
          // Если расстояние меньше 1000 метров, умножаем его на 1000 и отображаем как целое число
          document.getElementById("distance-value").textContent = `${(
            distance * 1000
          ).toFixed(0)} m`;
        } else {
          // Иначе отображаем значение в метрах с двумя знаками после запятой
          document.getElementById(
            "distance-value"
          ).textContent = `${distance} m`;
        }

        marker.style.left = `${map.project(menuPosition).x}px`;
        marker.style.top = `${map.project(menuPosition).y}px`;
      } else if (updatedFeature.geometry.type === "Polygon") {
        // Calculate the area of the updated polygon
        // eslint-disable-next-line no-undef
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
        // eslint-disable-next-line no-undef
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
      // Установите выбранный цвет для выбранной фигуры
      draw.setFeatureProperty(
        MAPBOX_ACCESS_TOKEN.current,
        "portColor",
        selectedColor
      );

      // Обновите фигуру на карте
      let feat = draw.get(MAPBOX_ACCESS_TOKEN.current);
      draw.add(feat);
    }
  }

  useEffect(() => {
    if (map) {
      const customMarker = document.createElement('div');
      customMarker.className = 'custom-marker';
      customMarker.style.backgroundImage = `url(${pin})`;
      customMarker.style.backgroundPosition = 'center';

      map.loadImage(
          pin,
          (error, image) => {
            if (error) throw error;
            if (!image) return; // handle undefined case
            map.addImage('custom-marker', image);
            // map.addLayer({
            //   id: 'point',
            //   source: 'single-point',
            //   type: 'symbol',
            // });
          }
    );
    }
  }, [map]);

  function allDistrictsButtonHandler() {
    if (isAllDistrictsVisible) {
      dispatch(decentralisedToggleTrue());
      dispatch(centralisedToggleTrue());
      dispatch(decentralisedDistrictsVisibleFalse());
      dispatch(centralisedDistrictsVisibleFalse());

      setSelectedDistricts(allDistricts);
      toggleDistrictsVisibility(selectedDistricts, map);

      if (mapStyleSetter == 1) {
        map.setStyle("mapbox://styles/neon-factory/clle3pwwc010r01pm1k5f605b");
        setShowCadastre(false);
      } else if (mapStyleSetter == 2) {
        map.setStyle("mapbox://styles/neon-factory/cllwohnul00im01pfe5adhc90");
        setShowCadastre(false);
      } else if (mapStyleSetter == 3) {
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

  function toggleToolbar() {
    const elements = document.querySelectorAll(".mapboxgl-ctrl-group");
    const lastElement = elements[elements.length - 1];
    setShowTool(!showTool);

    if (showTool) {
      lastElement.style.display = "flex";
      palette.style.display = "block";
      circleMenu.current.style.display = "block";
    } else {
      lastElement.style.display = "none";
      palette.style.display = "none";
      circleMenu.current.style.display = "none";
      circleMenuTool.style.display = "none";
      setShowCircleMenu(true);
    }
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

  function circleToggleMenu() {
    setShowCircleMenu(!showCircleMenu);
    if (showCircleMenu) {
      circleMenuTool.style.display = "flex";
    } else {
      circleMenuTool.style.display = "none";
    }
  }

  useEffect(() => {
    if (map) {
      map.resize(); // Обновите размеры карты
    }
  }, [activeSidebar, map]);

  useEffect(() => {
    if (map) {
      map.on("load", () => {
        document
          .querySelector(".mapboxgl-ctrl-group")
          .addEventListener("mouseover", function () {
            document.querySelector(".rightTopMenu-button-north").style.display =
              "unset";
          });
        document
          .querySelector(".mapboxgl-ctrl-group")
          .addEventListener("mouseout", function () {
            document.querySelector(".rightTopMenu-button-north").style.display =
              "none";
          });
        document
          .querySelector(".circleMenu")
          .addEventListener("mouseover", function () {
            document.querySelector(
              ".rightTopMenu-button-circleMenu"
            ).style.display = "unset";
          });
        document
          .querySelector(".circleMenu")
          .addEventListener("mouseout", function () {
            document.querySelector(
              ".rightTopMenu-button-circleMenu"
            ).style.display = "none";
          });
        document
          .querySelector(".mapbox-gl-draw_line")
          .addEventListener("mouseover", function () {
            document.querySelector(".rightTopMenu-button-line").style.display =
              "unset";
          });
        document
          .querySelector(".mapbox-gl-draw_line")
          .addEventListener("mouseout", function () {
            document.querySelector(".rightTopMenu-button-line").style.display =
              "none";
          });

        document
          .querySelector(".mapbox-gl-draw_polygon")
          .addEventListener("mouseover", function () {
            document.querySelector(".rightTopMenu-button-shape").style.display =
              "unset";
          });

        document
          .querySelector(".mapbox-gl-draw_polygon")
          .addEventListener("mouseout", function () {
            document.querySelector(".rightTopMenu-button-shape").style.display =
              "none";
          });

        document
          .querySelector(".mapbox-gl-draw_point")
          .addEventListener("mouseover", function () {
            document.querySelector(
              ".rightTopMenu-button-location"
            ).style.display = "unset";
          });
        document
          .querySelector(".mapbox-gl-draw_point")
          .addEventListener("mouseout", function () {
            document.querySelector(
              ".rightTopMenu-button-location"
            ).style.display = "none";
          });

        document
          .querySelector(".mapbox-gl-draw_trash")
          .addEventListener("mouseover", function () {
            document.querySelector(".rightTopMenu-button-erase").style.display =
              "unset";
          });
        document
          .querySelector(".mapbox-gl-draw_trash")
          .addEventListener("mouseout", function () {
            document.querySelector(".rightTopMenu-button-erase").style.display =
              "none";
          });

        document
          .querySelector(".palette")
          .addEventListener("mouseover", function () {
            document.querySelector(".rightTopMenu-button-color").style.display =
              "unset";
          });
        document
          .querySelector(".palette")
          .addEventListener("mouseout", function () {
            document.querySelector(".rightTopMenu-button-color").style.display =
              "none";
          });
      });
    }
  }, [draw, map]);

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
        <button
          ref={toolbarButton}
          className="activeToolbar"
          onClick={toggleToolbar}
        >
          Tools
        </button>

        <div ref={sidebar} className="sidebar">
          <img className="logo" src={logo} alt='Image' />
          <div className="content-buttons">
            <div className="mainToggleButtons">
              <div ref={geocoderContainer}></div>
              <OpenMapStyleButton
                setShowCadastre={setShowCadastre}
                setSelectedDistricts={setSelectedDistricts}
                map={map}
                mapStyleSetter={mapStyleSetter}
                setMapStyleSetter={setMapStyleSetter}
              />
              <button
                onClick={() => dispatch(openBrusselsChanging())}
                className={`BrusselsButton BrusselsButton_bg ${
                  openBrussels ? "BrusselsButton_open" : ""
                }`}
              >
                Brussels
              </button>
              {openBrussels ? (
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
              ) : null}
              <OpenTranportButton map={map} />
              <OpenCadastreButton
                showCadastre={showCadastre}
                setShowCadastre={setShowCadastre}
                map={map}
              />
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
              ></ResetMap>

              <PrintScreen showTool={showTool} toggleToolbar={toggleToolbar} />
            </div>
          </div>
        </div>

        <div
          id="map"
          ref={mapTag}
          style={{
            flex: 1,
            position: "relative",
          }}
        >
          <CircleMenu map={map} />
          <div id="distance-marker" className="distance-marker">
            <div id="distance-value"></div>
            <div className="distance-close" id="distance-close">
              ×
            </div>
          </div>
          <RightTopMenuText />
          <div className="calculation-box">
            <div id="calculated-area">{Sqm}.SQM</div>
          </div>
          <input
            type="color"
            ref={colorPicker}
            id="colorPicker"
            className="palette"
            onChange={changeColor}
          />
          <div
            ref={circleMenu}
            onClick={circleToggleMenu}
            className="circleMenu"
            alt="logo"
          />
          <img alt="Logo" className="logo-map" src={logo} />
        </div>
      </Container>
    </Fragment>
  );
}

export default App;
