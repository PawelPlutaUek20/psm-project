import React from "react";

import { showNotification } from "@mantine/notifications";

import initMessaging from "../firebase/messaging/initMessaging";

export default function withNotifications<T>(Component: React.ComponentType<T>) {
  return function (props: T) {
    initMessaging()
      .then((payload) => {
        showNotification({
          title: "Default notification",
          message: "Hey there, your code is awesome! 🤥",
        });
      })
      .catch((err) => console.log("failed: ", err));
    return <Component {...props} />;
  };
}

