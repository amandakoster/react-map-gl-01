import React from "react";
import "./App.css";
import ReactMapGL, { Marker } from "react-map-gl";
const token = process.env.REACT_APP_TOKEN;

class App extends React.Component {
  state = {
    viewport: {
      width: "100vw",
      height: "100vh",
      latitude: 42.430472,
      longitude: -123.334102,
      zoom: 16,
    },
    userLocation: {},
  };

  onViewportChange = (viewport) => {
    if (viewport.longitude > 0) {
      viewport.longitude = 0;
    }
    this.setState({ viewport });
  };

  goToNYC = () => {
    const newViewport = {
      ...this.state.viewport,
      longitude: -74.1,
      latitude: 40.7,
    };
    this.setState({ viewport: newViewport });
  };

  goToSF = () => {
    const newViewport = {
      ...this.state.viewport,
      longitude: -122.4376,
      latitude: 37.7577,
    };
    this.setState({ viewport: newViewport });
  };

  setUserLocation = () => {
    navigator.geolocation.getCurrentPosition((position) => {
      let setUserLocation = {
        lat: position.coords.latitude,
        long: position.coords.longitude,
      };
      let newViewport = {
        height: "100vh",
        width: "100vw",
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        zoom: 10,
      };
      this.setState({
        viewport: newViewport,
        userLocation: setUserLocation,
      });
    });
  };

  render() {
    return (
      <div className="App">
        <button onClick={this.goToSF}>SF</button>
        <button onClick={this.goToNYC}>NYC</button>
        <button onClick={this.setUserLocation}>You are here!</button>
        <ReactMapGL
          {...this.state.viewport}
          mapStyle="mapbox://styles/mapbox/outdoors-v11"
          onViewportChange={this.onViewportChange}
          mapboxApiAccessToken={token}
        >
          {Object.keys(this.state.userLocation).length !== 0 ? (
            <Marker
              latitude={this.state.userLocation.lat}
              longitude={this.state.userLocation.long}
            >
              <img src="location-pin.svg" alt="location pin icon" />
            </Marker>
          ) : (
            <div />
          )}
        </ReactMapGL>
      </div>
    );
  }
}

export default App;
