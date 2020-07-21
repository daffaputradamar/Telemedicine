import React, { Fragment } from "react";
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Paper,
  Box,
} from "@material-ui/core";
import { Description } from "@material-ui/icons";
import { timeConverter } from "../lib/timeConverter";

function DocsList({ documents }) {
  return (
    <Fragment>
      <Box mb={2}>
        <Typography variant="h5" align="center">
          List Dokumen
        </Typography>
      </Box>
      <List component="nav" aria-label="main mailbox folders">
        {documents.map((doc) => {
          return (
            <Box mb={1}>
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
            </Box>
          );
        })}
      </List>
    </Fragment>
  );
}

export default DocsList;
