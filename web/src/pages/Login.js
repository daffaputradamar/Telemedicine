import React, { useState, useContext } from "react";
import {
  Container,
  makeStyles,
  Typography,
  Link,
  CssBaseline,
  Avatar,
  TextField,
  Button,
  Box,
  withStyles,
} from "@material-ui/core";
import { LockOutlined } from "@material-ui/icons";
import { FirebaseContext } from "../components/Firebase";
import { red } from "@material-ui/core/colors";

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="https://telermedicine.firebaseio.com">
        Telemedicine
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(2),
    backgroundColor: theme.palette.info.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    padding: "10px 10px",
    margin: theme.spacing(3, 0, 2),
  },
}));

const DangerTextTypography = withStyles({
  root: {
    color: red[500],
    fontSize: "0.9rem",
  },
})(Typography);

const INITIAL_STATE = {
  email: "",
  password: "",
  error: null,
};

function Login(props) {
  const firebaseContext = useContext(FirebaseContext);
  const [loginForm, setLoginForm] = useState({ ...INITIAL_STATE });

  const onSubmit = (e) => {
    e.preventDefault();
    console.log(firebaseContext);
    firebaseContext
      .doSignInWithEmailAndPassword(loginForm.email, loginForm.password)
      .then(() => {
        setLoginForm({ ...INITIAL_STATE });
        props.history.push("/");
      })
      .catch((err) => setLoginForm({ ...loginForm, error: err }));
  };

  const classes = useStyles();

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlined />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign In
        </Typography>
        <form className={classes.form} onSubmit={onSubmit}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            type="email"
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            onChange={(e) =>
              setLoginForm({ ...loginForm, [e.target.name]: e.target.value })
            }
            value={loginForm.email}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            onChange={(e) =>
              setLoginForm({ ...loginForm, [e.target.name]: e.target.value })
            }
            value={loginForm.password}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Login
          </Button>
          {loginForm.error && (
            <DangerTextTypography>
              *{loginForm.error.message}
            </DangerTextTypography>
          )}
        </form>
      </div>
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
  );
}

export default Login;
