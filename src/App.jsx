import { useEffect, useState } from "react";
import "./App.css";
import "react-responsive-modal/styles.css";
import "leaflet/dist/leaflet.css";
import { MapContainer, GeoJSON, useMap } from "react-leaflet";
import { usaStatesData } from "./files/us-states";
import { renderToStaticMarkup } from "react-dom/server";

function App() {
  const [states, setStates] = useState([]);
  const [zoom, setZoom] = useState(3);
  const [mapCenter, setMapCenter] = useState([50, -120]);
  const [color, setColor] = useState("rgb(0 120 255)");
  const onReset = () => {
    setStates(usaStatesData.features);
    setZoom(3.5);
    setMapCenter([50, -120]);
  };
  useEffect(() => {
    setStates(usaStatesData.features);
  }, []);
  const FlyMapTo = () => {
    const map = useMap();

    useEffect(() => {
      map.setView(mapCenter, zoom);
    }, [mapCenter, zoom]);

    return null;
  };
  const getStateWeight = (str) => {
    const alphabet = "HIMJKLCSTDEFXYZGPNOABQRUVW";

    const firstLetterValue = alphabet.indexOf(str[0]);
    const secondLetterValue = alphabet.indexOf(str[1]);
    const uniqueNumber = `${firstLetterValue}` + `${secondLetterValue}`;

    return Number(uniqueNumber) / 2525;
  };
  return (
    <>
      <h2
        style={{
          position: "absolute",
          top: "50px",
          right: "50px",
          color: "black",
          backgroundColor: "#d8dde6",
          borderRadius: "30px",
          padding: "8px 16px",
          cursor: "pointer",
        }}
        onClick={onReset}
      >
        Reset
      </h2>
      <label
        style={{
          position: "absolute",
          top: "150px",
          right: "50px",
          color: "black",
          backgroundColor: color,
          padding: "16px",
          fontSize: "24px",
          borderRadius: "16px",
          cursor: "pointer",
        }}
        htmlFor="checkbox-color"
      >
        <div
          style={{ color: "white", cursor: "pointer" }}
          htmlFor="checkbox-color"
        >
          {color === "rgb(0 120 255)" ? "All Maintenance" : "Fallouts Only"}
        </div>
        <input
          id="checkbox-color"
          style={{ display: "none" }}
          onChange={(e) => {
            setColor(e.target.checked ? "rgb(255 120 0)" : "rgb(0 120 255)");
          }}
          type="checkbox"
        ></input>
      </label>
      <MapContainer zoom={zoom} center={mapCenter} doubleClickZoom={false}>
        <GeoJSON
          style={(state) => {
            console.log(state);
            return {
              fillColor: color,
              fillOpacity: getStateWeight(state.id) * 4 || 0,
            };
          }}
          key={states?.length}
          data={states}
          onEachFeature={(feature, layer) => {
            let x = renderToStaticMarkup(
              <div style={{ width: 250, height: 80, fontSize: "24px" }}>
                <div>
                  <b>State:</b>
                  {feature?.properties?.name}
                </div>
                <div>
                  <b>No of fallouts:</b>
                  {Math.ceil(25 * getStateWeight(feature.id))}
                </div>
              </div>
            );
            layer.bindTooltip(x);

            layer.on({
              click: (event) => {
                console.log("f:", feature, "e:", event);
                setZoom(5);
                setMapCenter(Object.values(event.latlng));
                setStates([feature]);
              },
            });
          }}
        />
        <FlyMapTo />
      </MapContainer>
    </>
  );
  // }
}

export default App;
