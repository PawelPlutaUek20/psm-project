import React from "react";

import { MapContainer, TileLayer, Marker } from "react-leaflet";
import { Marker as MarkerRef } from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";

import { Geolocation } from "../types";


type Props = {
  geolocation: Geolocation,
  markerPosition:{
    lat: number;
    lng: number;
  };
  setMarkerPosition:React.Dispatch<
  React.SetStateAction<{
    lat: number;
    lng: number;
  }>
  >;
}

type MarkerProps = {
  geolocation: {
    get: {
      lat: number;
      lng: number;
    };
    set: React.Dispatch<
      React.SetStateAction<{
        lat: number;
        lng: number;
      }>
    >;
  };
};

const Map: React.FC<Props> = ({ geolocation, markerPosition, setMarkerPosition }) => {
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
      <DraggableMarker
        geolocation={{ get: markerPosition, set: setMarkerPosition }}
      />
    </MapContainer>
  );
};

const DraggableMarker: React.FC<MarkerProps> = ({ geolocation }) => {
  const markerRef = React.useRef<MarkerRef>(null);
  const eventHandlers = React.useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        if (marker != null) {
          const markerPosition = marker.getLatLng();
          geolocation.set(markerPosition);
        }
      },
    }),
    []
  );

  return (
    <Marker
      draggable
      eventHandlers={eventHandlers}
      position={geolocation.get}
      ref={markerRef}
    ></Marker>
  );
};

export default Map;
