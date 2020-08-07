import app from "firebase/app";
import "firebase/auth";
import "firebase/storage";
import "firebase/database";

import axios from "axios";
import { url } from "../../config/api";

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
    app.initializeApp(config);
    this.auth = app.auth();
    this.storage = app.storage();
    this.database = app.database();
  }

  //Database
  refDoctors = () => this.database.ref("/users");
  refDocs = () => this.database.ref("/documents");
  refDocToUsers = (docid) => this.database.ref("/document_user").child(docid);
  refUserToDocs = (uid) => this.database.ref("/user_document").child(uid);

  doCreateUserDoc = async (user, doc, reply) => {
    await this.database.ref().update({
      [`user_document/${user}/${doc}`]: {
        reply,
        isReplied: false,
        timestamp: Date.now(),
      },
      [`document_user/${doc}/${user}`]: {
        reply,
        isReplied: false,
        timestamp: Date.now(),
      },
    });
  };

  doDeleteDoctor = async (users) => {
    console.log(users);
    users.forEach(async (user) => {
      const userNull = {
        [`users/${user}`]: null,
        [`user_document/${user}`]: null,
      };
      const docIds = (await this.refUserToDocs(user).once("value")).val();
      let opts = null;
      if (docIds) {
        let docs = Object.keys(docIds);
        opts = docs.reduce((prev, curr) => {
          prev[`document_user/${curr}/${user}`] = null;
          return prev;
        }, {});
      }
      await this.database.ref().update({
        ...userNull,
        ...opts,
      });
    });
    await axios.post(`${url}/deleteUser`, users);
  };

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
