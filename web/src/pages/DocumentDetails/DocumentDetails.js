import React, { Fragment, useContext, useState, useEffect } from "react";
import {
  CssBaseline,
  Container,
  Card,
  CardContent,
  Grid,
  CircularProgress,
  Box,
  Typography,
  Divider,
  Button,
} from "@material-ui/core";
import Navbar from "../../components/Navbar";
import { FirebaseContext } from "../../components/Firebase";
import { Description } from "@material-ui/icons";
import { timeConverter } from "../../lib/timeConverter";
import DoctorAccordion from "./DoctorAccordion";

function DocumentDetails(props) {
  const firebaseContext = useContext(FirebaseContext);
  const {
    match: { params },
  } = props;

  const [docDetail, setDocDetail] = useState(null);
  const [doctors, setDoctors] = useState(null);

  useEffect(() => {
    const fetchDocDetail = () => {
      firebaseContext
        .refDocs()
        .child(params.id)
        .once("value", (snapshot) => {
          setDocDetail(snapshot.val());
        });
    };

    const fetchDoctorsByDoc = () => {
      const ref = firebaseContext.refDocToUsers(params.id);
      ref.on("value", (snapshot) => {
        const val = snapshot.val();
        if (val) {
          let uids = Object.keys(val);
          Promise.all(
            uids.map(async (id) => {
              const valUser = (
                await firebaseContext.refDoctors().child(id).once("value")
              ).val();
              return { uid: id, ...valUser };
            })
          ).then((result) => {
            const _doctors = result.map((res) => {
              return {
                ...res,
                reply: val[res.uid],
              };
            });
            setDoctors(_doctors);
          });
        }
      });
    };

    fetchDocDetail();
    fetchDoctorsByDoc();
  }, [firebaseContext, params.id]);

  return (
    <Fragment>
      <CssBaseline />
      <Navbar />
      <Container>
        <Card variant="outlined">
          <CardContent>
            {!docDetail ? (
              <Grid
                container
                direction="row"
                justify="center"
                alignItems="center"
              >
                <CircularProgress />
              </Grid>
            ) : (
              <Grid container alignItems="center" justify="space-between">
                <Box display="flex" alignItems="center">
                  <Box mr={4}>
                    <Description color="error" style={{ fontSize: "3rem" }} />
                  </Box>
                  <div>
                    <Box mb={1}>
                      <Typography variant="h6">{docDetail.filename}</Typography>
                    </Box>
                    <Typography variant="caption">
                      {timeConverter(docDetail.timestamp)}
                    </Typography>
                  </div>
                </Box>
                <Button href={docDetail.url} download target="_blank">
                  Download
                </Button>
              </Grid>
            )}
          </CardContent>
        </Card>
        <Box my={3}>
          <Divider />
        </Box>
        {doctors && <DoctorAccordion doctors={doctors} />}
      </Container>
    </Fragment>
  );
}

export default DocumentDetails;
