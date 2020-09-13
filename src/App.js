import React, { useState } from "react";
import "./App.css";
import ReactMapGL, { SVGOverlay } from "react-map-gl";
const token = process.env.REACT_APP_TOKEN;

function App() {
  const [viewport, setViewport] = useState({
    width: 500,
    height: 500,
    latitude: 47.6062,
    longitude: -122.3321,
    zoom: 8
  });

  const _onViewportChange = (viewport) => {
    if (viewport.longitude > 0) {
      viewport.longitude = 0;
    }
    setViewport(viewport);
  };

  const _goToNYC = () => {
    const newViewport = { ...viewport, longitude: -74.1, latitude: 40.7 };
    setViewport(newViewport);
  };

  const _goToSF = () => {
    const newViewport = {
      ...viewport,
      longitude: -122.4376,
      latitude: 37.7577,
    };
    setViewport(newViewport);
  };

  const redraw = ({ project }) => {
    const [cx, cy] = project([-122, 37]);
    return <circle cx={cx} cy={cy} r={4} fill="green" />;
  };

  const _setUserLocation = () => {
    navigator.geolocation.getCurrentPosition(position => {
      let newLocalViewport = {
        width: 500,
        height: 500,
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        zoom: 12
      }
      setViewport(newLocalViewport);
    })
  }

  return (
    <div className="App">
      <ReactMapGL
        {...viewport}
        mapStyle="mapbox://styles/mapbox/outdoors-v11"
        onViewportChange={_onViewportChange}
        mapboxApiAccessToken={token}
      >
        <SVGOverlay redraw={redraw} />
      </ReactMapGL>
      <button onClick={_goToSF}>SF</button>
      <button onClick={_goToNYC}>NYC</button>
      <button onClick={_setUserLocation }>You are here!</button>
    </div>
  );
}

export default App;