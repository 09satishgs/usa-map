// OpenLayers.js
import React, { useEffect, useRef, useState } from 'react';
import { Map, View, } from 'ol';
import ol from 'ol';
import OSM from 'ol/source/OSM';
import GeoJSON from 'ol/format/GeoJSON';
import 'ol/ol.css';
import VectorSource from 'ol/source/Vector';
import Stroke from 'ol/style/Stroke';
import Fill from 'ol/style/Fill';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import Style from 'ol/style/Style';
import { usaStatesData } from './files/us-states';


const OpenLayers = ({reset}) => {
  const defaultCenter = [
    -10839037.385053677,
    4772642.164568035
  ];

  const [zoom, setZoom] = useState(5);
  const [center, setCenter] = useState(defaultCenter);
  const [lastChange, setLastChange] = useState(0);
  const [dynamicList, setDynamicList] = useState(usaStatesData);
  const mapRef = useRef(null);
  useEffect(() => {
    const vectorSource = new VectorSource({
      features: new GeoJSON().readFeatures(dynamicList, {
        featureProjection: 'EPSG:3857'
      })
    })
    const osmLayers = [new TileLayer({
      // source: new OSM()
    }),
    new VectorLayer({
      source: vectorSource,
      style: new Style({
        stroke: new Stroke({
          color: '#000',
          width: 2
        }),
        fill: new Fill({
          color: 'rgb(122, 0, 0,0.1)'
        })
      })
    })]

    const map = new Map({
      target: mapRef.current,
      layers: [...osmLayers],
    });
    let view = new View({});
    view.setZoom(zoom)
    view.setCenter(center)
    map.setView(view)
    map.on('click', (event) => {
      setCenter(event.coordinate);
      setZoom(6)
      map.forEachFeatureAtPixel(event.pixel, (feature) => {
        const stateName = feature.get('name');
        setDynamicList(list => {
          let features = list.features;
          let newFeatures = features?.find(a => a?.properties?.name === stateName);
          return { type: "FeatureCollection", features: [newFeatures] }
        })
      });
    });
    return () => map.setTarget(null)
  }, [zoom, center, dynamicList, lastChange]);
  return (
    [<div style={{ height: 'calc(100vh - 20px - 150px)', width: 'calc(100vw - 150px)', padding: 50 }} ref={mapRef} className="map-container" />
      , <button onClick={() => { setZoom(z => z + 1) }}>+</button>, <button onClick={() => { setZoom(z => z - 1) }}>-</button>, <button onClick={() => {
        setDynamicList(usaStatesData);
        setZoom(5);
        setCenter(defaultCenter);
        setLastChange(Date.now());
      }}>reset</button>, <button onClick={() => { reset() }}>Change map</button>,]
  );
}

export default OpenLayers;