import React from "react";
import { Block } from "../components";
import { StyleSheet, ActivityIndicator } from "react-native";
import { theme } from "../constants";

function SplashScreen() {
  return (
    <Block center middle>
      <ActivityIndicator size="large" color={theme.colors.primary} />
    </Block>
  );
}

const styles = StyleSheet.create({
  // container: {
  //     flex: 1,
  //     justifyContent: center
  // }
});

export default SplashScreen;
