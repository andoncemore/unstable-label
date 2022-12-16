import React from "react";
import GoogleStreetview from "react-google-streetview";

const panoStyle = {
  background: "var(--background-light)",
  width: "100%",
  flexGrow: "1",
  height: 0
};

class NavigateMap extends React.Component {
  constructor(props) {
    super(props);

    this.streetViewOptions = {
      disableDefaultUI: true,
      position: this.props.startingLocation.position,
      pov: this.props.startingLocation.pov
    };
    this.onPositionChanged = this.onPositionChanged.bind(this);
    this.onPovChanged = this.onPovChanged.bind(this);
    this.onPanoChanged = this.onPanoChanged.bind(this);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return false;
  }

  onPositionChanged(evt) {
    this.props.changeLocation("position", { lat: evt.lat(), lng: evt.lng() });
  }

  onPovChanged(evt) {
    this.props.changeLocation("pov", {
      pitch: evt.pitch,
      heading: evt.heading
    });
  }

  onPanoChanged(evt) {
    this.props.changeLocation("id",evt)
  }

  render() {
    return (
      <div id="pano" style={panoStyle}>
        <GoogleStreetview
          apiKey="AIzaSyDz-wPsGB_lG2dyNjUmHnR97jzA4QCZeF4"
          streetViewPanoramaOptions={this.streetViewOptions}
          onPositionChanged={this.onPositionChanged}
          onPovChanged={this.onPovChanged}
          onPanoChanged={this.onPanoChanged}
        />
      </div>
    );
  }
}

export default NavigateMap;
