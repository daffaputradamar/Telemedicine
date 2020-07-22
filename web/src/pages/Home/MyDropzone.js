import React from "react";
import Dropzone from "react-dropzone";
import { makeStyles, Paper, Box, Typography } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary,
  },
}));

function MyDropzone({ setUploadedFile, uploadedFile }) {
  const onDrop = (acceptedFiles) => {
    // console.log(acceptedFiles[0]);
    setUploadedFile(acceptedFiles[0]);
  };

  const classes = useStyles();
  return (
    <Dropzone onDrop={onDrop}>
      {({ getRootProps, getInputProps }) => (
        <section>
          <Box border={1} borderColor="grey.500" borderRadius="borderRadius">
            <Paper
              {...getRootProps()}
              className={classes.paper}
              style={{
                cursor: "pointer",
              }}
            >
              <input {...getInputProps()} />
              <Box p={5}>
                {!uploadedFile ? (
                  <Typography>Drop file or Click to select file</Typography>
                ) : (
                  <span>{uploadedFile.name}</span>
                )}
              </Box>
            </Paper>
          </Box>
        </section>
      )}
    </Dropzone>
  );
}

export default MyDropzone;
