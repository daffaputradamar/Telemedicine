import React, { useContext } from "react";
import { Route, Redirect } from "react-router-dom";
import AuthUserContext from "./context";

const condition = (authUser) => !authUser;

const PublicRoute = ({ component: Component, ...rest }) => {
  const authContext = useContext(AuthUserContext);
  return (
    // Show the component only when the user is logged in
    // Otherwise, redirect the user to /signin page
    <Route
      {...rest}
      render={(props) =>
        condition(authContext) ? <Component {...props} /> : <Redirect to="/" />
      }
    />
  );
};

export default PublicRoute;
