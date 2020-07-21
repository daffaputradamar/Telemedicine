import React, { useContext } from "react";
import { Route, Redirect } from "react-router-dom";
import AuthUserContext from "./contex";

const condition = (authUser) => !!authUser;

const PrivateRoute = ({ component: Component, ...rest }) => {
  const authContext = useContext(AuthUserContext);
  return (
    // Show the component only when the user is logged in
    // Otherwise, redirect the user to /signin page
    <Route
      {...rest}
      render={(props) =>
        condition(authContext) ? (
          <Component {...props} />
        ) : (
          <Redirect to="/login" />
        )
      }
    />
  );
};

export default PrivateRoute;
