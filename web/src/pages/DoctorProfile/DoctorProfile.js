import React, { Fragment, useContext, useState, useEffect } from "react";
import {
  CssBaseline,
  Container,
  Card,
  CardContent,
  CircularProgress,
  Box,
  Typography,
  Grid,
  Paper,
  Divider,
} from "@material-ui/core";
import Navbar from "../../components/Navbar";
import { FirebaseContext } from "../../components/Firebase";
import { PersonOutline } from "@material-ui/icons";
import DocsAccordion from "./DocsAccordion";

function DoctorProfile(props) {
  const firebaseContext = useContext(FirebaseContext);
  const {
    match: { params },
  } = props;

  const [doctorDetail, setDoctorDetail] = useState(null);
  const [docs, setDocs] = useState([]);
  const [docsSum, setDocsSum] = useState(0);

  useEffect(() => {
    const fetchDoctorDetail = () => {
      firebaseContext
        .refDoctors()
        .child(params.id)
        .once("value", (snapshot) => {
          setDoctorDetail(snapshot.val());
        });
    };
    const fetchDocsByDoctor = () => {
      const ref = firebaseContext.refUserToDocs(params.id);
      ref.on("value", (snapshot) => {
        const val = snapshot.val();
        if (val) {
          let docids = Object.keys(val);
          Promise.all(
            docids.map(async (id) => {
              const valDoc = (
                await firebaseContext.refDocs().child(id).once("value")
              ).val();
              return { docid: id, ...valDoc };
            })
          ).then((result) => {
            const _docs = result.map((res) => {
              return {
                ...res,
                reply: val[res.docid],
              };
            });
            setDocsSum(_docs.length);
            setDocs(_docs.reverse());
          });
        }
      });
    };

    fetchDoctorDetail();
    fetchDocsByDoctor();
  }, [firebaseContext, params.id]);

  return (
    <Fragment>
      <CssBaseline />
      <Navbar />
      <Container>
        <Card variant="outlined">
          <CardContent>
            {!doctorDetail ? (
              <Grid
                container
                direction="row"
                justify="center"
                alignItems="center"
              >
                <CircularProgress />
              </Grid>
            ) : (
              <Grid container alignItems="center">
                <Grid item xs={12} sm={6}>
                  <Grid container>
                    <Grid item xs={2}>
                      <Box
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        height={1}
                      >
                        <PersonOutline style={{ fontSize: "3rem" }} />
                      </Box>
                    </Grid>
                    <Grid item xs={10}>
                      <Box
                        display="flex"
                        flexDirection="column"
                        justifyContent="space-around"
                      >
                        <Box>
                          <Typography variant="h6" gutterBottom>
                            {doctorDetail.name}
                          </Typography>
                        </Box>
                        <Typography
                          variant="subtitle2"
                          gutterBottom
                          display="block"
                        >
                          Email: {doctorDetail.email}
                        </Typography>
                        <Typography
                          variant="subtitle2"
                          gutterBottom
                          display="block"
                        >
                          No Hp: {doctorDetail.phone}
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Grid container spacing={5}>
                    <Grid item xs={12} sm={6}>
                      <Paper variant="outlined">
                        <Box py={3}>
                          <Typography
                            align="center"
                            variant="subtitle2"
                            gutterBottom
                          >
                            Jumlah Dokumen
                          </Typography>
                          <Typography align="center" variant="h4">
                            {docsSum}
                          </Typography>
                        </Box>
                      </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Paper variant="outlined">
                        <Box py={3}>
                          <Typography
                            align="center"
                            variant="subtitle2"
                            gutterBottom
                          >
                            Jumlah Tanggapan
                          </Typography>
                          <Typography align="center" variant="h4">
                            {doctorDetail.counter}
                          </Typography>
                        </Box>
                      </Paper>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            )}
          </CardContent>
        </Card>
        <Box my={3}>
          <Divider />
        </Box>
        {docs && <DocsAccordion docs={docs} />}
      </Container>
    </Fragment>
  );
}

export default DoctorProfile;
