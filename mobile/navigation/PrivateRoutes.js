import React from "react";
import { Image } from "react-native";
import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";

import Browse from "../screens/Browse";
import Settings from "../screens/Settings";
import DocDetail from "../screens/DocDetail";
import ChangePassword from "../screens/ChangePassword";
import PDFView from "../screens/PDFView";

import { theme } from "../constants";

const screens = createStackNavigator(
  {
    Browse,
    DocDetail,
    Settings,
    ChangePassword,
    PDFView,
  },
  {
    defaultNavigationOptions: {
      headerStyle: {
        height: theme.sizes.base * 4,
        backgroundColor: theme.colors.white, // or 'white
        borderBottomColor: "transparent",
        elevation: 0, // for android
      },
      headerBackImage: <Image source={require("../assets/icons/back.png")} />,
      headerBackTitle: null,
      headerLeftContainerStyle: {
        alignItems: "center",
        marginLeft: theme.sizes.base * 2,
        paddingRight: theme.sizes.base,
      },
      headerRightContainerStyle: {
        alignItems: "center",
        paddingRight: theme.sizes.base,
      },
    },
  }
);

export default createAppContainer(screens);
