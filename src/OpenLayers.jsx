// OpenLayers.js
import React, { useEffect, useRef, useState } from "react";
import { Map, View } from "ol";
import OSM from "ol/source/OSM";
import GeoJSON from "ol/format/GeoJSON";
import "ol/ol.css";
import VectorSource from "ol/source/Vector";
import Stroke from "ol/style/Stroke";
import Fill from "ol/style/Fill";
import Text from 'ol/style/Text';
import TileLayer from "ol/layer/Tile";
import VectorLayer from "ol/layer/Vector";
import Style from "ol/style/Style";
import { usaStatesData } from "./files/us-states";
import { XYZ } from "ol/source";

const MOCK_DATA = {
  "AL": 0.324,
  "AK": 0.091,
  "AZ": 0.472,
  "AR": 0.763,
  "CA": 0.137,
  "CO": 0.619,
  "CT": 0.258,
  "DE": 0.445,
  "FL": 0.312,
  "GA": 0.927,
  "HI": 0.509,
  "ID": 0.836,
  "IL": 0.774,
  "IN": 0.587,
  "IA": 0.143,
  "KS": 0.724,
  "KY": 0.928,
  "LA": 0.235,
  "ME": 0.657,
  "MD": 0.312,
  "MA": 0.926,
  "MI": 0.689,
  "MN": 0.538,
  "MS": 0.811,
  "MO": 0.482,
  "MT": 0.295,
  "NE": 0.651,
  "NV": 0.738,
  "NH": 0.223,
  "NJ": 0.908,
  "NM": 0.416,
  "NY": 0.732,
  "NC": 0.137,
  "ND": 0.821,
  "OH": 0.249,
  "OK": 0.975,
  "OR": 0.534,
  "PA": 0.396,
  "RI": 0.617,
  "SC": 0.849,
  "SD": 0.296,
  "TN": 0.745,
  "TX": 1.235,
  "UT": 0.137,
  "VT": 0.598,
  "VA": 0.427,
  "WA": 0.947,
  "WV": 0.581,
  "WI": 0.183,
  "WY": 0.935
}


const OpenLayers = ({ reset }) => {
  const defaultCenter = [-10839037.385053677, 4772642.164568035];

  const [apiResponse,setApiResponse]=useState(MOCK_DATA)
  const [zoom, setZoom] = useState(5);
  const [center, setCenter] = useState(defaultCenter);
  const [lastChange, setLastChange] = useState(0);
  const [tileNum, setTileNum] = useState(0);
  const [dynamicList, setDynamicList] = useState(usaStatesData);
  const mapRef = useRef(null);
  useEffect(() => {
    const vectorSource = new VectorSource({
      features: new GeoJSON().readFeatures(dynamicList, {
        featureProjection: "EPSG:3857",
      }),
    });
    const tilesArr = [{},{ source: new OSM()},{source:new XYZ({
      url: 'https://mt{0-3}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
      attributions: '© Google Maps',
      crossOrigin: 'anonymous',
      maxZoom: 19,
    })}]
    const tileLayer = tilesArr?.[tileNum]
    const osmLayers = [
      new TileLayer(tileLayer),
      new VectorLayer({
        source: vectorSource,
        style: (feature)=>new Style({
          stroke: new Stroke({
            color: "black",
            width: 2,
          }),
          fill: new Fill({
            color: `rgb(24, 50, 202,${apiResponse?.[feature?.getId()]??0})`,
          }),
          text:  new Text({
            text: tileNum?"":feature?.get('name')
          }) 
        }),
      }),
    ];

    const map = new Map({
      target: mapRef.current,
      layers: [...osmLayers],
    });
    let view = new View({});
    view.setZoom(zoom);
    view.setCenter(center);
    map.setView(view);
    map.on("click", (event) => {
      setCenter(event.coordinate);
      setZoom(6);
      map.forEachFeatureAtPixel(event.pixel, (feature) => {
        const stateName = feature.get("name");
        setDynamicList((list) => {
          let features = list.features;
          let newFeatures = features?.find(
            (a) => a?.properties?.name === stateName
          );
          return { type: "FeatureCollection", features: [newFeatures] };
        });
      });
    });
    return () => map.setTarget(null);
  }, [zoom, center, dynamicList,tileNum,apiResponse, lastChange]);
  return [
    <div
      style={{
        height: "calc(100vh - 20px - 150px)",
        width: "calc(100vw - 150px)",
        padding: 50,
      }}
      ref={mapRef}
      className="map-container"
    />,
    <button
      onClick={() => {
        setZoom((z) => z + 1);
      }}
    >
      +
    </button>,
    <button
      onClick={() => {
        setZoom((z) => z - 1);
      }}
    >
      -
    </button>,
    <button
      onClick={() => {
        setDynamicList(usaStatesData);
        setZoom(5);
        setCenter(defaultCenter);
        setLastChange(Date.now());
      }}
    >
      reset
    </button>,
    <button
      onClick={() => {
        reset();
      }}
    >
      Change map
    </button>,
    <button
      onClick={() => {
        setTileNum(val=>((val+1)%3))
      }}
    >
      Change Tiles
    </button>,
        <button
        onClick={() => {
          setApiResponse((val)=>!!val?null:MOCK_DATA)
        }}
      >
       Show Intensity
      </button>,
  ];
};

export default OpenLayers;
