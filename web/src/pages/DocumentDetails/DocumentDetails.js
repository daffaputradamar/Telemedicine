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
    fetchDocDetail();
    fetchDoctorByDoc();
  }, []);

  const fetchDocDetail = () => {
    firebaseContext.refDocsDetail(params.id).once("value", (snapshot) => {
      setDocDetail(snapshot.val());
    });
  };

  const fetchDoctorByDoc = () => {
    firebaseContext.refDoctorByDoc(params.id).on("value", (snapshot) => {
      const val = snapshot.val();
      let replies = Object.keys(val).map((key) => ({
        ids: key,
        ...val[key],
      }));
      setDoctors(replies);
    });
  };

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
