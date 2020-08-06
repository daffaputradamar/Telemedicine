import React, { Component, useState, useEffect, useContext } from "react";
import {
  Dimensions,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Keyboard,
  KeyboardAvoidingView,
} from "react-native";
import * as FileSystem from "expo-file-system";
import {
  Card,
  Badge,
  Button,
  Block,
  Text,
  Divider,
  Input,
} from "../components";
import { theme, mocks } from "../constants";
import { timeConverter } from "../lib/timeConverter";
import { FirebaseContext } from "../components/Firebase";
import { AuthUserContext } from "../components/Session";
import SplashScreen from "./SplashScreen";

const { width } = Dimensions.get("window");

function DocDetail(props) {
  const firebaseContext = useContext(FirebaseContext);
  const authUserContext = useContext(AuthUserContext);
  const docId = props.navigation.state.params.docid;

  const [document, setDocument] = useState(null);
  const [loadingDocument, setLoadingDocument] = useState(true);

  const [reply, setReply] = useState(null);
  const [loading, setLoading] = useState(true);

  const [downloading, setDownloading] = useState(false);
  // const [renderingPDF, setRenderingPDF] = useState(false)

  const [input, setInput] = useState({
    errors: [],
    inputReply: "",
    isEditing: false,
  });

  const saveReply = async () => {
    Keyboard.dismiss();
    await firebaseContext.doUpdateReply(
      authUserContext.uid,
      docId,
      input.inputReply,
      reply.isReplied,
      authUserContext.counter
    );
    setInput({ ...input, isEditing: false });
  };

  useEffect(() => {
    let docDetailListener;
    setLoading(true);
    setLoadingDocument(true);

    const getDocDetail = async () => {
      const snapshot = await firebaseContext
        .refDocs()
        .child(docId)
        .once("value");
      const val = snapshot.val();
      setDocument(val);
      setLoadingDocument(false);
    };

    const getReply = () => {
      docDetailListener = firebaseContext
        .refUserToDocs(authUserContext.uid)
        .child(docId)
        .on("value", (snapshot) => {
          const val = snapshot.val();
          setReply(val);
          setInput({ ...input, inputReply: val.reply });
          setLoading(false);
        });
    };

    getDocDetail();
    getReply();

    return function cleanup() {
      firebaseContext
        .refUserToDocs(authUserContext.uid)
        .child(docId)
        .off("value", docDetailListener);
    };
  }, []);

  const downloadFile = async (url, filename) => {
    try {
      const folderInfo = await FileSystem.getInfoAsync(
        FileSystem.documentDirectory + "telemedicine"
      );

      let folder;
      if (!folderInfo.exists) {
        folder = FileSystem.documentDirectory + "telemedicine";
        await FileSystem.makeDirectoryAsync(folder, {
          intermediates: true,
        });
      }

      const fileInfo = await FileSystem.getInfoAsync(
        FileSystem.documentDirectory + "telemedicine/" + filename
      );

      if (fileInfo.exists) {
        return props.navigation.navigate("PDFView", {
          uri: fileInfo.uri,
        });
      } else {
        setDownloading(true);
        const downloadResumable = FileSystem.createDownloadResumable(
          url,
          `${FileSystem.documentDirectory}telemedicine/${filename}`,
          {}
        );
        const { uri } = await downloadResumable.downloadAsync();
        setDownloading(false);
        props.navigation.navigate("PDFView", {
          uri,
        });
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (loadingDocument || loading) {
    return <SplashScreen />;
  }

  const renderForm = () => {
    const { errors } = input;
    const hasErrors = (key) => (errors.includes(key) ? styles.hasErrors : null);

    return (
      <KeyboardAvoidingView
        style={{ flex: 1, justifyContent: "center" }}
        behavior="height"
      >
        <Block padding={[0, theme.sizes.base * 2]}>
          <Block>
            <Block middle>
              <Input
                autoFocus
                label="Tanggapan"
                error={hasErrors("inputReply")}
                multiline
                numberOfLines={5}
                style={[styles.input, hasErrors("inputReply")]}
                underlineColorAndroid="transparent"
                defaultValue={input.inputReply}
                onChangeText={(text) =>
                  setInput({ ...input, inputReply: text })
                }
              />
            </Block>
            <Block
              middle
              flex={0.5}
              right
              margin={[0, theme.sizes.padding * 2]}
            >
              <Button gradient onPress={() => saveReply()}>
                <Text center semibold white>
                  Simpan
                </Text>
              </Button>
              <Button
                shadow
                onPress={() => setInput({ ...input, isEditing: false })}
              >
                <Text center semibold>
                  Batal
                </Text>
              </Button>
            </Block>
          </Block>
        </Block>
      </KeyboardAvoidingView>
    );
  };

  const renderEmptyReply = () => {
    return (
      <Block padding={[0, theme.sizes.base * 2]}>
        <Text h3 primary style={styles.textTanggapan}>
          Tanggapan:
        </Text>
        <Text body center>
          Belum ada Tanggapan
        </Text>
        <Divider />
        <Button
          gradient
          shadow
          onPress={() => setInput({ ...input, isEditing: true })}
        >
          <Text center semibold white>
            Beri Tanggapan
          </Text>
        </Button>
      </Block>
    );
  };

  const renderReply = () => {
    return (
      <Block padding={[0, theme.sizes.base * 2]}>
        <Text h3 primary style={styles.textTanggapan}>
          Tanggapan:
        </Text>
        <Text body>{reply.reply}</Text>
        <Divider />
        <Button shadow onPress={() => setInput({ ...input, isEditing: true })}>
          <Text center semibold>
            Ubah Tanggapan
          </Text>
        </Button>
      </Block>
    );
  };

  return (
    <Block>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ paddingBottom: theme.sizes.base * 2 }}
      >
        <Block flex={false} row space="between" style={styles.documents}>
          <TouchableOpacity
            style={{ marginBottom: theme.sizes.padding }}
            onPress={() => downloadFile(document.url, document.filename)}
          >
            <Card row shadow style={styles.document}>
              <Badge size={35} color={theme.colors.tertiary}>
                <Image
                  source={require("../assets/icons/doc.png")}
                  style={styles.docIcon}
                />
              </Badge>
              <Block>
                <Text
                  medium
                  height={20}
                  style={{
                    marginLeft: theme.sizes.base,
                    marginBottom: theme.sizes.base * 0.5,
                  }}
                >
                  {document.filename}
                </Text>
                <Text gray caption style={{ marginLeft: theme.sizes.base }}>
                  {timeConverter(document.timestamp)}
                </Text>
              </Block>
            </Card>
            {downloading && (
              <Text center gray>
                Downloading...
              </Text>
            )}
          </TouchableOpacity>
        </Block>
        {reply.isReplied === false && !input.isEditing
          ? renderEmptyReply()
          : input.isEditing
          ? renderForm()
          : renderReply()}
      </ScrollView>
    </Block>
  );
}

DocDetail.defaultProps = {
  profile: mocks.profile,
  documents: mocks.documents,
};

export default DocDetail;

const styles = StyleSheet.create({
  documents: {
    flexWrap: "wrap",
    paddingHorizontal: theme.sizes.base * 2,
  },
  document: {
    // this should be dynamic based on screen width
    minWidth: width - theme.sizes.padding * 2.4 - theme.sizes.base,
    maxWidth: width - theme.sizes.padding * 2.4 - theme.sizes.base,
    maxHeight: width - theme.sizes.padding * 2.4 - theme.sizes.base,
  },
  docIcon: {
    width: 40,
    height: 40,
  },
  input: {
    borderRadius: 0,
    borderWidth: 0,
    borderBottomColor: theme.colors.gray2,
    borderBottomWidth: StyleSheet.hairlineWidth,
    height: 100,
    justifyContent: "flex-start",
  },
  textTanggapan: {
    marginBottom: theme.sizes.padding,
  },
});
