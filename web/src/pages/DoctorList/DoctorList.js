import React, { Fragment, useEffect, useContext, useState } from "react";
import { CssBaseline, Container } from "@material-ui/core";
import Navbar from "../../components/Navbar";
import { FirebaseContext } from "../../components/Firebase";
import DoctorTable from "./DoctorTable";
import { confirmAlert } from "react-confirm-alert";

function DoctorList() {
  const firebaseContext = useContext(FirebaseContext);
  const [doctors, setDoctors] = useState([]);
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    const fetchDoctors = () => {
      firebaseContext.refDoctors().on("value", (snapshot) => {
        const val = snapshot.val();
        const _doctors = Object.keys(val).map((id) => ({
          uid: id,
          ...val[id],
        }));
        setDoctors(_doctors);
      });
    };
    fetchDoctors();
  }, [firebaseContext]);

  const deleteDoctor = () => {
    confirmAlert({
      title: "Konfirmasi",
      message: "Apakah anda yakin untuk menghapus dokter yang dipilih?",
      buttons: [
        {
          label: "Iya",
          onClick: () => {
            const _selected = [...selected];
            firebaseContext.doDeleteDoctor(_selected);
            setSelected([]);
          },
        },
        {
          label: "Tidak",
          onClick: () => {},
        },
      ],
    });
  };

  return (
    <Fragment>
      <CssBaseline />
      <Navbar />
      <Container>
        {doctors && (
          <DoctorTable
            rows={doctors}
            selected={selected}
            setSelected={setSelected}
            deleteDoctor={deleteDoctor}
          />
        )}
      </Container>
    </Fragment>
  );
}

export default DoctorList;
