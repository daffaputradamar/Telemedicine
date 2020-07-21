import React, { useEffect, useState, useContext } from "react";
import MyDropzone from "../../components/MyDropzone";
import { FirebaseContext } from "../../components/Firebase";
import { timeConverter } from "../../lib/timeConverter";
import {
  Container,
  Grid,
  Paper,
  makeStyles,
  Box,
  Button,
  Divider,
  Typography,
  CircularProgress,
} from "@material-ui/core";
import SelectDoctors from "./SelectDoctors";
import DocsList from "../../components/DocsList";

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary,
  },
}));

function Home() {
  const firebaseContext = useContext(FirebaseContext);
  const [pdfFile, setPdfFile] = useState(null);

  const [doctors, setDoctors] = useState([]);
  const [selectedDoctors, setSelectedDoctors] = useState([]);

  const [documents, setDocuments] = useState([]);
  const [loadingDocuments, setloadingDocuments] = useState(false);

  useEffect(() => {
    fetchDoctors();
    fetchDocs();
  }, []);

  const fetchDoctors = () => {
    firebaseContext.database.ref("/users").on("value", (snapshot) => {
      const val = snapshot.val();
      const doctorList = Object.keys(val).map((key) => ({
        uid: key,
        ...val[key],
      }));
      setDoctors(doctorList);
    });
  };

  const fetchDocs = () => {
    setloadingDocuments(true);
    firebaseContext.database.ref("/documents").on("value", (snapshot) => {
      const val = snapshot.val();
      let documentList = Object.keys(val).map((key) => ({
        docid: key,
        ...val[key],
      }));
      documentList.reverse();
      setDocuments(documentList);
      setloadingDocuments(false);
    });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (!pdfFile || !selectedDoctors) {
      console.error("No file was uploaded");
    } else {
      const uploadTask = firebaseContext.storage
        .ref(`/file/${pdfFile.name}`)
        .put(pdfFile);
      uploadTask.on(
        "state_changed",
        (snapshot) => {},
        (err) => {
          console.error(err);
        },
        () => {
          firebaseContext.storage
            .ref("file")
            .child(pdfFile.name)
            .getDownloadURL()
            .then((firebaseUrl) => {
              firebaseContext.database
                .ref("/documents")
                .push({
                  filename: pdfFile.name,
                  url: firebaseUrl,
                  timestamp: Date.now(),
                })
                .then((snap) => {
                  const key = snap.key;
                  selectedDoctors.forEach((doctor) => {
                    firebaseContext.database
                      .ref("/documentSent")
                      .child(`${key}_${doctor.value}`)
                      .set({
                        reply: "",
                        timestamp: Date.now(),
                      });
                  });
                  // setPdfFile(null);
                  // setSelectedDoctors([]);
                });
            });
        }
      );
    }
  };

  const classes = useStyles();

  return (
    <Container>
      <form onSubmit={onSubmit}>
        <Box my={5}>
          {/* <Box mb={2}>
            <Typography variant="h5" align="center">
              Kirim Dokumen
            </Typography>
          </Box> */}
          <Grid container spacing={5}>
            <Grid item xs={12} sm={4}>
              <MyDropzone
                uploadedFile={pdfFile}
                selectedDoctors={selectedDoctors}
                setUploadedFile={setPdfFile}
              />
            </Grid>
            <Grid item xs={12} sm={8}>
              <SelectDoctors
                doctors={doctors}
                selectedDoctors={selectedDoctors}
                setSelectedDoctors={setSelectedDoctors}
              />
              <Box mt={2}>
                <Button variant="contained" color="primary" type="submit">
                  Kirim
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </form>
      {!loadingDocuments ? (
        <DocsList documents={documents} />
      ) : (
        <Grid container direction="row" justify="center" alignItems="center">
          <CircularProgress />
        </Grid>
      )}
    </Container>
  );
}

export default Home;
