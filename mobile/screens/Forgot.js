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
import { FirebaseContext } from "../components/Firebase";

function Forgot(props) {
  const firebaseContext = useContext(FirebaseContext);
  const { navigation } = props;

  const [forgotForm, setForgotForm] = useState({
    email: "",
    errors: [],
    loading: false,
  });

  const handleForgot = () => {
    const { email } = forgotForm;
    const errors = [];

    Keyboard.dismiss();

    setForgotForm({ ...forgotForm, loading: true });

    if (email === "") {
      errors.push("email");
    }

    setForgotForm({ ...forgotForm, errors });

    if (!errors.length) {
      firebaseContext.auth
        .sendPasswordResetEmail(email)
        .then(() => {
          Alert.alert(
            "Password Dikirim!",
            "Mohon dicek melalui email anda.",
            [
              {
                text: "OK",
                onPress: () => {
                  navigation.navigate("Login");
                },
              },
            ],
            { cancelable: false }
          );
        })
        .catch((err) => {
          ToastAndroid.show(err.message, ToastAndroid.SHORT);
        });
    }
  };

  const hasErrors = (key) =>
    forgotForm.errors.includes(key) ? styles.hasErrors : null;

  return (
    <KeyboardAvoidingView style={styles.forgot} behavior="padding">
      <Block padding={[0, theme.sizes.base * 2]}>
        <Text h1 bold>
          Lupa Password
        </Text>
        <Block middle>
          <Input
            email
            label="Email"
            error={hasErrors("email")}
            style={[styles.input, hasErrors("email")]}
            defaultValue={forgotForm.email}
            onChangeText={(text) =>
              setForgotForm({ ...forgotForm, email: text })
            }
          />
          <Button
            gradient
            onPress={
              !forgotForm.loading
                ? handleForgot
                : () => ToastAndroid.show("Sedang diproses", ToastAndroid.SHORT)
            }
          >
            {forgotForm.loading ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Text bold black center>
                Forgot
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

// export default class Forgot extends Component {
//   state = {
//     email: "",
//     errors: [],
//     loading: false,
//   };

//   handleForgot() {
//     const { navigation } = this.props;
//     const { email } = this.state;
//     const errors = [];

//     Keyboard.dismiss();
//     this.setState({ loading: true });

//     // check with backend API or with some static data
//     if (email !== VALID_EMAIL) {
//       errors.push("email");
//     }

//     this.setState({ errors, loading: false });

//     if (!errors.length) {
//       Alert.alert(
//         "Password sent!",
//         "Please check you email.",
//         [
//           {
//             text: "OK",
//             onPress: () => {
//               navigation.navigate("Login");
//             },
//           },
//         ],
//         { cancelable: false }
//       );
//     } else {
//       Alert.alert(
//         "Error",
//         "Please check you Email address.",
//         [{ text: "Try again" }],
//         { cancelable: false }
//       );
//     }
//   }

//   render() {
//     const { navigation } = this.props;
//     const { loading, errors } = this.state;
//     const hasErrors = (key) => (errors.includes(key) ? styles.hasErrors : null);

//     return (
//       <KeyboardAvoidingView style={styles.forgot} behavior="padding">
//         <Block padding={[0, theme.sizes.base * 2]}>
//           <Text h1 bold>
//             Forgot
//           </Text>
//           <Block middle>
//             <Input
//               label="Email"
//               error={hasErrors("email")}
//               style={[styles.input, hasErrors("email")]}
//               defaultValue={this.state.email}
//               onChangeText={(text) => this.setState({ email: text })}
//             />
//             <Button gradient onPress={() => this.handleForgot()}>
//               {loading ? (
//                 <ActivityIndicator size="small" color="white" />
//               ) : (
//                 <Text bold white center>
//                   Forgot
//                 </Text>
//               )}
//             </Button>

//             <Button onPress={() => navigation.navigate("Login")}>
//               <Text
//                 gray
//                 caption
//                 center
//                 style={{ textDecorationLine: "underline" }}
//               >
//                 Back to Login
//               </Text>
//             </Button>
//           </Block>
//         </Block>
//       </KeyboardAvoidingView>
//     );
//   }
// }

export default Forgot;

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
