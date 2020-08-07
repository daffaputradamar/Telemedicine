const express = require("express");
const cors = require("cors");
const axios = require("axios");
const firebase = require("firebase");
var admin = require("firebase-admin");

var serviceAccount = require("./telermedicine-firebase-adminsdk-ai6cs-682a538ad7.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://telermedicine.firebaseio.com",
});

const app = express();

app.use(cors());

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "halo",
  });
});

app.post("/sendNotif", async (req, res) => {
  try {
    const tokenArr = req.body;
    const chunk = 100;
    let tempArr;
    for (let i = 0, j = tokenArr.length; i < j; i += chunk) {
      tempArr = tokenArr.slice(i, i + chunk);
      await axios.post("https://exp.host/--/api/v2/push/send", tempArr);
    }
    res.json({
      success: true,
    });
  } catch (error) {
    res.json({
      success: false,
    });
  }
  return;
});

app.post("/deleteUser", async (req, res) => {
  try {
    await admin.auth().deleteUsers(req.body);
    res.json({
      success: true,
    });
  } catch (error) {
    res.json({
      success: false,
    });
  }
});

app.listen(process.env.PORT || 8080, () => console.log("Server is listening"));
