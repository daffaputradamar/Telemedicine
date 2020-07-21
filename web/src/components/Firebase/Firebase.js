import app from "firebase/app";
import "firebase/auth";

const config = {
  apiKey: "AIzaSyAZTljZeyPWHyvzvPn_yHNU4a4Hkhs0V8Q",
  authDomain: "telermedicine.firebaseapp.com",
  databaseURL: "https://telermedicine.firebaseio.com",
  projectId: "telermedicine",
  storageBucket: "telermedicine.appspot.com",
  messagingSenderId: "146704387009",
  appId: "1:146704387009:web:cbe1ac324c021f52833d40",
  measurementId: "G-6SLWVZ8P47",
};

class Firebase {
  constructor() {
    app.initializeApp(config);
    this.auth = app.auth();
  }

  doSignInWithEmailAndPassword = (email, password) =>
    this.auth.signInWithEmailAndPassword(email, password);

  doSignOut = () => this.auth.signOut();
}

export default Firebase;
