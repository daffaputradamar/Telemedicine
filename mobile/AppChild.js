import React, { useContext, useEffect, useState } from "react";

import SplashScreen from "./screens/SplashScreen";
import PrivateRoutes from "./navigation/PrivateRoutes";
import PublicRoutes from "./navigation/PublicRoutes";
import { FirebaseContext } from "./components/Firebase";
import { ToastAndroid, Alert } from "react-native";
import { AuthUserContext } from "./components/Session";

function AppChild() {
  const firebaseContext = useContext(FirebaseContext);

  const [authUser, setAuthUser] = useState(true);
  const [loadingAuth, setLoadingAuth] = useState(false);

  useEffect(() => {
    setLoadingAuth(true);
    listener = firebaseContext.auth.onAuthStateChanged((authUser) => {
      if (authUser && authUser.emailVerified) {
        firebaseContext
          .refDoctors()
          .child(authUser.uid)
          .on("value", (snapshot) => {
            const val = snapshot.val();
            if (val) {
              const newUser = { ...authUser, ...val };
              setAuthUser(newUser);
              setLoadingAuth(false);
            } else {
              setAuthUser(null);
              setLoadingAuth(false);
            }
          });
      } else {
        setAuthUser(null);
        setLoadingAuth(false);
      }
    });

    return function cleanup() {
      listener();
    };
  }, [firebaseContext]);

  if (loadingAuth) {
    return <SplashScreen />;
  } else {
    if (authUser) {
      return (
        <AuthUserContext.Provider value={authUser}>
          <PrivateRoutes />
        </AuthUserContext.Provider>
      );
    } else {
      return <PublicRoutes />;
    }
  }
}

export default AppChild;
