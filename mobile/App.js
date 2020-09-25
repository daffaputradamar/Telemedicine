import React, { useState } from "react";

import { AppLoading } from "expo";
import { Asset } from "expo-asset";

import Firebase, { FirebaseContext } from "./components/Firebase";

import { Block } from "./components";
import AppChild from "./AppChild";

// import all used images
const images = [
  require("./assets/icons/back.png"),
  require("./assets/icons/doc.png"),
  require("./assets/images/profile.png"),
];

function App(props) {
  const [isLoadingComplete, setIsLoadingComplete] = useState(false);

  handleResourcesAsync = async () => {
    const cacheImages = images.map((image) => {
      return Asset.fromModule(image).downloadAsync();
    });

    return Promise.all([...cacheImages]);
  };

  if (!isLoadingComplete && !props.skipLoadingScreen) {
    return (
      <AppLoading
        startAsync={this.handleResourcesAsync}
        onError={(error) => console.warn(error)}
        onFinish={() => setIsLoadingComplete(true)}
      />
    );
  }
  return (
    <FirebaseContext.Provider value={new Firebase()}>
      <Block white>
        <AppChild />
        {/* {isAuthenticated ? <PrivateRoutes /> : <PublicRoutes />} */}
      </Block>
    </FirebaseContext.Provider>
  );
}

export default App;
