import React, { useEffect, useState } from "react";
import firebase from "firebase";
import { firebaseConfig } from "../firebaseConfig";
import MyDropzone from "../components/MyDropzone";
import { timeConverter } from "../lib/timeConverter";

let storage;

function Home() {
  const [pdfFile, setPdfFile] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [messages, setMessages] = useState({});
  useEffect(() => {
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }
    storage = firebase.storage();
    fetchDoctors();
  }, []);

  const fetchDoctors = () => {
    const ref = firebase.database().ref("/users");
    ref.on("value", (snapshot) => {
      const _doctors = snapshot.val();
      let _newDoctors = [];
      let _newMessages = {};
      Object.keys(_doctors).map((key) => {
        _newDoctors.push({
          uid: key,
          email: _doctors[key].email,
          name: _doctors[key].name,
          phone: _doctors[key].phone,
        });
        if (_doctors[key].messages) {
          let messages = [];
          Object.keys(_doctors[key].messages).map((messageKey) => {
            messages.push({
              mid: messageKey,
              ..._doctors[key].messages[messageKey],
            });
          });
          _newMessages[key] = messages;
        } else {
          _newMessages[key] = [];
        }
      });
      setMessages(_newMessages);
      setDoctors(_newDoctors);
    });
  };

  const sendFile = (e) => {
    e.preventDefault();
    if (!pdfFile) {
      console.error("No file was uploaded");
    } else {
      const uploadTask = storage.ref(`/file/${pdfFile.name}`).put(pdfFile);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          console.log(snapshot);
        },
        (err) => {
          console.error(err);
        },
        () => {
          storage
            .ref("file")
            .child(pdfFile.name)
            .getDownloadURL()
            .then((firebaseUrl) => {
              console.log(`Link Download ${firebaseUrl}`);
            });
        }
      );
    }
  };

  const writeUserData = () => {
    return firebase
      .database()
      .ref("/users/zraBDAlN3TYEGDmRqw2Hm3oRI0Q2/messages")
      .once("value")
      .then((snapshot) => {
        const val = snapshot.val();
        const keys = Object.keys(val);
        keys.forEach((key) => {
          // console.log(val[key].timestamp);
          const snapTimestamp = val[key].timestamp;
          console.log(timeConverter(snapTimestamp));
        });
      });
  };

  return (
    <div>
      <div className="mt-5">
        <form onSubmit={sendFile}>
          <div className="row container">
            <div className="col-4">
              <MyDropzone uploadedFile={pdfFile} setUploadedFile={setPdfFile} />
            </div>
            <div className="col">
              <p>ini nanti dropdownnya</p>
              <button type="submit" className="btn btn-primary text-white">
                <span className="mr-2">Kirim</span>
                <svg
                  width="1.2em"
                  height="1.2em"
                  viewBox="0 0 16 16"
                  className="bi bi-arrow-up-right-circle"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"
                  />
                  <path
                    fillRule="evenodd"
                    d="M10.5 5h-4a.5.5 0 0 0 0 1h2.793l-4.147 4.146a.5.5 0 0 0 .708.708L10 6.707V9.5a.5.5 0 0 0 1 0v-4a.5.5 0 0 0-.5-.5z"
                  />
                </svg>
              </button>
            </div>
          </div>
        </form>
        <button onClick={writeUserData}>WriteData</button>
      </div>
    </div>
  );
}

export default Home;
