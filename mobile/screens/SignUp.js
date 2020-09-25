import React, { Component, useState, useContext } from "react";
import {
  Alert,
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  StyleSheet,
} from "react-native";

import { Button, Block, Input, Text } from "../components";
import { theme } from "../constants";
import { FirebaseContext } from "../components/Firebase";

const INITIAL_STATE = {
  email: null,
  name: null,
  password: null,
  phone: null,
  errors: [],
  loading: false,
};

function SignUp({ navigation }) {
  const firebaseContext = useContext(FirebaseContext);
  const [signUpForm, setSignUpForm] = useState({ ...INITIAL_STATE });

  const handleSignUp = () => {
    const { email, name, password, phone } = signUpForm;
    const errors = [];

    Keyboard.dismiss();
    setSignUpForm({ ...signUpForm, loading: true });

    // check with backend API or with some static data
    if (!email) errors.push("email");
    if (!name) errors.push("name");
    if (!password) errors.push("password");
    if (!phone) errors.push("phone");

    setSignUpForm({ ...signUpForm, errors, loading: false });

    if (!errors.length) {
      firebaseContext
        .doCreateUserWithEmailAndPassword(email, password)
        .then((snapshot) => {
          if (!snapshot.user.emailVerified) {
            firebaseContext.doSignOut();
            setSignUpForm({
              ...INITIAL_STATE,
            });
            firebaseContext.refDoctors().child(snapshot.user.uid).set({
              counter: 0,
              email,
              name,
              phone,
            });
            snapshot.user.sendEmailVerification().then(() => {
              Alert.alert(
                "Sukses",
                "Akun selesai dibuat. Silahkan verifikasi melalui email yang didaftarkan",
                [
                  {
                    text: "Continue",
                    onPress: () => {
                      navigation.navigate("Login");
                    },
                  },
                ],
                { cancelable: false }
              );
            });
          }
        });
    }
  };

  const { loading, errors } = signUpForm;
  const hasErrors = (key) => (errors.includes(key) ? styles.hasErrors : null);

  return (
    <KeyboardAvoidingView style={styles.signup} behavior="height">
      <Block padding={[0, theme.sizes.base * 2]}>
        <Text h1 bold>
          Sign Up
        </Text>
        <Block middle>
          <Input
            email
            label="Email"
            error={hasErrors("email")}
            style={[styles.input, hasErrors("email")]}
            defaultValue={signUpForm.email}
            onChangeText={(text) =>
              setSignUpForm({ ...signUpForm, email: text })
            }
          />
          <Input
            label="Name"
            error={hasErrors("name")}
            style={[styles.input, hasErrors("name")]}
            defaultValue={signUpForm.name}
            onChangeText={(text) =>
              setSignUpForm({ ...signUpForm, name: text })
            }
          />
          <Input
            phone
            label="No Hp"
            error={hasErrors("phone")}
            style={[styles.input, hasErrors("phone")]}
            defaultValue={signUpForm.phone}
            onChangeText={(text) =>
              setSignUpForm({ ...signUpForm, phone: text })
            }
          />
          <Input
            secure
            label="Password"
            error={hasErrors("password")}
            style={[styles.input, hasErrors("password")]}
            defaultValue={signUpForm.password}
            onChangeText={(text) =>
              setSignUpForm({ ...signUpForm, password: text })
            }
          />
          <Button gradient onPress={handleSignUp}>
            {loading ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Text bold black center>
                Sign Up
              </Text>
            )}
          </Button>

          <Button onPress={() => navigation.navigate("Login")}>
            <Text
              gray
              caption
              center
              style={{ textDecorationLine: "underline" }}
            >
              Back to Login
            </Text>
          </Button>
        </Block>
      </Block>
    </KeyboardAvoidingView>
  );
}

export default SignUp;

const styles = StyleSheet.create({
  signup: {
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
