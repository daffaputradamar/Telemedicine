import React, { useState, useContext } from "react";
import {
  Container,
  makeStyles,
  Typography,
  CssBaseline,
  TextField,
  Button,
  Box,
  withStyles,
  Divider,
  Grid,
} from "@material-ui/core";
import { FirebaseContext } from "../../components/Firebase";
import { red } from "@material-ui/core/colors";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(2),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    height: "100vh",
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
  textCenter: {
    textAlign: "center",
  },
  greenBG: {
    backgroundColor: "#92D050",
  },
  textBlue: {
    color: "#2E2E92",
  },
  textLightBlue: {
    color: "#1DB1F0",
  },
  fullHeightVh: {
    height: "100vh",
  },
  fullHeight: {
    height: "100%",
  },
}));

const DangerTextTypography = withStyles({
  root: {
    color: red[500],
    fontSize: "0.9rem",
  },
})(Typography);

function Copyright() {
  const date = new Date().toLocaleDateString("id-ID");
  const time = new Date().toLocaleTimeString("id-ID");
  return (
    <Typography variant="body1" color="textSecondary" align="center">
      {/* {"Copyright © "}
      <Link color="inherit" href="https://telermedicine.firebaseio.com">
        Telemedicine
      </Link>{" "}
      {new Date().getFullYear()}
      {"."} */}
      {`${date} ${time}`}
    </Typography>
  );
}

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
    <div className={classes.container}>
      <CssBaseline />
      <div
        style={{
          flex: "0 1 auto",
        }}
      >
        <Grid container justify="between" alignItems="center">
          <Grid item xs={2} className={classes.textCenter}>
            <Box py={2}>
              <img
                src="/img/ristekdikti.png"
                alt="logo ristekdikti"
                height="80"
              />
            </Box>
          </Grid>
          <Grid item xs={8} className={classes.textCenter}>
            <h2
            // className={classes.textBlue}
            >
              PENELITIAN TERAPAN UNGGULAN PERGURUAN TINGGI
            </h2>
            <h1
            // className={classes.textLightBlue}
            >
              UNIVERSITAS WIDYAGAMA MALANG
            </h1>
          </Grid>
          <Grid item xs={2} className={classes.textCenter}>
            <Box py={2}>
              <img src="/img/widyagama.png" alt="logo widyagama" height="80" />
            </Box>
          </Grid>
        </Grid>
        <Divider />
      </div>
      <div
        className={classes.greenBG}
        style={{
          flex: "1 1 auto",
        }}
      >
        <Box pt={8} mb={4}>
          <Typography component="h1" variant="h4" align="center">
            <Box fontWeight={800}>
              ELEKTROKARDIOGRAF STANDARD KLINIS BERBASIS TELEMEDICINE
            </Box>
          </Typography>
        </Box>
        <div className={classes.paper}>
          <Container component="main" maxWidth="md">
            <form className={classes.form} onSubmit={onSubmit}>
              <Grid container spacing={4} alignItems="center">
                <Grid item xs={5}>
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
                      setLoginForm({
                        ...loginForm,
                        [e.target.name]: e.target.value,
                      })
                    }
                    value={loginForm.email}
                  />
                </Grid>
                <Grid item xs={5}>
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
                      setLoginForm({
                        ...loginForm,
                        [e.target.name]: e.target.value,
                      })
                    }
                    value={loginForm.password}
                  />
                </Grid>
                <Grid item xs={2}>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    size="large"
                    className={classes.submit}
                  >
                    Login
                  </Button>
                </Grid>
              </Grid>
              {loginForm.error && (
                <DangerTextTypography>
                  *{loginForm.error.message}
                </DangerTextTypography>
              )}
            </form>
          </Container>
        </div>
        <Box mt={6}>
          <Typography variant="h6" align="center" className={classes.textBlue}>
            Sabar Setiawidayat - Aviv Yuniar Rahman - Ratna Hidayati
          </Typography>
          <Typography variant="h6" align="center" className={classes.textBlue}>
            2020
          </Typography>
        </Box>
        <Box mt={8}>
          <Copyright />
        </Box>
      </div>
    </div>
  );
}

export default Login;
