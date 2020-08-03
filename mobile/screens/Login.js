import React, { useState, useContext } from "react";
import {
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  StyleSheet,
  Alert,
  ToastAndroid,
} from "react-native";

import { Button, Block, Input, Text } from "../components";
import { theme } from "../constants";
import { FirebaseContext } from "../components/Firebase";

const INITIAL_STATE = {
  email: "",
  password: "",
  errors: [],
  errMessage: "",
  loading: false,
};

function Login(props) {
  const firebaseContext = useContext(FirebaseContext);

  const [formLogin, setFormLogin] = useState({ ...INITIAL_STATE });

  handleLogin = () => {
    const { navigation } = props;
    const { email, password } = formLogin;
    const errors = [];

    Keyboard.dismiss();
    setFormLogin({ ...formLogin, loading: true });

    // check with backend API or with some static data
    if (email == "") {
      errors.push("email");
    }
    if (password == "") {
      errors.push("password");
    }

    setFormLogin({ errors });

    if (!errors.length) {
      firebaseContext
        .doSignInWithEmailAndPassword(formLogin.email, formLogin.password)
        .then(() => {
          setFormLogin({ ...INITIAL_STATE });
        })
        .catch((err) => setFormLogin({ ...formLogin, errMessage: err }));
    }
  };

  const { navigation } = props;
  const { loading, errors } = formLogin;
  const hasErrors = (key) => (errors.includes(key) ? styles.hasErrors : null);

  return (
    <KeyboardAvoidingView style={styles.login} behavior="height">
      <Block padding={[0, theme.sizes.base * 2]}>
        <Text h1 bold>
          Login
        </Text>
        <Block middle>
          <Input
            label="Email"
            email
            error={hasErrors("email")}
            style={[styles.input, hasErrors("email")]}
            defaultValue={formLogin.email}
            onChangeText={(text) => setFormLogin({ ...formLogin, email: text })}
          />
          <Input
            secure
            label="Password"
            error={hasErrors("password")}
            style={[styles.input, hasErrors("password")]}
            defaultValue={formLogin.password}
            onChangeText={(text) =>
              setFormLogin({ ...formLogin, password: text })
            }
          />
          <Button gradient onPress={() => handleLogin()}>
            {loading ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Text bold white center>
                Login
              </Text>
            )}
          </Button>

          <Button onPress={() => navigation.navigate("Forgot")}>
            <Text
              gray
              caption
              center
              style={{ textDecorationLine: "underline" }}
            >
              Forgot your password?
            </Text>
          </Button>
        </Block>
      </Block>
    </KeyboardAvoidingView>
  );
}

export default Login;

const styles = StyleSheet.create({
  login: {
    flex: 1,
    justifyContent: "center",
  },
  input: {
    borderRadius: 0,
    borderWidth: 0,
    borderBottomColor: theme.colors.gray2,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  hasErrors: {
    borderBottomColor: theme.colors.accent,
  },
});
