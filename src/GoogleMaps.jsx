import {
  GoogleMap,
  useLoadScript,
  Marker,
  HeatmapLayerF,
} from "@react-google-maps/api";
import { GOOGLE_API_KEY } from "./secrets";
import { useState } from "react";
const libraries = ["places", "visualization"];
const mapContainerStyle = {
  width: "95vw",
  height: "100vh",
};
const center = {
  lat: 37.0902,
  lng: -95.7129,
};
const GoogleMaps = ({ reset = () => {} }) => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: GOOGLE_API_KEY,
    libraries,
  });
  const [hmData, setHmData] = useState([]);
  function generateHeatmapData(numPoints) {
    const data = [];

    // Approximate bounds of the contiguous United States
    const minLat = 30.396308;
    const maxLat = 49.384358;
    const minLng = -119.848974; // Adjusted to avoid western ocean
    const maxLng = -87.0; // Adjusted to avoid eastern ocean

    for (let i = 0; i < numPoints; i++) {
      const lat = Math.random() * (maxLat - minLat) + minLat;
      const lng = Math.random() * (maxLng - minLng) + minLng;
      const weight = Math.floor(Math.random() * 5 + 1) * 3000 + 1; // Random weight between 1 and 5

      data.push({
        location: new window.google.maps.LatLng(lat, lng),
        weight: weight,
      });
    }

    return data;
  }

  if (loadError) {
    return <div>Error loading maps</div>;
  }

  if (!isLoaded) {
    return <div>Loading maps</div>;
  }

  return (
    <div>
      <h2
        style={{
          position: "absolute",
          top: "450px",
          right: "10px",
          color: "black",
          backgroundColor: "#d8dde6",
          borderRadius: "30px",
          padding: "8px 16px",
          cursor: "pointer",
        }}
        onClick={(e) => {
          reset();
        }}
      >
        Map
      </h2>
      {
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          zoom={1}
          center={center}
          options={{
            disableDefaultUI: false,
            restriction: {
              latLngBounds: {
                north: 100.38,
                south: 10,
                west: -179.0,
                east: -36.95,
              },
              strictBounds: true,
            },
          }}
        >
          <HeatmapLayerF
            key={hmData}
            onLoad={(e) => {
              setHmData([
                ...generateHeatmapData(500),
                {
                  location: new window.google.maps.LatLng(61.2181, -149.9003),
                  weight: 300,
                },
                {
                  location: new window.google.maps.LatLng(61.2185, -149.9),
                  weight: 400,
                },
                {
                  location: new window.google.maps.LatLng(61.218, -149.8995),
                  weight: 500,
                },
                {
                  location: new window.google.maps.LatLng(61.2177, -149.9002),
                  weight: 200,
                },
                {
                  location: new window.google.maps.LatLng(61.2179, -149.9004),
                  weight: 700,
                },
                {
                  location: new window.google.maps.LatLng(61.2183, -149.8999),
                  weight: 800,
                },
                {
                  location: new window.google.maps.LatLng(61.2182, -149.9001),
                  weight: 900,
                },
                {
                  location: new window.google.maps.LatLng(61.2184, -149.9005),
                  weight: 1000,
                },
                {
                  location: new window.google.maps.LatLng(61.2186, -149.8998),
                  weight: 1100,
                },
                {
                  location: new window.google.maps.LatLng(61.2187, -149.9006),
                  weight: 1200,
                },
                {
                  location: new window.google.maps.LatLng(61.219, -149.9),
                  weight: 1300,
                },
                {
                  location: new window.google.maps.LatLng(61.2192, -149.9003),
                  weight: 1400,
                },
                {
                  location: new window.google.maps.LatLng(61.2193, -149.8997),
                  weight: 1500,
                },
                {
                  location: new window.google.maps.LatLng(61.2194, -149.9004),
                  weight: 1200,
                },
                {
                  location: new window.google.maps.LatLng(61.2195, -149.8999),
                  weight: 203,
                },
                {
                  location: new window.google.maps.LatLng(61.2196, -149.9001),
                  weight: 200,
                },
                {
                  location: new window.google.maps.LatLng(61.2197, -149.9002),
                  weight: 1500,
                },
                {
                  location: new window.google.maps.LatLng(61.2198, -149.9),
                  weight: 1400,
                },
                {
                  location: new window.google.maps.LatLng(61.2199, -149.9005),
                  weight: 1300,
                },
                {
                  location: new window.google.maps.LatLng(61.22, -149.9003),
                  weight: 1200,
                },
                {
                  location: new window.google.maps.LatLng(64.8378, -147.7164),
                  weight: 300,
                },
                {
                  location: new window.google.maps.LatLng(64.838, -147.716),
                  weight: 400,
                },
                {
                  location: new window.google.maps.LatLng(64.8382, -147.7156),
                  weight: 500,
                },
                {
                  location: new window.google.maps.LatLng(64.8384, -147.7152),
                  weight: 200,
                },
                {
                  location: new window.google.maps.LatLng(64.8386, -147.7148),
                  weight: 700,
                },
                {
                  location: new window.google.maps.LatLng(64.8388, -147.7144),
                  weight: 800,
                },
                {
                  location: new window.google.maps.LatLng(64.839, -147.714),
                  weight: 900,
                },
                {
                  location: new window.google.maps.LatLng(64.8392, -147.7136),
                  weight: 1000,
                },
                {
                  location: new window.google.maps.LatLng(64.8394, -147.7132),
                  weight: 1100,
                },
                {
                  location: new window.google.maps.LatLng(64.8396, -147.7128),
                  weight: 1200,
                },
                {
                  location: new window.google.maps.LatLng(64.8398, -147.7124),
                  weight: 1300,
                },
                {
                  location: new window.google.maps.LatLng(64.84, -147.712),
                  weight: 1400,
                },
                {
                  location: new window.google.maps.LatLng(64.8402, -147.7116),
                  weight: 1500,
                },
                {
                  location: new window.google.maps.LatLng(64.8404, -147.7112),
                  weight: 1200,
                },
                {
                  location: new window.google.maps.LatLng(64.8406, -147.7108),
                  weight: 203,
                },
                {
                  location: new window.google.maps.LatLng(64.8408, -147.7104),
                  weight: 200,
                },
                {
                  location: new window.google.maps.LatLng(64.841, -147.71),
                  weight: 1200,
                },
                {
                  location: new window.google.maps.LatLng(64.8412, -147.7096),
                  weight: 1500,
                },
                {
                  location: new window.google.maps.LatLng(64.8414, -147.7092),
                  weight: 1400,
                },
                {
                  location: new window.google.maps.LatLng(64.8416, -147.7088),
                  weight: 1300,
                },
                {
                  location: new window.google.maps.LatLng(58.3019, -134.4197),
                  weight: 300,
                },
                {
                  location: new window.google.maps.LatLng(58.3021, -134.4195),
                  weight: 400,
                },
                {
                  location: new window.google.maps.LatLng(58.3023, -134.4193),
                  weight: 500,
                },
                {
                  location: new window.google.maps.LatLng(58.3025, -134.4191),
                  weight: 200,
                },
                {
                  location: new window.google.maps.LatLng(58.3027, -134.4189),
                  weight: 700,
                },
                {
                  location: new window.google.maps.LatLng(58.3029, -134.4187),
                  weight: 800,
                },
                {
                  location: new window.google.maps.LatLng(58.3031, -134.4185),
                  weight: 900,
                },
                {
                  location: new window.google.maps.LatLng(58.3033, -134.4183),
                  weight: 1000,
                },
                {
                  location: new window.google.maps.LatLng(58.3035, -134.4181),
                  weight: 1100,
                },
                {
                  location: new window.google.maps.LatLng(58.3037, -134.4179),
                  weight: 1200,
                },
                {
                  location: new window.google.maps.LatLng(58.3039, -134.4177),
                  weight: 1300,
                },
                {
                  location: new window.google.maps.LatLng(58.3041, -134.4175),
                  weight: 1400,
                },
                {
                  location: new window.google.maps.LatLng(58.3043, -134.4173),
                  weight: 1500,
                },
                {
                  location: new window.google.maps.LatLng(58.3045, -134.4171),
                  weight: 1200,
                },
                {
                  location: new window.google.maps.LatLng(58.3047, -134.4169),
                  weight: 203,
                },
                {
                  location: new window.google.maps.LatLng(58.3049, -134.4167),
                  weight: 200,
                },
                {
                  location: new window.google.maps.LatLng(58.3051, -134.4165),
                  weight: 1200,
                },
                {
                  location: new window.google.maps.LatLng(58.3053, -134.4163),
                  weight: 1500,
                },
                {
                  location: new window.google.maps.LatLng(58.3055, -134.4161),
                  weight: 1400,
                },
                {
                  location: new window.google.maps.LatLng(58.3057, -134.4159),
                  weight: 1300,
                },
              ]);
            }}
            data={hmData}
          />
          <Marker position={center} />
        </GoogleMap>
      }
    </div>
  );
};
export default GoogleMaps;
