import React from "react";

import { showNotification } from "@mantine/notifications";

import { firebaseCloudMessaging } from "../firebase/messaging/initMessaging";
import firebase from "../firebase/firebaseClient";

export const withNotifications =
  <T,>(Component: React.ComponentType<T>) =>
  (props: T) => {
    React.useEffect(() => {
      setToken();
      if ("serviceWorker" in navigator) {
        navigator.serviceWorker.addEventListener("message", (event) =>
          console.log("event for the service worker", event)
        );
      }
      async function setToken() {
        try {
          const token = await firebaseCloudMessaging.init();
          if (token) {
            getMessage();
          }
        } catch (error) {
          console.log(error);
        }
      }
      return () => {};
    }, []);

    function getMessage() {
      const messaging = firebase.messaging();
      messaging.onMessage((message) => {
        navigator.vibrate(200);
        new Audio(
          "http://codeskulptor-demos.commondatastorage.googleapis.com/descent/gotitem.mp3"
        ).play();
        showNotification({
          title: "Default notification",
          message: "Hey there, your code is awesome! 🤥",
        });
      });
    }
    return <Component {...props} />;
  };
