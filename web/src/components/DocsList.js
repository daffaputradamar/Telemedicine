import React, { Fragment, useState, useEffect } from "react";
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Paper,
  Box,
  TextField,
  InputAdornment,
  makeStyles,
} from "@material-ui/core";
import { Description, SearchOutlined } from "@material-ui/icons";
import { timeConverter } from "../lib/timeConverter";
import { Link } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  linkStyle: {
    textDecoration: "none",
    color: "#000",
  },
}));

function DocsList({ documents }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [docsFiltered, setDocsFiltered] = useState([]);

  useEffect(() => {
    setDocsFiltered(documents);
  }, [documents]);

  const filterDocs = (e) => {
    setSearchQuery(e.target.value);
    const filterDocs = documents.filter((doc) =>
      doc.filename.includes(e.target.value)
    );
    setDocsFiltered(filterDocs);
  };

  const classes = useStyles();
  return (
    <Fragment>
      {/* <Box mb={2}>
        <Typography variant="h5" align="center">
          List Dokumen
        </Typography>
      </Box> */}
      <Box display="flex" justifyContent="flex-end" marginBottom={2}>
        <TextField
          size="small"
          variant="outlined"
          type="search"
          value={searchQuery}
          onChange={filterDocs}
          placeholder="Nama Dokumen"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchOutlined />
              </InputAdornment>
            ),
          }}
        ></TextField>
      </Box>
      {docsFiltered.length !== 0 ? (
        <List component="nav" aria-label="main mailbox folders">
          {docsFiltered.map((doc) => {
            return (
              <Box mb={1} key={doc.docid}>
                <Link to={`/docs/${doc.docid}`} className={classes.linkStyle}>
                  <Paper variant="outlined">
                    <ListItem button>
                      <ListItemIcon>
                        <Description color="error" fontSize="large" />
                      </ListItemIcon>
                      <ListItemText
                        primary={doc.filename}
                        secondary={timeConverter(doc.timestamp)}
                      />
                    </ListItem>
                  </Paper>
                </Link>
              </Box>
            );
          })}
        </List>
      ) : (
        <Box mt={4}>
          <Typography color="textSecondary" align="center">
            Dokumen tidak ada
          </Typography>
        </Box>
      )}
    </Fragment>
  );
}

export default DocsList;
