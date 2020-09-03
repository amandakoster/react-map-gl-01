import React, { useState } from "react";
import "./App.css";
import ReactMapGL, { SVGOverlay, Marker } from "react-map-gl";
const token = process.env.REACT_APP_TOKEN;

function App() {
  const [viewport, setViewport] = useState({
    width: 500,
    height: 500,
    latitude: 42.430472,
    longitude: -123.334102,
    zoom: 8,
  });
  const [userLocation, setUserLocation] = useState(() => () => console.log("default ooops"));

  // const _onViewportChange = (viewport) => {
  //   if (viewport.longitude > 0) {
  //     viewport.longitude = 0;
  //   }
  //   setViewport(viewport);
  // };

  const _goToNYC = () => {
    const nycViewport = { ...viewport, longitude: -74.1, latitude: 40.7 };
    setViewport(nycViewport);
  };

  const _goToSF = () => {
    const sfViewport = {
      ...viewport,
      longitude: -122.4376,
      latitude: 37.7577,
    };
    setViewport(sfViewport);
  };

  const redraw = ({ project }) => {
    const [cx, cy] = project([-122, 37]);
    return <circle cx={cx} cy={cy} r={4} fill="green" />;
  };

  const getUserLocation = () => {
    navigator.geolocation.getCurrentPosition((position) => {
      let newLocation = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      };
      let newViewport = {
        height: 500,
        width: 500,
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        zoom: 10,
      };
      setUserLocation(newLocation);
      setViewport(newViewport);
    });
  };

  // console.log("userLocation.lat", userLocation.latitude);
  // console.log("viewport", viewport);
  // console.log(Object.keys(userLocation).length);
  return (
    <div className="App">
      <ReactMapGL
        {...viewport}
        mapStyle="mapbox://styles/mapbox/outdoors-v11"
        onViewportChange={(viewport) => setViewport(viewport)}
        mapboxApiAccessToken={token}
      >
        <SVGOverlay redraw={redraw} />
        {Object.keys(userLocation).length !== 0 ? (
          <Marker latitude={userLocation.lat} longitude={userLocation.long}>
            <div style={{ color: "red" }}>I'm Here!!!</div>
          </Marker>
        ) : (
          <div style={{ color: "red" }}>Empty</div>
        )}
      </ReactMapGL>
      <button onClick={_goToSF}>SF</button>
      <button onClick={_goToNYC}>NYC</button>
      <button onClick={getUserLocation}>You are here!</button>
    </div>
  );
}

export default App;
