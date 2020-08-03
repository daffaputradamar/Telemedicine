import React, { useState, useEffect, useContext } from "react";
import {
  Image,
  StyleSheet,
  ScrollView,
  TextInput,
  ToastAndroid,
  ActivityIndicator,
} from "react-native";

import { Divider, Button, Block, Text } from "../components";
import { theme, mocks } from "../constants";
import { FirebaseContext } from "../components/Firebase";
import { AuthUserContext } from "../components/Session";

function Settings(props) {
  const firebaseContext = useContext(FirebaseContext);
  const authUserContext = useContext(AuthUserContext);

  const [editing, setEditing] = useState(null);
  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(false);
  const { navigation } = props;

  useEffect(() => {
    const getUser = async () => {
      const snapshot = await firebaseContext
        .refDoctors()
        .child(authUserContext.uid)
        .once("value");
      setProfile(snapshot.val());
    };

    getUser();
  }, []);

  const handleEdit = (name, text) => {
    const newProfile = { ...profile };
    newProfile[name] = text;
    setProfile({ ...newProfile });
  };

  const toggleEdit = (name) => {
    const newProfile = { ...profile };
    const _editVal = !editing ? name : null;
    if (!_editVal) {
      firebaseContext
        .refDoctors()
        .child(authUserContext.uid)
        .update({
          ...newProfile,
        });
    }
    setEditing(_editVal);
  };

  const renderEdit = (name) => {
    if (editing === name) {
      return (
        <TextInput
          defaultValue={profile[name]}
          onChangeText={(text) => handleEdit([name], text)}
        />
      );
    }

    return <Text bold>{profile[name]}</Text>;
  };

  const handleLogout = () => {
    setLoading(true);
    firebaseContext.doSignOut();
  };

  return (
    <Block>
      <Block flex={false} row center space="between" style={styles.header}>
        <Text h1 bold>
          Settings
        </Text>
        <Button>
          <Image
            source={require("../assets/images/profile.png")}
            style={styles.avatar}
          />
        </Button>
      </Block>

      <ScrollView showsVerticalScrollIndicator={false}>
        <Block style={styles.inputs}>
          <Block row space="between" margin={[10, 0]} style={styles.inputRow}>
            <Block>
              <Text gray2 style={{ marginBottom: 10 }}>
                Nama
              </Text>
              {renderEdit("name")}
            </Block>
            <Text medium secondary onPress={() => toggleEdit("name")}>
              {editing === "name" ? "Save" : "Edit"}
            </Text>
          </Block>
          <Block row space="between" margin={[10, 0]} style={styles.inputRow}>
            <Block>
              <Text gray2 style={{ marginBottom: 10 }}>
                No Hp
              </Text>
              {renderEdit("phone")}
            </Block>
            <Text medium secondary onPress={() => toggleEdit("phone")}>
              {editing === "phone" ? "Save" : "Edit"}
            </Text>
          </Block>
          <Block row space="between" margin={[10, 0]} style={styles.inputRow}>
            <Block>
              <Text gray2 style={{ marginBottom: 10 }}>
                E-mail
              </Text>
              <Text bold>{profile.email}</Text>
            </Block>
          </Block>
        </Block>

        <Divider margin={[theme.sizes.base, theme.sizes.base * 2]} />

        <Block style={styles.toggles}>
          {/* <Block
            row
            center
            space="between"
            style={{ marginBottom: theme.sizes.base * 2 }}
          >
            <Text gray2>Notifications</Text>
            <Switch
              value={state.notifications}
              onValueChange={(value) => setState({ notifications: value })}
            />
          </Block> */}
          <Block>
            <Button shadow onPress={() => handleLogout()}>
              {loading ? (
                <ActivityIndicator size="small" color={theme.colors.primary} />
              ) : (
                <Text center semibold>
                  Logout
                </Text>
              )}
            </Button>
          </Block>
        </Block>
      </ScrollView>
    </Block>
  );
}

