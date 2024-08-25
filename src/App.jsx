import { useState } from "react";
import LeafletMap from "./LeafletMap";
import GoogleMaps from "./GoogleMaps";
import OpenLayers from "./OpenLayers";

const App = () => {
  const [inputMap, setInputMap] = useState("");

  if (!inputMap) {
    return (
      <div
        style={{
          display: "flex",
          margin: 24,
          flexDirection: "column",
          gap: 12,
          width: "25vw",
        }}
      >
        <label htmlFor="select-map">Select Map</label>
        <select onChange={(e) => setInputMap(e.target.value)} id="select-map">
          <option value="">None</option>
          <option value={"lm"}>Leaflet Map</option>
          <option value={"gm"}> Google Map</option>
          <option value={"ol"}> Open Layers</option>
        </select>
      </div>
    );
  }else if (/ol/i.test(inputMap)) {
    return <OpenLayers reset={setInputMap} />;
  } else if (/lm/i.test(inputMap)) {
    return <LeafletMap reset={setInputMap} />;
  } else {
    return <GoogleMaps reset={setInputMap} />;
  }
};
export default App;
