import React from "react";

import { MapContainer, TileLayer, Marker } from "react-leaflet";
import { Marker as MarkerProps } from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";

import { Geolocation } from "../types";

type Props = {
  geolocation: Geolocation;
};

const Map: React.FC<Props> = ({ geolocation }) => {
  const { latitude, longitude } = geolocation;

  return (
    <MapContainer
      center={{
        lat: latitude,
        lng: longitude,
      }}
      zoom={13}
      scrollWheelZoom={false}
      style={{ height: "400px", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <DraggableMarker geolocation={geolocation} />
    </MapContainer>
  );
};

const DraggableMarker: React.FC<Props> = ({
  geolocation: { latitude, longitude },
}) => {
  const [position, setPosition] = React.useState({
    lat: latitude,
    lng: longitude,
  });
  const markerRef = React.useRef<MarkerProps>(null);
  const eventHandlers = React.useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        if (marker != null) {
          const markerPosition = marker.getLatLng();
          alert(markerPosition);
          setPosition(markerPosition);
        }
      },
    }),
    []
  );

  return (
    <Marker
      draggable
      eventHandlers={eventHandlers}
      position={position}
      ref={markerRef}
    ></Marker>
  );
};

export default Map;
