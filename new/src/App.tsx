import React, { useEffect, useState } from 'react';
import './App.css';
import { Sidebar } from './components/sidebar/Sidebar.tsx';
import { Map } from './components/Map.tsx';
import mapboxgl, { Map as MapTypes } from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css'

const MAPBOX_ACCESS_TOKEN = 'pk.eyJ1IjoibmVvbi1mYWN0b3J5IiwiYSI6ImNrcWlpZzk1MzJvNWUyb3F0Z2UzaWZ5emQifQ.T-AqPH9OSIcwSLxebbyh8A'

function App() {
  const [map, setMap] = useState<MapTypes | undefined>();

  useEffect(() => {
    mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;

    const map = new mapboxgl.Map({
      container: "map",
      style: "mapbox://styles/neon-factory/clle3pwwc010r01pm1k5f605b",
      center: [4.387564, 50.845193],
      zoom: 10.8,
      preserveDrawingBuffer: true,
    });
    const MapDrawTools = new MapboxDraw({
      displayControlsDefault: false,
      controls: {
        polygon: true,
        trash: true,
        line_string: true,
        point: true,
        combine_features: false,
        uncombine_features: false,
      },
      defaultMode: 'draw_polygon',
    });
    const MapGeocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      mapboxgl: mapboxgl
    })

    map.addControl(MapGeocoder);
    map.addControl(MapDrawTools, 'top-right');

    setMap(map);

    return () => map.remove();
  }, []);



  return (
    <React.Fragment>
      <Sidebar map={map} />
      <Map />
    </React.Fragment>
  )
}

export default App
