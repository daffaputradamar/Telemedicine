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
    users.forEach(async (user) => {
      const userNull = {
        [`users/${user}`]: null,
        [`user_document/${user}`]: null,
      };
      const docIds = Object.keys(
        (await this.refUserToDocs(user).once("value")).val()
      );
      const opts = docIds.reduce((prev, curr) => {
        prev[`document_user/${curr}/${user}`] = null;
        return prev;
      }, {});
      // console.log({
      //   ...userNull,
      //   ...opts,
      // });
      await this.database.ref().update({
        ...userNull,
        ...opts,
      });
    });
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
