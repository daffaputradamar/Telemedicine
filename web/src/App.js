import React, { useContext, useState, useEffect } from "react";
import { routes } from "./config/routes";
import { BrowserRouter, Switch } from "react-router-dom";
import { FirebaseContext } from "./components/Firebase";
import { AuthUserContext } from "./components/Session";
import PublicRoute from "./components/Session/PublicRoute";
import PrivateRoute from "./components/Session/PrivateRoute";
import { makeStyles, Backdrop, CircularProgress } from "@material-ui/core";

let listener;

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
}));

function App() {
  const firebaseContext = useContext(FirebaseContext);
  const [authUser, setAuthUser] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    listener = firebaseContext.auth.onAuthStateChanged((authUser) => {
      authUser ? setAuthUser(authUser) : setAuthUser(null);
      setLoading(false);
    });

    return function cleanup() {
      listener();
    };
  }, [firebaseContext]);

  const renderRoutes = () => {
    return routes.map((route) => {
      if (route.private) {
        return (
          <PrivateRoute
            key={route.name}
            path={route.path}
            component={route.component}
            exact={route.exact}
          />
        );
      } else {
        return (
          <PublicRoute
            key={route.name}
            path={route.path}
            component={route.component}
            exact={route.exact}
          />
        );
      }
    });
  };

  const classes = useStyles();

  if (loading) {
    return (
      <Backdrop className={classes.backdrop} open={true}>
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  }

  return (
    <AuthUserContext.Provider value={authUser}>
      <BrowserRouter>
        <Switch>{renderRoutes()}</Switch>
      </BrowserRouter>
    </AuthUserContext.Provider>
  );
}

export default App;
