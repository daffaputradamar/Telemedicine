import React, { useEffect, useState, useContext, Fragment } from "react";
import MyDropzone from "./MyDropzone";
import { FirebaseContext } from "../../components/Firebase";
import { fileNameDate } from "../../lib/timeConverter";
import {
  Container,
  Grid,
  Box,
  Button,
  CircularProgress,
  CssBaseline,
} from "@material-ui/core";
import SelectDoctors from "./SelectDoctors";
import DocsList from "../../components/DocsList";
import Navbar from "../../components/Navbar";

function Home() {
  const firebaseContext = useContext(FirebaseContext);
  const [pdfFile, setPdfFile] = useState(null);

  const [doctors, setDoctors] = useState([]);
  const [selectedDoctors, setSelectedDoctors] = useState([]);

  const [documents, setDocuments] = useState([]);
  const [loadingDocuments, setloadingDocuments] = useState(false);

  useEffect(() => {
    const fetchDoctors = () => {
      firebaseContext.refDoctors().on("value", (snapshot) => {
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
      firebaseContext.refDocs().on("value", (snapshot) => {
        const val = snapshot.val();
        if (val) {
          let documentList = Object.keys(val).map((key) => ({
            docid: key,
            ...val[key],
          }));
          documentList.reverse();
          setDocuments(documentList);
        }
        setloadingDocuments(false);
      });
    };

    fetchDoctors();
    fetchDocs();
  }, [firebaseContext]);

  const onSubmit = (e) => {
    e.preventDefault();
    if (!pdfFile || !selectedDoctors) {
      console.error("No file was uploaded");
    } else {
      const formattedName = `${fileNameDate()}_${pdfFile.name}`;
      const uploadTask = firebaseContext.uploadDocs(pdfFile, formattedName);
      uploadTask.on(
        "state_changed",
        (snapshot) => {},
        (err) => {
          console.error(err);
        },
        async () => {
          const firebaseUrl = await firebaseContext
            .getDocsUrl(formattedName)
            .getDownloadURL();

          const docSnapshot = await firebaseContext.refDocs().push({
            filename: formattedName,
            url: firebaseUrl,
            timestamp: Date.now(),
          });

          const key = docSnapshot.key;
          const _selectedDoctors = selectedDoctors;
          _selectedDoctors.forEach((doctor) => {
            firebaseContext.doCreateUserDoc(doctor.value, key, "");
          });
          setPdfFile(null);
          setSelectedDoctors([]);
        }
      );
    }
  };

  return (
    <Fragment>
      <CssBaseline />
      <Navbar />
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
    </Fragment>
  );
}

export default Home;
