import { Map as MapTypes } from 'mapbox-gl';
import {useState} from 'react';
import html2canvas from "html2canvas";
import {Switch} from "@/components/ui/switch.tsx";
import {clsx} from "clsx";
import {CadastreButton} from "@/components/cadastre-button/CadastreButton.tsx";

const MAP_STYLE_MODES = {
  DEFAULT: 'default',
  DARK: 'dark',
  MONOCHROME: 'monochrome',
  SATELLITE: 'satellite',
}
const MAP_STYLES = {
  [MAP_STYLE_MODES.DEFAULT]: 'mapbox://styles/neon-factory/clle3pwwc010r01pm1k5f605b',
  [MAP_STYLE_MODES.DARK]: 'mapbox://styles/neon-factory/cllwooepi00i101pjf7im44oy',
  [MAP_STYLE_MODES.MONOCHROME]: 'mapbox://styles/neon-factory/cllwomphb00i401qyfp8m9u97',
  [MAP_STYLE_MODES.SATELLITE]: 'mapbox://styles/neon-factory/cllwohnul00im01pfe5adhc90',
}

const TRANSPORT_LAYOUTS: {[value: string]: string} = {
  TRANSIT_LABEL: 'transit-label',
  STIB_2023: 'stib-2023',
  PARKINGS: 'parkings',
  GARES_BRUXELLES: 'gares-bruxelles',
}

const BRUSSELS_BUTTONS = [
  {
    data: "CD",
    id: "CBDButton",
    name: "Centre",
    center: [4.351356, 50.845288],
    zoom: 13,
  },
  {
    data: "EU",
    id: "EUButton",
    name: "European",
    center: [4.385024, 50.844421],
    zoom: 13,
  },
  {
    data: "Louise",
    id: "LouiseButton",
    name: "Louise",
    center: [4.371282, 50.831629],
    zoom: 13,
  },
  {
    data: "North",
    id: "NorthButton",
    name: "North",
    center: [4.348951, 50.86046],
    zoom: 13,
  },
  {
    data: "South",
    id: "South",
    name: "Midi",
    center: [4.331086, 50.839218],
    zoom: 13,
  },
  {
    data: "NE",
    id: "NEButton",
    name: "North-East",
    center: [4.404263, 50.865011],
    zoom: 12,
  },
  {
    data: "NW",
    id: "NWButton",
    name: "North-West",
    center: [4.317688, 50.870644],
    zoom: 12,
  },
  {
    data: "SE",
    id: "SEButton",
    name: "South-East",
    center: [4.416287, 50.81435],
    zoom: 12,
  },
  {
    data: "SW",
    id: "SWButton",
    name: "South-West",
    center: [4.319291, 50.803937],
    zoom: 12,
  },
  {
    data: "Airport",
    id: "Airport",
    name: "Airport",
    center: [4.480888, 50.899911],
    zoom: 11.5,
  },
];

type SidebarProps = {
  map: MapTypes | undefined
}

const button = 'text-left cursor-pointer font-semibold text-white uppercase hover:text-[#4CC0AD] transition-all';

