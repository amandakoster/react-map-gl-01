import React from "react";
import "./App.css";
import ReactMapGL, { Marker, Popup } from "react-map-gl";
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
    selectedHotspot: null,
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

  setSelectedHotspot = (object) => {
    console.log(object);
    this.setState({
      selectedHotspot: object,
    });
  };

  closePopup = () => {
    this.setState({ selectedHotspot: null });
  };

  loadWifiMarkers = () => {
    return this.state.wifiHotSpots.map((spot) => {
      return (
        <Marker
          key={spot.objectid}
          latitude={parseFloat(spot.latitude)}
          longitude={parseFloat(spot.longitude)}
        >
          <img
            onClick={() => this.setSelectedHotspot(spot)}
            src="wifi-icon.svg"
            alt="wifi icon location"
          />
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

  goToNYC = () => {
    const newViewport = {
      ...this.state.viewport,
      longitude: -74.1,
      latitude: 40.7,
    };
    this.setState({ viewport: newViewport });
  };

  render() {
    return (
      <div className="App">
        <p>
          Simple react-map-gl. <br />
          This map uses Ubers react-map-gl library to: <br />
          1) go to users location by getting the
          navigator.geolocation.getCurrentPosition:{" "}
          <button onClick={this.setUserLocation}>
            Go to your location
          </button>{" "}
          <br />
          2) show the location of free hotspots in nyc:{" "}
          <button onClick={this.goToNYC}>Go to NYC</button>
        </p>

        <ReactMapGL
          {...this.state.viewport}
          r
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
          {this.state.selectedHotspot !== null ? (
            <Popup
              latitude={parseFloat(this.state.selectedHotspot.latitude)}
              longitude={parseFloat(this.state.selectedHotspot.longitude)}
              onClose={this.closePopup}
            >
              <p>
                HotSpot Information
                <br />
                <b>Location: </b>
                {this.state.selectedHotspot.location}
                {", "}
                {this.state.selectedHotspot.city}
                <br />
                <b>Boro Name: </b>
                {this.state.selectedHotspot.boroname} <br />
                <b>Type: </b>
                {this.state.selectedHotspot.location_t}
              </p>
            </Popup>
          ) : null}
        </ReactMapGL>
      </div>
    );
  }
}

export default App;
