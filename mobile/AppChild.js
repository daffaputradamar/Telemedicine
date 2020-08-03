import React, { useContext, useEffect, useState } from "react";

import SplashScreen from "./screens/SplashScreen";
import PrivateRoutes from "./navigation/PrivateRoutes";
import PublicRoutes from "./navigation/PublicRoutes";
import { FirebaseContext } from "./components/Firebase";

function AppChild() {
  const firebaseContext = useContext(FirebaseContext);

  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [loadingAuth, setLoadingAuth] = useState(false);

  useEffect(() => {
    setLoadingAuth(true);
    listener = firebaseContext.auth.onAuthStateChanged((authUser) => {
      authUser ? setIsAuthenticated(authUser) : setIsAuthenticated(null);
      setLoadingAuth(false);
    });

    return function cleanup() {
      listener();
    };
  }, [firebaseContext]);

  if (loadingAuth) {
    return <SplashScreen />;
  } else {
    if (isAuthenticated) {
      return <PrivateRoutes />;
    } else {
      return <PublicRoutes />;
    }
  }
}

export default AppChild;
