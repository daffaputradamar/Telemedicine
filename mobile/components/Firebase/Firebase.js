import app from "firebase/app";
import "firebase/auth";
import "firebase/database";

const config = {
  apiKey: "AIzaSyABQJ7ZSNKqYZs2cE3ZZNq8TOZ4_dixtbo",
  authDomain: "ecg-telemedicine.firebaseapp.com",
  databaseURL: "https://ecg-telemedicine.firebaseio.com",
  projectId: "ecg-telemedicine",
  storageBucket: "ecg-telemedicine.appspot.com",
  messagingSenderId: "17663991798",
  appId: "1:17663991798:web:a1a79a79370177c28131d7",
  measurementId: "G-91S1YM65ZJ",
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

  doSignOut = (uid) => {
    this.database
      .ref()
      .update({
        [`users/${uid}/push_token`]: null,
      })
      .then((_) => {
        this.auth.signOut();
      });
  };
}

export default Firebase;