export const Sidebar = ({map}: SidebarProps) => {
  const [selectedDistricts, setSelectedDistricts] = useState<string[]>([]);
  const [currentStyle, setCurrentStyle] = useState(MAP_STYLES[MAP_STYLE_MODES.DEFAULT]);
  const [sidebarVisibleStatus, setSidebarVisibleStatus] = useState('Close');
  const [isTransportActive, setIsTransportActive] = useState(true);
  const [isRestaurantsActive, setIsRestaurantsActive] = useState(false);

  const [isControlsMenuVisible, setIsControlsMenuVisible] = useState(false);
  const [isMapStylesMenuVisible, setIsMapStylesMenuVisible] = useState(false);
  const [isBrusselsMenuVisible, setIsBrusselsMenuVisible] = useState(false);
  const [isTransportAndShopsMenuVisible, setIsTransportAndShopsMenuVisible] = useState(false);

  function increasePitchHandler() {
    const currentPitch = map?.getPitch();
    map?.setPitch(currentPitch as number + 5);
  }

  function decreasePitchHandler() {
    const currentPitch = map?.getPitch();
    map?.setPitch(currentPitch as number - 5);
  }

  function rotateLeftHandler() {
    const currentRotation = map?.getBearing();
    map?.setBearing(currentRotation as number - 5);
  }

  function rotateRightHandler() {
    const currentRotation = map?.getBearing();
    map?.setBearing(currentRotation as number + 5);
  }

  function zoomInHandler() {
    map?.zoomIn();
  }

  function zoomOutHandler() {
    map?.zoomOut();
  }

  function setStyleHandler(modeStyle: string) {
    setCurrentStyle(MAP_STYLES[modeStyle]);

    map?.setStyle(MAP_STYLES[modeStyle]);
  }

  function setActiveDistrictsHandler(district: string, centerCoordinates: number[]) {
    const districtIndex = selectedDistricts.indexOf(district);

    if (districtIndex !== -1) {
      selectedDistricts.splice(districtIndex, 1);
    } else {
      selectedDistricts.push(district);
    }

    const newFilter = ["any", ...selectedDistricts.map(d => ["==", ["get", "sidebar_label"], d])];

    map?.setFilter("districts-brussels-0-2", newFilter);
    map?.triggerRepaint();

    map?.flyTo({
      center: centerCoordinates as [number, number],
      duration: 800,
      zoom: 12,
      essential: true
    });
  }

  function resetMapHandler() {
    map?.setStyle(currentStyle);

    map?.flyTo({
      zoom: 12,
      pitch: 0,
      bearing: 0,
      center: [4.3517, 50.8503],
      duration: 800,
      essential: true
    });

    setSelectedDistricts([]);
  }

  function sidebarVisibleHandler() {
    if(sidebarVisibleStatus === 'Open') {
      setSidebarVisibleStatus('Close');
    } else {
      setSidebarVisibleStatus('Open');
    }
  }

  function setTransportIconsHandler() {
    setIsTransportActive(!isTransportActive);

    if(isTransportActive) {
      Object.keys(TRANSPORT_LAYOUTS).forEach((key) => {
        map?.setLayoutProperty(TRANSPORT_LAYOUTS[key], 'visibility', 'none');
      });
    } else {
      Object.keys(TRANSPORT_LAYOUTS).forEach((key) => {
        map?.setLayoutProperty(TRANSPORT_LAYOUTS[key], 'visibility', 'visible');
      });
    }
  }

  function setRestaurantsIconsHandler() {
    setIsRestaurantsActive(!isRestaurantsActive);

    if(!isRestaurantsActive) {
      map?.setLayoutProperty("poi-label", "visibility", "visible");
    } else {
      map?.setLayoutProperty("poi-label", "visibility", "none");
    }
  }

  function downloadMapHandler() {
    const mapElement = document.getElementById('map');

    if (mapElement) {
      html2canvas(mapElement, {
        useCORS: true,
        allowTaint: true
      }).then(canvas => {
        const a = document.createElement("a");
        document.body.appendChild(a);
        a.download = "image.png";
        a.href = canvas.toDataURL();
        a.click();
      });
    } else {
      console.error('Map element not found.');
    }
  }

  return (
    <div className='absolute h-[100%] z-10 w-[480px] pb-[100px] p-[60px]'>
        {sidebarVisibleStatus === 'Close' &&
            <div className='overflow-y-scroll max-w-[490px] flex flex-col gap-[10px] pr-[15px] h-[100%]'>
                <div className='flex flex-col flex-auto gap-[10px]'>
                  {/* MAP CONTROLS */}
                    <button onClick={() => setIsControlsMenuVisible(prev => !prev)} className='bg-gradient-to-b from-[#ffffff0a] to-[#ffffff36] py-[17px] rounded-[8px] text-white font-semibold hover:text-[#4CC0AD] transition-all uppercase'>
                      {isControlsMenuVisible ? 'Close Controls' : 'Open Controls'}
                    </button>
                  {isControlsMenuVisible && <div className='flex flex-col gap-[15px] p-[20px] border rounded-[8px]'>
                      <button className={clsx(button)} onClick={zoomInHandler}>Zoom In</button>
                      <button className={clsx(button)} onClick={zoomOutHandler}>Zoom Out</button>
                      <button className={clsx(button)} onClick={rotateLeftHandler}>Rotate Left</button>
                      <button className={clsx(button)} onClick={rotateRightHandler}>Rotate Right</button>
                      <button className={clsx(button)} onClick={increasePitchHandler}>Increase Pitch</button>
                      <button className={clsx(button)} onClick={decreasePitchHandler}>Decrease Pitch</button>
                  </div>}
                  {/* MAP STYLES MENU */}
                    <button onClick={() => setIsMapStylesMenuVisible(prev => !prev)} className='bg-gradient-to-b from-[#ffffff0a] to-[#ffffff36] py-[17px] rounded-[8px] text-white font-semibold hover:text-[#4CC0AD] transition-all uppercase'>Map Style</button>
                  {isMapStylesMenuVisible && <div className='flex flex-col gap-[15px] p-[20px] border rounded-[8px]'>
                    {Object.keys(MAP_STYLES).map((key) => {
                      return (
                        <div className={`flex gap-[10px] items-center`}
                             onClick={() => setStyleHandler(key)}>
                          <Switch checked={currentStyle === MAP_STYLES[key]}/>
                          <button className={`${clsx(button)}`}>{key.toUpperCase()}</button>
                        </div>
                      );
                    })}
                  </div>}
                  {/* MAP BRUSSELS MENU */}
                    <button onClick={() => setIsBrusselsMenuVisible(prev => !prev)} className='bg-gradient-to-b bg-[#4CC0AD99] py-[17px] rounded-[8px] text-white font-semibold transition-all uppercase'>Brussels</button>
                  {isBrusselsMenuVisible && <div className='rounded-[8px] w-full border'>
                      <div className='flex flex-col gap-[15px] p-[20px] max-w-[96%] max-h-[200px] overflow-auto'>
                        {BRUSSELS_BUTTONS.map((button) => {
                          return (
                            <div onClick={() => setActiveDistrictsHandler(button.data, button.center)}
                                 className='flex gap-[10px] items-center'>
                              <Switch/>
                              <button key={button.id}
                                      className='text-white font-semibold uppercase cursor-pointer hover:text-[#4CC0AD] transition-all '>
                                {button.name}
                              </button>
                            </div>

                          );
                        })}
                          <div className='flex items-center gap-[10px]'>
                              <Switch/>
                              <button className={clsx(button)}>CBD</button>
                          </div>
                          <div className='flex items-center gap-[10px]'>
                              <Switch/>
                              <button className={clsx(button)}>DECENTRALISED</button>
                          </div>
                          <div className='flex items-center gap-[10px]'>
                              <Switch/>
                              <button className={clsx(button)}>ALL DISTRICTS</button>
                          </div>
                      </div>
                  </div>}
                  {/* MAP TRANSPORT AND SHOPS MENU */}
                    <button onClick={() => setIsTransportAndShopsMenuVisible(prev => !prev)} className='bg-gradient-to-b bg-[#4CC0AD99] py-[17px] rounded-[8px] text-white font-semibold transition-all uppercase'>transport & amenieties</button>
                  {isTransportAndShopsMenuVisible && <div className='flex flex-col gap-[15px] p-[20px] border rounded-[8px]'>
                      <div className='flex items-center gap-[10px]' onClick={() => setTransportIconsHandler()}>
                          <Switch/>
                          <button className={clsx(button)}>Transport</button>
                      </div>
                      <div className='flex items-center gap-[10px]' onClick={() => setRestaurantsIconsHandler()}>
                          <Switch/>
                          <button className={clsx(button)}>Shops, Restaurants & Services</button>
                      </div>
                  </div>}
                  {/* MAP CADASTRE AND SHOPS MENU */}
                    <CadastreButton map={map}/>
                </div>
                <button
                    className='bg-gradient-to-b from-[#ffffff0a] to-[#ffffff36] py-[17px] rounded-[8px] text-white font-semibold hover:text-[#4CC0AD] transition-all uppercase'
                    onClick={downloadMapHandler}>Download Map
                </button>
                <button
                    className='bg-gradient-to-b from-[#ffffff0a] to-[#ffffff36] py-[17px] rounded-[8px] text-white font-semibold hover:text-[#4CC0AD] transition-all uppercase'
                    onClick={resetMapHandler}>Reset Map
                </button>
            </div>
        }
      <button className='sidebar-close' onClick={sidebarVisibleHandler}>{sidebarVisibleStatus}</button>
    </div>
  )
}