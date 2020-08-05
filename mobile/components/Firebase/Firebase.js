import app from "firebase/app";
import "firebase/auth";
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
    if (!app.apps.length) {
      app.initializeApp(config);
    }
    this.auth = app.auth();
    this.database = app.database();
  }

  //Database
  refDoctors = () => this.database.ref("/users");
  refDocs = () => this.database.ref("/documents");
  refUserToDocs = (uid) => this.database.ref("/user_document").child(uid);

  doUpdateReply = async (uid, docId, reply, isReplied, counter) => {
    const updateObject = {
      [`user_document/${uid}/${docId}`]: {
        reply: reply,
        isReplied: true,
        timestamp: Date.now(),
      },
      [`document_user/${docId}/${uid}`]: {
        reply: reply,
        isReplied: true,
        timestamp: Date.now(),
      },
    };

    if (!isReplied) {
      updateObject[`users/${uid}/counter`] = counter + 1;
    }

    await this.database.ref().update(updateObject);
  };

  //Storage
  getDocsUrl = (filename) => this.storage.ref("file").child(filename);

  //Auth
  doSignInWithEmailAndPassword = (email, password) =>
    this.auth.signInWithEmailAndPassword(email, password);

  doCreateUserWithEmailAndPassword = (email, password) =>
    this.auth.createUserWithEmailAndPassword(email, password);

  doSignOut = () => this.auth.signOut();
}

export default Firebase;
