importScripts("https://www.gstatic.com/firebasejs/8.3.2/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.3.2/firebase-messaging.js");

firebase.initializeApp({
  apiKey: "AIzaSyBps-9zcrd_R8LHO4w64TxY1GhlfWkuO-Q",
  authDomain: "psm-project-adfec.firebaseapp.com",
  databaseURL: "https://psm-project-adfec-default-rtdb.firebaseio.com",
  projectId: "psm-project-adfec",
  storageBucket: "psm-project-adfec.appspot.com",
  messagingSenderId: "86273382393",
  appId: "1:86273382393:web:f07c8048c8fd0d00750f28",
  measurementId: "G-5N0CL6L5HE"
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
