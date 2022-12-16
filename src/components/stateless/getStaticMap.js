import React from "react";

const getStaticMap = ({ position, pov }) => {
  let url = `https://maps.googleapis.com/maps/api/streetview?location=${position.lat},${position.lng}&size=640x640&source=outdoor&fov=75&heading=${pov.heading}&pitch=${pov.pitch}&key=AIzaSyDz-wPsGB_lG2dyNjUmHnR97jzA4QCZeF4`;
  
  return fetch(url).then(res => res.blob()).then(blob_response => URL.createObjectURL(blob_response)) 
};

export const PlaceholderMap = () => (
  <div className="placeholder">
  </div>
)


export default getStaticMap;