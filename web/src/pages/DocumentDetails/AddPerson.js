import React from "react";
import { Box, Button } from "@material-ui/core";

function AddPerson() {
  return (
    <Box display="flex" justifyContent="flex-end" mt={2}>
      <Box mr={2}>
        <Button variant="outlined">Batal</Button>
      </Box>
      <Button variant="outlined">Tambah Orang</Button>
    </Box>
  );
}

export default AddPerson;
