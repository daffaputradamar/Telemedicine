import React, { useContext } from "react";
import {
  makeStyles,
  AppBar,
  Toolbar,
  Typography,
  Box,
} from "@material-ui/core";
import { FirebaseContext } from "../components/Firebase";
import { Link as LinkRouter } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  btnNav: {
    cursor: "pointer",
  },
  linkStyle: {
    textDecoration: "none",
    color: "#000",
  },
}));

function Navbar() {
  const firebaseContext = useContext(FirebaseContext);

  const classes = useStyles();

  return (
    <Box mb={3}>
      <AppBar position="static" color="transparent" elevation={0}>
        <Box display="flex" justifyContent="flex-end">
          <Toolbar>
            <Box ml={5}>
              <Typography variant="button" className={classes.btnNav}>
                <LinkRouter to="/" className={classes.linkStyle}>
                  Home
                </LinkRouter>
              </Typography>
            </Box>
            <Box ml={5}>
              <LinkRouter to="/u" className={classes.linkStyle}>
                <Typography variant="button" className={classes.btnNav}>
                  Dokter
                </Typography>
              </LinkRouter>
            </Box>
            <Box ml={5}>
              <Typography
                variant="button"
                className={classes.btnNav}
                onClick={firebaseContext.doSignOut}
              >
                Logout
              </Typography>
            </Box>
          </Toolbar>
        </Box>
      </AppBar>
    </Box>
  );
}

export default Navbar;
