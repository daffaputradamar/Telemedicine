import React from "react";
import PDFReader from "rn-pdf-reader-js";

function PDFView(props) {
  const uri = props.navigation.state.params.uri;
  return (
    <PDFReader
      source={{
        uri,
      }}
    />
  );
  //   return <Text>Halo</Text>;
}

export default PDFView;
