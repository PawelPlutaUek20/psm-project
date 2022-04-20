import { getApp } from "firebase/app";
import { isSupported, getToken, getMessaging } from "firebase/messaging";
import localforage from "localforage";

const enableMessaging = async () => {
  if (typeof window !== "undefined") {
    if (await isSupported()) {
      try {
        if ((await localforage.getItem("fcm_token")) !== null) {
          console.log(await localforage.getItem("fcm_token"));
          return false;
        }
        await Notification.requestPermission();
        const messaging = getMessaging(getApp());
        const token = await getToken(messaging, {
          vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
        });
        localforage.setItem("fcm_token", token);
        console.log("fcm_token", token);
        return messaging
      } catch (error) {
        console.log(error);
        throw "Unknown error occurred";
      }
    } else {
      throw "Not Supported";
    }
  }
};

export default enableMessaging;
