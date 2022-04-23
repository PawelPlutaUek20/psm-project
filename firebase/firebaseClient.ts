import firebase from "firebase/app";
import "firebase/auth";
import clientCredentials from "./firebaseConfig";

if (!firebase.apps.length) {
  firebase.initializeApp(clientCredentials);
}

export default firebase;
