import React from "react";
import Dropzone from "react-dropzone";

function MyDropzone({ setUploadedFile, uploadedFile }) {
  const onDrop = (acceptedFiles) => {
    // console.log(acceptedFiles[0]);
    setUploadedFile(acceptedFiles[0]);
  };
  return (
    <Dropzone onDrop={onDrop}>
      {({ getRootProps, getInputProps }) => (
        <section>
          <div
            {...getRootProps()}
            className="bg-light border-secondary"
            style={{
              borderStyle: "dotted",
              padding: "50px 10px",
              cursor: "pointer",
            }}
          >
            <input {...getInputProps()} />
            <div className="d-flex align-items-center justify-content-center">
              {!uploadedFile
                ? (
                  <span>Drop file or Click to select file</span>
                )
                : (
                  <span>{uploadedFile.name}</span>
                )}
            </div>
          </div>
        </section>
      )}
    </Dropzone>
  );
}

export default MyDropzone;
