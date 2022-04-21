import React from "react";

import localforage from "localforage";
import compose from "lodash/fp/compose";
import { AuthAction, useAuthUser, withAuthUser } from "next-firebase-auth";

import { withNotifications } from "../components/withNotifications";

// const sendNotification = (fcm_token: string | null) =>
//   sleep(5000).then(() =>
//     fetch("https://fcm.googleapis.com/fcm/send", {
//       method: "POST",
//       headers: {
//         Authorization: `key=${process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_KEY}`,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         notification: {
//           title: "Fireabse",
//           body: "Firebase is awesome",
//         },
//         to: fcm_token,
//       }),
//     })
//   );

const withinRadius = (
  point: { latitude: number; longitude: number },
  interest: { latitude: number; longitude: number },
  kms: number
) => {
  let R = 6371;
  let deg2rad = (degrees: number) => {
    return degrees * (Math.PI / 180);
  };

  let dLat = deg2rad(interest.latitude - point.latitude);
  let dLon = deg2rad(interest.longitude - point.longitude);

  let a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(point.latitude)) *
      Math.cos(deg2rad(interest.latitude)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  let c = 2 * Math.asin(Math.sqrt(a));
  let d = R * c;

  return d <= kms;
};

const sleep = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const Home = React.memo(() => {
  const user = useAuthUser();

  const [currentPosition, setCurrentPosition] = React.useState<{
    latitude: number;
    longitude: number;
  }>();

  const [notified, setNotified] = React.useState<boolean>(false);

  React.useEffect(() => {
    const interval = setInterval(
      () =>
        navigator.geolocation.getCurrentPosition((position) => {
          const { latitude, longitude } = position.coords;
          setCurrentPosition({ latitude, longitude });
        }),
      5000
    );
    return () => {
      clearInterval(interval);
    };
  }, []);

  React.useEffect(() => {
    if (
      currentPosition &&
      !notified &&
      withinRadius(
        currentPosition,
        { latitude: 50.0671743, longitude: 20.0263019 },
        1
      )
    ) {
      setNotified(true);
      localforage
        .getItem<string>("fcm_token")
        .then((fcm_token) => alert(fcm_token));
    }
  }, [currentPosition, notified]);

  return <button onClick={() => user.signOut()}>Sign out</button>;
});

Home.displayName = "Home";

export default compose(
  withAuthUser({
    whenUnauthedBeforeInit: AuthAction.RETURN_NULL,
    whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
  }),
  withNotifications
)(Home);