// class Settings extends Component {
//   state = {
//     notifications: true,
//     editing: null,
//     profile: {},
//   };

//   componentDidMount() {
//     this.setState({ profile: this.props.profile });
//   }

//   handleEdit(name, text) {
//     const { profile } = this.state;
//     profile[name] = text;

//     this.setState({ profile });
//   }

//   toggleEdit(name) {
//     const { editing } = this.state;
//     this.setState({ editing: !editing ? name : null });
//   }

//   renderEdit(name) {
//     const { profile, editing } = this.state;

//     if (editing === name) {
//       return (
//         <TextInput
//           defaultValue={profile[name]}
//           onChangeText={(text) => this.handleEdit([name], text)}
//         />
//       );
//     }

//     return <Text bold>{profile[name]}</Text>;
//   }

//   render() {
//     const { profile, editing } = this.state;
//     const { navigation } = this.props;

//     return (
//       <Block>
//         <Block flex={false} row center space="between" style={styles.header}>
//           <Text h1 bold>
//             Settings
//           </Text>
//           <Button>
//             <Image
//               source={require("../assets/images/profile.png")}
//               style={styles.avatar}
//             />
//           </Button>
//         </Block>

//         <ScrollView showsVerticalScrollIndicator={false}>
//           <Block style={styles.inputs}>
//             <Block row space="between" margin={[10, 0]} style={styles.inputRow}>
//               <Block>
//                 <Text gray2 style={{ marginBottom: 10 }}>
//                   Username
//                 </Text>
//                 {this.renderEdit("username")}
//               </Block>
//               <Text
//                 medium
//                 secondary
//                 onPress={() => this.toggleEdit("username")}
//               >
//                 {editing === "username" ? "Save" : "Edit"}
//               </Text>
//             </Block>
//             <Block row space="between" margin={[10, 0]} style={styles.inputRow}>
//               <Block>
//                 <Text gray2 style={{ marginBottom: 10 }}>
//                   No Hp
//                 </Text>
//                 {this.renderEdit("phone")}
//               </Block>
//               <Text medium secondary onPress={() => this.toggleEdit("phone")}>
//                 {editing === "phone" ? "Save" : "Edit"}
//               </Text>
//             </Block>
//             <Block row space="between" margin={[10, 0]} style={styles.inputRow}>
//               <Block>
//                 <Text gray2 style={{ marginBottom: 10 }}>
//                   E-mail
//                 </Text>
//                 <Text bold>{profile.email}</Text>
//               </Block>
//             </Block>
//           </Block>

//           <Divider margin={[theme.sizes.base, theme.sizes.base * 2]} />

//           <Block style={styles.toggles}>
//             <Block
//               row
//               center
//               space="between"
//               style={{ marginBottom: theme.sizes.base * 2 }}
//             >
//               <Text gray2>Notifications</Text>
//               <Switch
//                 value={this.state.notifications}
//                 onValueChange={(value) =>
//                   this.setState({ notifications: value })
//                 }
//               />
//             </Block>
//             <Block>
//               <Button shadow onPress={() => navigation.navigate("Welcome")}>
//                 <Text center semibold>
//                   Logout
//                 </Text>
//               </Button>
//             </Block>
//           </Block>
//         </ScrollView>
//       </Block>
//     );
//   }
// }

Settings.defaultProps = {
  profile: mocks.profile,
};

export default Settings;

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: theme.sizes.base * 2,
  },
  avatar: {
    height: theme.sizes.base * 2.2,
    width: theme.sizes.base * 2.2,
  },
  inputs: {
    marginTop: theme.sizes.base * 0.7,
    paddingHorizontal: theme.sizes.base * 2,
  },
  inputRow: {
    alignItems: "flex-end",
  },
  toggles: {
    paddingHorizontal: theme.sizes.base * 2,
  },
});
