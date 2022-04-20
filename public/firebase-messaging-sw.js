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
  measurementId: "G-5N0CL6L5HE",
});

const messaging = firebase.messaging();

messaging.setBackgroundMessageHandler((payload) =>
  console.log("[firebase-messaging-sw.js]", payload)
);
