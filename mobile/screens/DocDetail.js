import React, { Component } from "react";
import {
  Dimensions,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";

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
import { trim } from "../lib/trim";

const { width } = Dimensions.get("window");

class DocDetail extends Component {
  state = {
    document: {},
    errors: [],
    inputReply: "",
    isEditing: false,
  };

  componentDidMount() {
    this.setState({ document: this.props.navigation.state.params.document });
  }

  renderForm() {
    const { errors } = this.state;
    const { navigation } = this.props;
    const hasErrors = (key) => (errors.includes(key) ? styles.hasErrors : null);

    return (
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
              defaultValue={this.state.inputReply}
              onChangeText={(text) => this.setState({ inputReply: text })}
            />
          </Block>
          <Block middle flex={0.5} right margin={[0, theme.sizes.padding * 2]}>
            <Button gradient onPress={() => navigation.navigate("Login")}>
              <Text center semibold white>
                Simpan
              </Text>
            </Button>
            <Button shadow onPress={() => this.setState({ isEditing: false })}>
              <Text center semibold>
                Batal
              </Text>
            </Button>
          </Block>
        </Block>
      </Block>
    );
  }

  renderEmptyReply() {
    const { document } = this.state;
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
          onPress={() => this.setState({ isEditing: true })}
        >
          <Text center semibold white>
            Beri Tanggapan
          </Text>
        </Button>
      </Block>
    );
  }

  renderReply() {
    const { document } = this.state;
    return (
      <Block padding={[0, theme.sizes.base * 2]}>
        <Text h3 primary style={styles.textTanggapan}>
          Tanggapan:
        </Text>
        <Text body>{document.reply}</Text>
        <Divider />
        <Button shadow onPress={() => this.setState({ isEditing: true })}>
          <Text center semibold>
            Ubah Tanggapan
          </Text>
        </Button>
      </Block>
    );
  }

  render() {
    const { profile, navigation } = this.props;
    const { document, isEditing } = this.state;

    return (
      <Block>
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{ paddingBottom: theme.sizes.base * 2 }}
        >
          <Block flex={false} row space="between" style={styles.documents}>
            <TouchableOpacity
              key={document.name}
              style={{ marginBottom: theme.sizes.padding }}
              onPress={() => Alert.alert("tes")}
            >
              <Card center middle row shadow style={styles.document}>
                <Block row center>
                  <Badge size={35} color={theme.colors.tertiary}>
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
                    {trim(document.name)}
                  </Text>
                </Block>
                <Text gray caption>
                  {document.count} products
                </Text>
              </Card>
            </TouchableOpacity>
          </Block>
          {document.reply === "" && !isEditing
            ? this.renderEmptyReply()
            : isEditing
            ? this.renderForm()
            : this.renderReply()}
        </ScrollView>
      </Block>
    );
  }
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
