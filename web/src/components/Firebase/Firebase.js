import app from "firebase/app";
import "firebase/auth";
import "firebase/storage";
import "firebase/database";

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
    this.storage = app.storage();
    this.database = app.database();
  }

  //Database
  refDoctors = () => this.database.ref("/users");
  refDoctorById = (id) => this.database.ref("/users").child(id);
  refDocs = () => this.database.ref("/documents");
  refDocsById = (id) => this.database.ref("/documents").child(id);
  refDocsSent = () => this.database.ref("/documentSent");
  refDocsDetail = (id) => this.database.ref("/documents").child(id);
  refDoctorByDoc = (docid) =>
    this.database
      .ref("/documentSent")
      .orderByKey()
      .startAt(docid)
      .endAt(`${docid}\uf8ff`);

  //Storage
  uploadDocs = (file, filename) =>
    this.storage.ref(`/file/${filename}`).put(file);
  getDocsUrl = (filename) => this.storage.ref("file").child(filename);

  //Auth
  doSignInWithEmailAndPassword = (email, password) =>
    this.auth.signInWithEmailAndPassword(email, password);

  doSignOut = () => this.auth.signOut();
}

export default Firebase;
