import React, { Fragment, useEffect, useContext, useState } from "react";
import { CssBaseline, Container } from "@material-ui/core";
import Navbar from "../../components/Navbar";
import { FirebaseContext } from "../../components/Firebase";
import DoctorTable from "./DoctorTable";

function DoctorList() {
  const firebaseContext = useContext(FirebaseContext);
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = () => {
    firebaseContext.refDoctors().on("value", (snapshot) => {
      const val = snapshot.val();
      const _doctors = Object.keys(val).map((id) => ({ uid: id, ...val[id] }));
      setDoctors(_doctors);
    });
  };

  return (
    <Fragment>
      <CssBaseline />
      <Navbar />
      <Container>{doctors && <DoctorTable rows={doctors} />}</Container>
    </Fragment>
  );
}

export default DoctorList;
