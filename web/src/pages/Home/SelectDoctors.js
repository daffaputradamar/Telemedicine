import React, { useState } from "react";
import Select from "react-select";
import { Typography, Box } from "@material-ui/core";

const SelectDoctors = ({ doctors, selectedDoctors, setSelectedDoctors }) => {
  const doctorOptions = () => {
    return doctors.map((doctor) => {
      return {
        label: doctor.name,
        value: doctor.uid,
      };
    });
  };

  return (
    <div>
      <Box mb={2}>
        <Typography variant="subtitle1">Pilih Dokter</Typography>
      </Box>
      <Select
        options={doctorOptions()}
        value={selectedDoctors}
        onChange={setSelectedDoctors}
        isMulti
        isSearchable
        placeholder="Pilih..."
      />
    </div>
  );
};

export default SelectDoctors;
