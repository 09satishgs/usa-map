// OpenLayers.js
import React, { useEffect, useRef, useState } from "react";
import { Feature, Map, Overlay, View } from "ol";
import OSM from "ol/source/OSM";
import GeoJSON from "ol/format/GeoJSON";
import "ol/ol.css";
import VectorSource from "ol/source/Vector";
import Stroke from "ol/style/Stroke";
import Fill from "ol/style/Fill";
import Text from "ol/style/Text";
import TileLayer from "ol/layer/Tile";
import VectorLayer from "ol/layer/Vector";
import Style from "ol/style/Style";
import { usaStatesData } from "./files/us-cities";
import { renderToStaticMarkup } from "react-dom/server";
import {  Point } from "ol/geom";
import { fromLonLat, toLonLat } from "ol/proj";
import Icon from "ol/style/Icon";
import blueIcon from "./files/blue-marker.svg";
import redIcon from "./files/red-marker.svg";
import greenIcon from "./files/green-marker.svg";

let icons = [
  blueIcon,
  redIcon,
  greenIcon,
  "https://openlayers.org/en/latest/examples/data/icon.png",
];
const MOCK_DATA = {
  AL: 0.324,
  AZ: 0.472,
  AR: 0.763,
  CA: 0.137,
  CO: 0.619,
  CT: 0.258,
  DE: 0.445,
  FL: 0.312,
  GA: 0.927,
  HI: 0.509,
  ID: 0.836,
  IL: 0.774,
  IN: 0.587,
  IA: 0.143,
  KS: 0.724,
  KY: 0.928,
  LA: 0.235,
  ME: 0.657,
  MD: 0.312,
  MA: 0.926,
  MI: 0.689,
  MN: 0.538,
  MS: 0.811,
  MO: 0.482,
  MT: 0.295,
  NE: 0.651,
  NV: 0.738,
  NH: 0.223,
  NJ: 0.908,
  NM: 0.416,
  NY: 0.732,
  NC: 0.137,
  ND: 0.821,
  OH: 0.249,
  OK: 0.975,
  OR: 0.534,
  PA: 0.396,
  RI: 0.617,
  SC: 0.849,
  SD: 0.296,
  TN: 0.745,
  TX: 1.235,
  UT: 0.137,
  VT: 0.598,
  VA: 0.427,
  WA: 0.947,
  WV: 0.581,
  WI: 0.183,
  WY: 0.935,
};
const MOCK_DATA_2 = {
  AL: [
    [-86.7911, 32.8067],
    [-87.6164, 33.2094],
    [-85.3905, 31.4671],
    [-86.9023, 34.7304],
    [-86.3898, 32.3792],
  ],
  AZ: [
    [-111.0937, 34.0489],
    [-112.074, 33.4484],
    [-113.5697, 32.2003],
    [-110.9467, 31.9686],
    [-111.65, 35.1983],
    [-112.1251, 36.0544],
  ],
  AR: [
    [-92.3731, 34.7465],
    [-93.1338, 35.201],
    [-91.8318, 36.2012],
    [-92.4459, 35.394],
    [-93.6615, 33.6675],
  ],
  CA: [
    [-119.4179, 36.7783],
    [-118.2437, 34.0522],
    [-122.4194, 37.7749],
    [-121.8947, 36.6002],
    [-123.262, 39.1502],
    [-116.5453, 33.8303],
    [-121.4944, 38.5816],
    [-120.7401, 35.2828],
  ],
  CO: [
    [-104.9903, 39.7392],
    [-105.7821, 38.8339],
    [-102.08, 40.1672],
    [-105.9378, 39.1911],
    [-107.88, 37.9348],
    [-103.5918, 39.0733],
  ],
  CT: [
    [-72.6851, 41.6032],
    [-73.0877, 41.3083],
    [-72.9279, 41.7661],
    [-72.6507, 41.5243],
  ],
  DE: [
    [-75.5277, 38.9108],
    [-75.5398, 39.7391],
    [-75.4592, 39.1573],
    [-75.347, 38.6893],
  ],
  FL: [
    [-81.5158, 27.9944],
    [-82.4572, 27.9506],
    [-80.1918, 25.7617],
    [-81.3789, 28.5383],
    [-82.4467, 29.6516],
    [-84.2807, 30.4383],
  ],
  GA: [
    [-82.9001, 32.1656],
    [-84.388, 33.749],
    [-83.3576, 34.0395],
    [-84.5434, 31.5785],
    [-83.1137, 32.0809],
    [-81.2519, 32.0835],
    [-83.6502, 34.2541],
  ],
  HI: [
    [-155.5828, 19.8968],
    [-157.8583, 21.3069],
    [-156.3319, 20.7984],
    [-155.0895, 19.7297],
    [-157.9221, 21.3993],
  ],
  ID: [
    [-114.742, 44.0682],
    [-116.2023, 43.615],
    [-111.8766, 42.94],
    [-113.9825, 45.0059],
    [-112.5663, 43.4112],
    [-115.9621, 47.0103],
  ],
  IL: [
    [-89.3985, 40.6331],
    [-87.6298, 41.8781],
    [-89.0994, 42.2711],
    [-88.2434, 40.7959],
    [-89.487, 39.7817],
    [-88.9937, 41.7085],
  ],
  IN: [
    [-86.1349, 40.2672],
    [-86.1581, 39.7684],
    [-87.3174, 41.5977],
    [-85.9964, 40.1934],
    [-85.1397, 41.2619],
    [-86.251, 38.2133],
  ],
  IA: [
    [-93.0977, 42.0115],
    [-93.6091, 41.5868],
    [-92.6636, 41.0061],
    [-91.5302, 41.6611],
    [-95.8545, 42.4928],
    [-93.8977, 43.2241],
  ],
  KS: [
    [-98.4842, 38.5],
    [-97.3301, 37.6872],
    [-96.7265, 39.0558],
    [-95.677, 39.1914],
    [-100.673, 38.8938],
    [-98.1947, 37.7995],
  ],
  KY: [
    [-84.27, 37.8393],
    [-85.7585, 38.2527],
    [-87.464, 37.7749],
    [-82.9284, 38.2056],
    [-83.5564, 37.9884],
    [-84.53, 36.9685],
  ],
  LA: [
    [-91.9623, 30.9843],
    [-90.0715, 29.9511],
    [-93.7502, 32.5093],
    [-91.1435, 30.4483],
  ],
  ME: [
    [-69.4455, 45.2538],
    [-70.254, 43.6615],
    [-68.9863, 44.8012],
    [-69.7773, 44.3126],
    [-68.7032, 45.5118],
  ],
  MD: [
    [-76.6413, 39.0458],
    [-76.6122, 39.2904],
    [-77.0369, 39.0119],
    [-76.512, 38.9784],
    [-75.8334, 38.9687],
    [-76.9372, 39.4951],
  ],
  MA: [
    [-71.3824, 42.4072],
    [-71.0589, 42.3601],
    [-70.6588, 41.6362],
    [-72.5258, 42.1056],
    [-71.2456, 42.5454],
    [-70.812, 42.2081],
    [-71.7997, 42.5779],
  ],
  MI: [
    [-85.6024, 44.3148],
    [-83.0458, 42.3314],
    [-85.5795, 42.2921],
    [-84.3971, 43.2151],
    [-84.765, 42.3315],
  ],
  MN: [
    [-94.6859, 46.7296],
    [-93.265, 44.9778],
    [-95.7129, 46.7512],
    [-94.2246, 45.5846],
    [-92.437, 46.5605],
    [-95.2127, 44.5434],
  ],
  MS: [
    [-89.3985, 32.3547],
    [-90.1848, 32.2988],
    [-88.9951, 34.2576],
    [-89.4531, 30.3256],
    [-90.248, 33.4971],
    [-89.5181, 31.3357],
    [-88.7304, 32.4135],
  ],
  MO: [
    [-92.2896, 37.9643],
    [-90.1994, 38.627],
    [-94.5786, 39.0997],
    [-91.2858, 38.3686],
    [-93.2092, 36.5482],
    [-92.7027, 39.7622],
    [-94.3964, 37.7358],
  ],
  MT: [
    [-110.3626, 46.8797],
    [-111.0429, 45.7833],
    [-113.0427, 48.394],
    [-109.8334, 47.8716],
    [-106.8678, 46.408],
    [-108.2789, 45.6766],
    [-109.2428, 48.2931],
  ],
  NE: [
    [-99.9018, 41.4925],
    [-96.7089, 40.8136],
    [-98.045, 42.0381],
    [-97.9606, 41.2534],
    [-99.174, 40.8],
    [-102.0396, 41.4927],
    [-98.7244, 41.1135],
  ],
  NV: [
    [-116.4194, 38.8026],
    [-115.1398, 36.1699],
    [-119.6464, 39.5296],
    [-115.7688, 40.973],
    [-118.7484, 41.516],
  ],
  NH: [
    [-71.5724, 43.1939],
    [-71.5491, 42.9956],
    [-70.9495, 43.1336],
    [-72.0324, 43.7276],
    [-71.6019, 42.9106],
  ],
  NJ: [
    [-74.4057, 40.0583],
    [-74.1724, 40.7357],
    [-75.0565, 39.7172],
    [-74.8255, 39.873],
    [-74.1551, 40.6782],
    [-74.5506, 39.3576],
  ],
  NM: [
    [-106.2485, 34.5199],
    [-106.6504, 35.0844],
    [-107.0542, 35.4248],
    [-105.8701, 32.3199],
    [-103.6501, 34.9008],
    [-104.9497, 36.7316],
    [-107.8781, 36.1447],
  ],
  NY: [
    [-75.4999, 43.2994],
    [-74.006, 40.7128],
    [-73.9654, 40.7829],
    [-77.6101, 43.1566],
    [-78.8784, 42.8864],
    [-73.7562, 42.6526],
    [-75.162, 42.0987],
    [-74.006, 40.7306],
  ],
  NC: [
    [-79.0193, 35.7596],
    [-78.6382, 35.7796],
    [-80.8431, 35.2271],
    [-78.6384, 35.7815],
    [-82.5515, 35.5951],
    [-77.9447, 34.2257],
    [-79.791, 36.0726],
  ],
  ND: [
    [-101.002, 47.5515],
    [-100.7837, 46.8083],
    [-103.7968, 47.9338],
    [-98.7022, 46.8772],
    [-100.2625, 48.1656],
    [-100.8969, 46.2682],
  ],
  OH: [
    [-82.9071, 40.4173],
    [-81.6944, 41.4993],
    [-83.0007, 40.3666],
  ],
  OK: [
    [-97.5164, 35.0078],
    [-97.5164, 35.4676],
    [-95.9928, 36.1539],
    [-97.0649, 36.8059],
    [-98.379, 34.6059],
    [-99.9018, 36.1654],
    [-95.369, 34.6195],
  ],
  OR: [
    [-120.5542, 43.8041],
    [-122.6765, 45.5231],
    [-123.0868, 44.5646],
    [-123.262, 44.0521],
    [-123.2091, 42.3265],
    [-121.7893, 45.6],
  ],
  PA: [
    [-77.1945, 41.2033],
    [-75.1652, 39.9526],
    [-79.9959, 40.4406],
    [-76.3055, 40.0379],
    [-76.6122, 39.9526],
    [-75.5991, 40.1519],
    [-77.6128, 39.9784],
  ],
  RI: [
    [-71.4774, 41.5801],
    [-71.4128, 41.823],
  ],
  SC: [
    [-81.1637, 33.8361],
    [-81.0348, 34.0007],
    [-80.9431, 32.7765],
    [-79.7966, 33.9972],
  ],
  SD: [
    [-99.9018, 43.9695],
    [-100.2263, 44.0805],
    [-100.6231, 43.7698],
    [-101.3362, 44.0219],
    [-103.6383, 44.4875],
    [-97.0979, 44.371],
  ],
  TN: [
    [-86.5804, 35.5175],
    [-86.7816, 36.1627],
    [-83.9207, 35.9606],
    [-89.9711, 35.1495],
    [-86.7943, 36.1673],
    [-84.0818, 36.0215],
    [-85.6787, 35.0067],
  ],
  TX: [
    [-99.9018, 31.9686],
    [-95.3698, 29.7604],
    [-96.7969, 32.7767],
    [-97.7431, 30.2672],
    [-101.8552, 35.2216],
    [-98.4936, 29.4241],
    [-101.8551, 35.2072],
    [-97.3964, 33.2148],
  ],
  UT: [
    [-111.0937, 39.3209],
    [-111.891, 40.7608],
    [-112.0487, 37.2982],
    [-113.585, 37.0005],
    [-109.938, 40.4487],
    [-111.9021, 41.1544],
    [-112.1726, 38.4161],
  ],
  VT: [
    [-72.5778, 44.5588],
    [-73.2137, 44.4759],
    [-72.5965, 44.2606],
    [-72.9033, 44.4211],
    [-73.1271, 44.6079],
    [-72.5712, 44.0675],
  ],
  VA: [
    [-78.6569, 37.4316],
    [-77.436, 37.5407],
    [-77.4864, 37.7799],
    [-76.3203, 36.8945],
    [-77.2466, 38.8951],
    [-78.8689, 37.5827],
    [-78.2303, 38.0034],
  ],
  WA: [
    [-120.7401, 47.7511],
    [-122.3321, 47.6062],
    [-123.1236, 46.1749],
    [-122.1493, 47.7526],
    [-118.2828, 46.1558],
    [-117.2394, 47.6782],
  ],
  WV: [
    [-80.4549, 38.5976],
    [-81.6326, 38.4192],
    [-80.4544, 39.6333],
    [-79.9717, 39.6501],
    [-81.5422, 37.2012],
    [-79.9023, 38.3093],
  ],
  WI: [
    [-89.6165, 43.7844],
    [-87.9065, 43.0389],
    [-90.5078, 44.9444],
    [-91.2569, 44.8113],
    [-89.3967, 44.2619],
    [-88.0131, 43.7972],
    [-88.0675, 44.3076],
  ],
  WY: [
    [-107.2903, 43.075],
    [-104.8202, 41.14],
    [-109.0558, 44.5628],
    [-108.5505, 42.9957],
    [-106.2825, 44.9949],
    [-106.8013, 41.6344],
    [-107.826, 43.8824],
    [-108.6386, 44.794],
  ],
};
const getZoomAndCenter = (extent) => {
  const R = 40075016.686;
  const a = 1.256;

  const [minX, minY, maxX, maxY] = extent;

  const extentWidth = maxX - minX;
  const extentHeight = maxY - minY;

  const centerX = (minX + maxX) / 2;
  const centerY = (minY + maxY) / 2;

  const zoomWidth = a * Math.log2(R / extentWidth);
  const zoomHeight = a * Math.log2(R / extentHeight);

  const zoom = Math.min(zoomWidth, zoomHeight);

  return {
    zoom: zoom.toFixed(2),
    center: [centerX, centerY],
  };
};
const getStateExtent = (extentData) => {

  if(!extentData){
    return;
  }

  const [minX, minY, maxX, maxY] = extentData;

  let maxLength = 0;

  const extentWidth = maxX - minX;
  const extentHeight = maxY - minY;
  const centerPointX = (minX + maxX) / 2;
  const centerPointY = (minY + maxY) / 2;
  if (extentHeight * 2 > extentWidth) {
    maxLength = extentHeight;
  } else {
    maxLength = extentWidth;
  }
  maxLength = maxLength * 1.1;
  const newExtent = [
    centerPointX - maxLength * 1.1,
    centerPointY - maxLength / 2,
    centerPointX + maxLength * 1.1,
    centerPointY + maxLength / 2,
  ];
  return [newExtent, [centerPointX, centerPointY]];
};
const DEFAULT_EXTENT = [
  -14264876.2734375, 2858300.9230225036, -7054995.800835057, 6300164.811067935,
];
const DEFAULT_CENTER = [-10839037.385053677, 4772642.164568035];
const COLORS_ARRAY = [
  "#ffffff", //white
  "#e3f2fd", // Very Light Blue
  "#bbdefb", // Light Blue
  "#90caf9", // Sky Blue
  "#64b5f6", // Soft Blue
  "#42a5f5", // Moderate Blue
  "#2196f3", // Standard Blue
  "#1e88e5", // Blue
  "#1976d2", // Deep Blue
  "#1565c0", // Dark Blue
  "#0d47a1", // Very Dark Blue
];
const getColor = (value, min = 0, max = 1, colors = COLORS_ARRAY) => {
  if (isNaN(value)) {
    return "#777";
  }
  const range = max - min;
  const index = Math.min(
    Math.floor(((value - min) / range) * colors.length),
    colors.length - 1
  );
  return colors[index];
};
const getPointerLocation = ([pixelX,pixelY])=>{
    let [vertical,horizontal]=["bottom","right"];
    if(pixelX<720){
      horizontal="left"
    }
    if(pixelY<300){
      vertical="top"
    }
    return `${vertical}-${horizontal}`;
}
const OpenLayers = ({ reset }) => {
  const [selectedState, setSelectedState] = useState(null);
  const [apiResponse, setApiResponse] = useState(MOCK_DATA);
  const [zoom, setZoom] = useState(1);
  const [extent, setExtent] = useState(DEFAULT_EXTENT);
  const [center, setCenter] = useState(DEFAULT_CENTER);
  const [tileNum, setTileNum] = useState(0);
  const [dynamicList, setDynamicList] = useState(usaStatesData);
  const [stateSelected, setStateSelected] = useState(false);
  const [pointerPosition, setPointerPosition] = useState("bottom-left");
  const tooltipRef = useRef();
  const mapRef = useRef(null);
  const divRef = useRef(null);

  const handleEnterFullscreen = () => {
    if (mapRef.current) {
      if (mapRef.current.requestFullscreen) {
        mapRef.current.requestFullscreen();
      } else if (mapRef.current.mozRequestFullScreen) {
        mapRef.current.mozRequestFullScreen();
      } else if (mapRef.current.webkitRequestFullscreen) {
        mapRef.current.webkitRequestFullscreen();
      } else if (mapRef.current.msRequestFullscreen) {
        mapRef.current.msRequestFullscreen();
      }
    }
  };
  let [url, setUrl] = useState("");
  useEffect(() => {
    const jsonString = JSON.stringify(MOCK_DATA_2);
    const blob = new Blob([jsonString], { type: "application/json" });
    setUrl(URL.createObjectURL(blob));
  }, [MOCK_DATA_2]);

  const resetMap = () => {
    setDynamicList(usaStatesData);
    setZoom(1);
    setCenter(DEFAULT_CENTER);
    setTileNum(0);
    setApiResponse(MOCK_DATA);
    setSelectedState(null);
    setExtent(DEFAULT_EXTENT);
  };
  useEffect(() => {
    const vectorSource = new VectorSource({
      features: new GeoJSON().readFeatures(dynamicList, {
        featureProjection: "EPSG:3857",
      }),
    });
    let markersList = [];
    Object.entries(MOCK_DATA_2)?.map(([state, locations]) => {
      if (selectedState === state || false) {
        locations.map(([lon, lat], index) => {
          let marker = new Feature({
            geometry: new Point(fromLonLat([lon, lat])),
            name: "CID-12345-" + state + "-" + index,
            props: JSON.stringify({ [state]: index }),
            tooltip: {
              maintenanceId: state + "-" + (index % 4),
              circuitId: "CID-12345-" + state + "-" + index,
            },
          });
          let markerStyle = new Style({
            image: new Icon({
              anchor: [0.5, 1],
              src: icons[index % 4],
            }),
          });
          marker.setStyle(markerStyle);
          markersList.push(marker);
        });
      }
    });
    vectorSource.addFeatures(markersList);
    const tilesArr = [{}, { source: new OSM() }];
    const tileLayer = tilesArr?.[tileNum];
    const osmLayers = [
      new TileLayer(tileLayer),
      new VectorLayer({
        source: vectorSource,
        style: (feature) =>
          new Style({
            stroke: new Stroke({
              color: `${stateSelected ? "black" : "#d8dde6"}`,
              width: 2,
              lineCap: "round",
            }),
            fill: new Fill({
              // color: `rgb(24, 150, 152,${apiResponse?.[feature?.getId()] ?? 0})`,
              color: stateSelected
                ? "rgb(0,0,0,0)"
                : getColor(apiResponse?.[feature?.getId()?.toUpperCase()]),
            }),
            text: new Text({
              text: tileNum ? "" : feature?.getId()?.toUpperCase(),
              font: "11px Calibri,sans-serif",
              fill: new Fill({
                color: "#fff",
              }),
              stroke: new Stroke({
                color: "#000",
                width: 5,
              }),
            }),
          }),
      }),
    ];
    const map = new Map({
      target: mapRef.current,
      layers: [...osmLayers],
    });
    let view = new View({ 
      extent: extent
     });
    view.setZoom(zoom);
    view.setCenter(center);
    map.setView(view);

    const tooltip = document.createElement("div");
    tooltipRef.current = tooltip;
    const [v,h]=pointerPosition?.split("-");
    const overlay = new Overlay({
      element: tooltip,
      offset: [
        v==="bottom"?10:-10,
         h==="right"?-10:10
        ],
      positioning: pointerPosition,
    });
    map.addOverlay(overlay);

    map.on("pointermove", (evt) => {
      const featureObject = map.forEachFeatureAtPixel(
        evt.pixel,
        (feature) => feature
      );
      // setPointerPosition(getPointerLocation(evt.pixel))
      if (featureObject) {
        const tooltipContent = featureObject.get("tooltip");
        tooltip.innerHTML = renderToStaticMarkup(
          <div className="ol-tooltip">
            {featureObject?.getId() ? (
              !stateSelected && (
                <div className="container">
                  <h1>
                    {featureObject?.getId()?.toUpperCase() + ":" + featureObject?.get("name")}
                  </h1>
                  <div>
                    <b>No Of Maintenance:</b>
                    <span>{MOCK_DATA?.[featureObject?.getId()?.toUpperCase()] * 1000}</span>
                  </div>
                  <div style={{ color: "#a8dde6", textAlign: "right" }}>
                    Click to Expand state
                  </div>
                </div>
              )
            ) : (
              <div className="container">
                <h1>Maintenance ID: {tooltipContent?.maintenanceId}</h1>
                <h3 style={{ color: "gray" }}>
                  Circuit: {tooltipContent?.circuitId}
                </h3>
                <div style={{ color: "#a8dde6", textAlign: "right" }}>
                  Click to Proceed
                </div>
              </div>
            )}
          </div>
        );
        overlay.setPosition(evt.coordinate);
        tooltip.style.display = "block";
      } else {
        tooltip.style.display = "none";
      }
    });

    map.on("click", (event) => {
      let stateExtent = [0, 0, 0, 0];
      let newCenter = [0, 0];
      // let zoomAndCenter = { zoom: 5, center: [0, 0] };
      let feature = map.forEachFeatureAtPixel(event.pixel, (feat) => {
        if(feat?.getId()?.toUpperCase()==="HI"){
         return vectorSource?.getFeatureById("HI");
        }
        return feat;
      });
      if (feature?.get("props")) {
        window.open(
          `https://www.google.com/maps?q=${toLonLat(event.coordinate)[1]},${
            toLonLat(event.coordinate)[0]
          }`
        );
        return true;
      }
      // zoomAndCenter = getZoomAndCenter(feature?.getGeometry().getExtent());
      stateExtent = getStateExtent(feature?.getGeometry().getExtent())?.[0];
      [stateExtent, newCenter] = getStateExtent(
        feature?.getGeometry().getExtent()
      )||[null,null];
      const stateName = feature?.get("name");
      setSelectedState(feature?.getId());
      getStateExtent(feature?.getGeometry().getExtent());
      setApiResponse({});
      setTileNum(1);
      setDynamicList((list) => {
        let features = list?.features;
        let newFeatures = features?.find(
          (a) => a?.properties?.name === stateName
        );
        return { type: "FeatureCollection", features: [newFeatures] };
      });
      const featureClicked=!!feature;
      if (!featureClicked) {
        resetMap();
      } else if (dynamicList?.features?.length > 1) {
        // setCenter(zoomAndCenter.center);
        // setZoom(zoomAndCenter.zoom);
        setExtent(stateExtent);
        setCenter(newCenter);
        setZoom(1);
      }
    });
    return () => map.setTarget(null);
  }, [
    zoom,
    center,
    dynamicList,
    tileNum,
    apiResponse,
    selectedState,
    stateSelected,
    extent,
    pointerPosition
  ]);
  useEffect(() => {
    if (dynamicList?.features?.length > 1) {
      setStateSelected(false);
    } else {
      setStateSelected(true);
    }
  }, [dynamicList]);
  return (
    <div
      ref={divRef}
      style={{
        display: "flex",
        flexDirection: "column-reverse",
        alignItems: "center",
        gap: 1,
        height: "100vh",
      }}
    >
      <div className="">
      <div
        style={{
          height: "calc(40vw)",
          width: "calc(80vw)",
          padding: "12px",
          backgroundColor: "#fff",
        }}
        ref={mapRef}
        className="ol-map map-container"
      />
      {/* <Hawaii fill={getColor(Math.random()+0.4/1.1)} height={'70px'} width={210} style={{marginLeft:50,marginTop:-300}}/> */}
      </div>
      <div style={{display:"flex",gap:16}}>
        <button
          onClick={() => {
            setZoom((z) => z + 1);
          }}
        >
          +
        </button>
        <button
          onClick={() => {
            setZoom((z) => z - 1);
          }}
        >
          -
        </button>
        <button onClick={resetMap}>reset</button>
        <button
          onClick={() => {
            reset();
          }}
        >
          Change map
        </button>
        <button
          onClick={() => {
            setTileNum((val) => (val + 1) % 2);
          }}
        >
          Change Tiles
        </button>
        <a download={"data.json"} href={url}>
          log data
        </a>
        <>
          <span>no color</span>
          <input
            type="checkbox"
            onChange={() => {
              setApiResponse((val) => (!!val ? null : MOCK_DATA));
            }}
            value={!!apiResponse}
          />
        </>
        <button onClick={handleEnterFullscreen}>fullscreen</button>,
      </div>
    </div>
  );
};

export default OpenLayers;
