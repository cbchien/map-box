import React from "react";
import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax

import featureCollection from "./features/featureCollection";

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_GL_ACCESS_TOKEN;

export default class App extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      lng: -94.67774,
      lat: 39.28138,
      zoom: 18,
    };
    this.mapContainer = React.createRef();
  }
  componentDidMount() {
    const { lng, lat, zoom } = this.state;
    const map = new mapboxgl.Map({
      container: this.mapContainer.current,
      style: "mapbox://styles/mapbox/satellite-v9",
      center: [lng, lat],
      zoom: zoom,
    });

    map.on("load", () => {
      map.addSource("places", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: featureCollection,
        },
      });

      map.addLayer({
        id: "places",
        type: "symbol",
        source: "places",
        layout: {
          "icon-image": "{icon}",
          "icon-allow-overlap": true,
        },
      });
    });

    map.on("click", "places", (event) => {
      var coordinates = event.features[0].geometry.coordinates.slice();
      var description = event.features[0].properties.description;

      while (Math.abs(event.lngLat.lng - coordinates[0]) > 180) {
        coordinates[0] += event.lngLat.lng > coordinates[0] ? 360 : -360;
      }

      new mapboxgl.Popup()
        .setLngLat(coordinates)
        .setHTML(description)
        .addTo(map);
    });

    map.on("mouseenter", "places", () => {
      map.getCanvas().style.cursor = "pointer";
    });

    map.on("mouseleave", "places", () => {
      map.getCanvas().style.cursor = "";
    });

    map.on("move", () => {
      this.setState({
        lng: map.getCenter().lng.toFixed(4),
        lat: map.getCenter().lat.toFixed(4),
        zoom: map.getZoom().toFixed(2),
      });
    });
  }
  render() {
    const { lng, lat, zoom } = this.state;
    return (
      <section className="container">
        <h1>Map Title</h1>
        <div className="map-display-window">
          <div className="sidebar">
            Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
          </div>
          <div ref={this.mapContainer} className="map-container" />
        </div>
      </section>
    );
  }
}
