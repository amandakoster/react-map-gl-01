import React, { useState } from "react";
import "./App.css";
import MapGL, { SVGOverlay } from "react-map-gl";

const token = process.env.REACT_APP_TOKEN;

function App() {
  const [viewport, setViewport] = useState({
    width: 800,
    height: 800,
    longitude: -122.4376,
    latitude: 37.7577,
    zoom: 8,
  });

  const _onViewportChangeLong = (viewport) => {
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
    return <circle cx={cx} cy={cy} r={4} fill="pink" />;
  };

  return (
    <div className="App">
      <MapGL
        {...viewport}
        onViewportChange={_onViewportChangeLong}
        mapboxApiAccessToken={token}
      >
        <SVGOverlay redraw={redraw} />
      </MapGL>
      <button onClick={_goToSF}>SF</button>
      <button onClick={_goToNYC}>NYC</button>
    </div>
  );
}

export default App;
