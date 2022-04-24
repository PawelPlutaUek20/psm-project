import localforage from "localforage";
import React from "react";

import { useInterval } from "../hooks/useInterval";
import { Geolocation } from "../types";

type Props = {
  children: React.ReactNode;
};

type GeolocationContext = {
  geolocation: Geolocation;
  setGeolocation: React.Dispatch<React.SetStateAction<Geolocation>>;
};

const DELAY = 5000; // 5 seconds
const DEFAULT_GEOLOCATION = {
  latitude: 51.505,
  longitude: -0.09,
};
const UEK_GEOLOCATION = {
  latitude: 50.0686,
  longitude: 19.9551,
};

export const GeolocationContext = React.createContext<GeolocationContext>({
  geolocation: DEFAULT_GEOLOCATION,
  setGeolocation: () => {},
});

const GeolocationProvider: React.FC<Props> = ({ children }) => {
  const [geolocation, setGeolocation] =
    React.useState<Geolocation>(DEFAULT_GEOLOCATION);

  const getGeolocation = () => {
    if (JSON.stringify(geolocation) === JSON.stringify(UEK_GEOLOCATION)) {
      sendNotification();
    }
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      setGeolocation({
        latitude: latitude,
        longitude: longitude,
      });
    });
  };

  useInterval(getGeolocation, DELAY);

  return (
    <GeolocationContext.Provider
      value={React.useMemo(
        () => ({ geolocation, setGeolocation }),
        [JSON.stringify(geolocation), setGeolocation]
      )}
    >
      {children}
    </GeolocationContext.Provider>
  );
};

export default GeolocationProvider;

const sendNotification = () =>
  localforage.getItem<string>("fcm_token").then((fcm_token) =>
    fetch("https://fcm.googleapis.com/fcm/send", {
      method: "POST",
      headers: {
        Authorization: `key=${process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        notification: {
          title: "Fireabse",
          body: "Firebase is awesome",
        },
        to: fcm_token,
      }),
    })
  );

// const withinRadius = (
//     point: { latitude: number; longitude: number },
//     interest: { latitude: number; longitude: number },
//     kms: number
//   ) => {
//     let R = 6371;
//     let deg2rad = (degrees: number) => {
//       return degrees * (Math.PI / 180);
//     };

//     let dLat = deg2rad(interest.latitude - point.latitude);
//     let dLon = deg2rad(interest.longitude - point.longitude);

//     let a =
//       Math.sin(dLat / 2) * Math.sin(dLat / 2) +
//       Math.cos(deg2rad(point.latitude)) *
//         Math.cos(deg2rad(interest.latitude)) *
//         Math.sin(dLon / 2) *
//         Math.sin(dLon / 2);
//     let c = 2 * Math.asin(Math.sqrt(a));
//     let d = R * c;

//     return d <= kms;
//   };
