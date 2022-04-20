importScripts(
  "https://www.gstatic.com/firebasejs/9.2.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.2.0/firebase-messaging-compat.js"
);
firebase.initializeApp({
  messagingSenderId: "86273382393",
});

const messaging = firebase.messaging();

messaging.setBackgroundMessageHandler((payload) =>
  console.log("[firebase-messaging-sw.js]", payload)
);

messaging.onBackgroundMessage((payload) => {
  console.log("[firebase-messaging-sw.js]", payload);
});
messaging.onMessage((payload) => {
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
  };

  if (!("Notification" in window)) {
    console.log("This browser does not support system notifications.");
  } else if (Notification.permission === "granted") {
    // If it's okay let's create a notification
    var notification = new Notification(notificationTitle, notificationOptions);
    notification.onclick = (event) => {
      event.preventDefault();
      window.open(payload.notification.click_action, "_blank");
      notification.close();
    };
  }
});
