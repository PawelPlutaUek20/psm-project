import React from "react";

import { showNotification } from "@mantine/notifications";

import initMessaging from "../firebase/messaging/initMessaging";

export const withNotifications =
  <T,>(Component: React.ComponentType<T>) =>
  (props: T) => {
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
