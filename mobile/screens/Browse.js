import React, { Component, useState, useEffect, useContext } from "react";
import {
  Dimensions,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ToastAndroid,
} from "react-native";

import { Card, Badge, Button, Block, Text } from "../components";
import { theme, mocks } from "../constants";
import { trim } from "../lib/trim";
import { timeConverter } from "../lib/timeConverter";
import { FirebaseContext } from "../components/Firebase";
import { AuthUserContext } from "../components/Session";
import SplashScreen from "./SplashScreen";

const { width } = Dimensions.get("window");

function Browse({ navigation, documentsMock }) {
  const firebaseContext = useContext(FirebaseContext);
  const authUserContext = useContext(AuthUserContext);

  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let userToDocsListener;
    setLoading(true);

    const fetchDocsByDoctor = () => {
      userToDocsListener = firebaseContext
        .refUserToDocs(authUserContext.uid)
        .on("value", (snapshot) => {
          const val = snapshot.val();
          if (val) {
            let docids = Object.keys(val);
            Promise.all(
              docids.map(async (id) => {
                const valDoc = (
                  await firebaseContext.refDocs().child(id).once("value")
                ).val();
                return { docid: id, ...valDoc };
              })
            ).then((result) => {
              const _docs = result.map((res) => {
                return {
                  ...res,
                  reply: val[res.docid],
                };
              });
              setDocuments(_docs.reverse());
              setLoading(false);
            });
          }
        });
    };

    fetchDocsByDoctor();

    return function cleanup() {
      firebaseContext
        .refUserToDocs(authUserContext.uid)
        .off("value", userToDocsListener);
    };
  }, []);

  if (loading) {
    return <SplashScreen />;
  }

  return (
    <Block>
      <Block flex={false} row center space="between" style={styles.header}>
        <Text h1 bold>
          Browse
        </Text>
        <Button onPress={() => navigation.navigate("Settings")}>
          <Image
            source={require("../assets/images/profile.png")}
            style={styles.avatar}
          />
        </Button>
      </Block>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ paddingVertical: theme.sizes.base * 2 }}
      >
        <Block flex={false} row space="between" style={styles.documents}>
          {documents.map((document) => (
            <TouchableOpacity
              key={document.docid}
              onPress={() =>
                navigation.navigate("DocDetail", { docid: document.docid })
              }
            >
              <Card center middle row shadow style={styles.document}>
                <Block row center>
                  <Badge size={25} color={theme.colors.tertiary}>
                    <Image
                      source={require("../assets/icons/doc.png")}
                      style={styles.docIcon}
                    />
                  </Badge>
                  <Text
                    medium
                    height={20}
                    style={{ marginLeft: theme.sizes.base }}
                  >
                    {trim(document.filename)}
                  </Text>
                </Block>
                <Text gray caption>
                  {timeConverter(document.timestamp)}
                </Text>
              </Card>
            </TouchableOpacity>
          ))}
        </Block>
      </ScrollView>
    </Block>
  );
}

// class Browse extends Component {
//   state = {
//     active: "Products",
//     documents: [],
//   };

//   componentDidMount() {
//     this.setState({ documents: this.props.documents });
//   }

//   render() {
//     const { navigation } = this.props;
//     const { documents } = this.state;

//     return (
//       <Block>
//         <Block flex={false} row center space="between" style={styles.header}>
//           <Text h1 bold>
//             Browse
//           </Text>
//           <Button onPress={() => navigation.navigate("Settings")}>
//             <Image
//               source={require("../assets/images/profile.png")}
//               style={styles.avatar}
//             />
//           </Button>
//         </Block>
//         <ScrollView
//           showsVerticalScrollIndicator={false}
//           style={{ paddingVertical: theme.sizes.base * 2 }}
//         >
//           <Block flex={false} row space="between" style={styles.documents}>
//             {documents.map((document) => (
//               <TouchableOpacity
//                 key={document.name}
//                 onPress={() => navigation.navigate("DocDetail", { document })}
//               >
//                 <Card center middle row shadow style={styles.document}>
//                   <Block row center>
//                     <Badge size={25} color={theme.colors.tertiary}>
//                       <Image
//                         source={require("../assets/icons/doc.png")}
//                         style={styles.docIcon}
//                       />
//                     </Badge>
//                     <Text
//                       medium
//                       height={20}
//                       style={{ marginLeft: theme.sizes.base }}
//                     >
//                       {trim(document.name)}
//                     </Text>
//                   </Block>
//                   <Text gray caption>
//                     {document.count} products
//                   </Text>
//                 </Card>
//               </TouchableOpacity>
//             ))}
//           </Block>
//         </ScrollView>
//       </Block>
//     );
//   }
// }

Browse.defaultProps = {
  profile: mocks.profile,
  documentsMock: mocks.documents,
};

export default Browse;

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: theme.sizes.base * 2,
  },
  avatar: {
    height: theme.sizes.base * 2.2,
    width: theme.sizes.base * 2.2,
  },
  docIcon: {
    width: 30,
    height: 30,
  },
  documents: {
    flexWrap: "wrap",
    paddingHorizontal: theme.sizes.base * 2,
    marginBottom: theme.sizes.base * 3.5,
  },
  document: {
    // this should be dynamic based on screen width
    minWidth: width - theme.sizes.padding * 2.4 - theme.sizes.base,
    maxWidth: width - theme.sizes.padding * 2.4 - theme.sizes.base,
    maxHeight: width - theme.sizes.padding * 2.4 - theme.sizes.base,
  },
});
