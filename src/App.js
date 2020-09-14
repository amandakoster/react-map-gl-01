import React from "react";
import "./App.css";
import ReactMapGL, { Marker } from "react-map-gl";
const token = process.env.REACT_APP_TOKEN;

class App extends React.Component {
  state = {
    viewport: {
      width: "100vw",
      height: "100vh",
      longitude: -74.1,
      latitude: 40.7,
      zoom: 11,
    },
    wifiHotSpots: [],
    userLocation: {},
  };

  onViewportChange = (viewport) => {
    if (viewport.longitude > 0) {
      viewport.longitude = 0;
    }
    this.setState({ viewport });
  };

  componentDidMount() {
    this.fetchAPI();
  }

  filterFreeWifi = (hotspots) => {
    return hotspots.filter((spot) => {
      return spot.type === "Free";
    });
  };

  fetchAPI = () => {
    fetch("https://data.cityofnewyork.us/resource/yjub-udmw.json")
      .then((res) => res.json())
      .then((hotspots) => {
        let freeWifi = this.filterFreeWifi(hotspots);
        this.setState({ wifiHotSpots: freeWifi });
      });
  };

  loadWifiMarkers = () => {
    return this.state.wifiHotSpots.map((spot) => {
      return (
        <Marker
          key={spot.objectid}
          latitude={parseFloat(spot.latitude)}
          longitude={parseFloat(spot.longitude)}
        >
          <img src="wifi-icon.svg" alt="wifi icon location" />
        </Marker>
      );
    });
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
        <button onClick={this.setUserLocation}>Go to your location</button>
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
          {this.loadWifiMarkers()}
        </ReactMapGL>
      </div>
    );
  }
}

export default App;
