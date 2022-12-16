import React from "react";
import {
  withGoogleMap,
  GoogleMap,
  withScriptjs,
  Marker
} from "react-google-maps";
import Autocomplete from "react-google-autocomplete";

class Map extends React.Component {
  

  render() {
    return (
      <GoogleMap
        defaultZoom={15}
        center={{
          lat: this.props.initialLocation.lat,
          lng: this.props.initialLocation.lng
        }}
        defaultOptions={{ disableDefaultUI: true }}
      >
        <Marker
          position={{
            lat: this.props.initialLocation.lat,
            lng: this.props.initialLocation.lng
          }}
          draggable={true}
          onDragEnd={evt =>
            this.props.setLocation({
              lat: evt.latLng.lat(),
              lng: evt.latLng.lng()
            })
          }
        />
        <Autocomplete
          onPlaceSelected={place => {
            console.log(place);
            if(place){
              this.props.setLocation({
                lat: place.geometry.location.lat(),
                lng: place.geometry.location.lng()
              })}
            }
          }
          types={["(regions)"]}
          placeholder="Search"
        />
      </GoogleMap>
    );
  }
}

const WrappedMap = withScriptjs(withGoogleMap(Map));

export default WrappedMap;
