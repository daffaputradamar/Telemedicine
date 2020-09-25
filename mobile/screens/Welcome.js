import React, { Component } from "react";

import { Button, Block, Text } from "../components";
import { theme } from "../constants";

class Welcome extends Component {
  static navigationOptions = {
    header: null,
  };

  render() {
    const { navigation } = this.props;

    return (
      <Block>
        <Block center bottom flex={0.4}>
          <Text h1 center bold>
            Tele.
            <Text h1 primary>
              Medicine.
            </Text>
          </Text>
          <Text h3 gray2 style={{ marginTop: theme.sizes.padding / 2 }}>
            Diagnose Faster. Diagnose Better
          </Text>
        </Block>
        <Block middle flex={0.5} margin={[0, theme.sizes.padding * 2]}>
          <Button gradient onPress={() => navigation.navigate("Login")}>
            <Text center bold black>
              Login
            </Text>
          </Button>
          <Button shadow onPress={() => navigation.navigate("SignUp")}>
            <Text center semibold>
              Signup
            </Text>
          </Button>
        </Block>
      </Block>
    );
  }
}

export default Welcome;
