import React, { Component, useContext, useState } from "react";
import {
  Alert,
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  StyleSheet,
  ToastAndroid,
} from "react-native";

import { Button, Block, Input, Text } from "../components";
import { theme } from "../constants";
import firebase from "firebase";
import { FirebaseContext } from "../components/Firebase";

function ChangePassword(props) {
  const firebaseContext = useContext(FirebaseContext);

  const [changeForm, setChangeForm] = useState({
    oldPassword: "",
    newPassword: "",
    errMessage: "",
    errors: [],
    loading: false,
  });

  const handleChangePassword = () => {
    const { navigation } = props;
    const { oldPassword, newPassword } = changeForm;
    const errors = [];

    Keyboard.dismiss();

    setChangeForm({ ...changeForm, loading: true });

    if (oldPassword === "") {
      errors.push("oldPassword");
    }

    if (newPassword === "") {
      errors.push("newPassword");
    }

    setChangeForm({ ...changeForm, errors });

    if (!errors.length) {
      const user = firebaseContext.auth.currentUser;
      const credentials = firebase.auth.EmailAuthProvider.credential(
        user.email,
        oldPassword
      );

      user
        .reauthenticateWithCredential(credentials)
        .then(() => {
          user.updatePassword(newPassword).then(() => {
            Alert.alert(
              "Sukses",
              "Password telah diubah.",
              [
                {
                  text: "OK",
                  onPress: () => {
                    navigation.navigate("Settings");
                  },
                },
              ],
              { cancelable: false }
            );
          });
        })
        .catch((err) => {
          ToastAndroid.show("Password salah", ToastAndroid.SHORT);
          setChangeForm({ ...changeForm, errMessage: err.message });
        });
    }
  };

  const hasErrors = (key) =>
    changeForm.errors.includes(key) ? styles.hasErrors : null;

  return (
    <KeyboardAvoidingView style={styles.forgot} behavior="height">
      <Block padding={[0, theme.sizes.base * 2]}>
        <Text h1 bold>
          Ganti Password
        </Text>
        <Block middle>
          {changeForm.errMessage !== "" && (
            <Text color={theme.colors.accent}>{changeForm.errMessage}</Text>
          )}
          <Input
            secure
            label="Password lama"
            error={hasErrors("oldPassword")}
            style={[styles.input, hasErrors("oldPassword")]}
            defaultValue={changeForm.oldPassword}
            onChangeText={(text) =>
              setChangeForm({ ...changeForm, oldPassword: text })
            }
          />
          <Input
            secure
            label="Password baru"
            error={hasErrors("newPassword")}
            style={[styles.input, hasErrors("newPassword")]}
            defaultValue={changeForm.newPassword}
            onChangeText={(text) =>
              setChangeForm({ ...changeForm, newPassword: text })
            }
          />
          <Button
            gradient
            onPress={
              !changeForm.loading
                ? handleChangePassword
                : () => ToastAndroid.show("Sedang diproses", ToastAndroid.SHORT)
            }
          >
            {changeForm.loading ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Text bold black center>
                Ganti
              </Text>
            )}
          </Button>

          <Button onPress={() => props.navigation.navigate("Settings")}>
            <Text
              gray
              caption
              center
              style={{ textDecorationLine: "underline" }}
            >
              Kembali
            </Text>
          </Button>
        </Block>
      </Block>
    </KeyboardAvoidingView>
  );
}

export default ChangePassword;

const styles = StyleSheet.create({
  forgot: {
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
