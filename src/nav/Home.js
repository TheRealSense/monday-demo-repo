/* eslint-disable react/no-unused-state */
/* eslint-disable react/jsx-no-bind */
import React from "react";
import {
    View,
    Text,
    StyleSheet,
    Animated,
    Dimensions,
    Platform,
    Linking,
    Image,
    TouchableOpacity
} from "react-native";
//import { RNS3 } from "react-native-aws3";
import { connect } from "react-redux";
import { Auth } from "aws-amplify";
import NfcManager, { Ndef } from "react-native-nfc-manager";
import { logOut } from "../actions";
import { colors, fonts } from "../theme";
import imagePicker from "react-native-image-picker";
import Config from "../aws-exports";

const { width } = Dimensions.get("window");

class Home extends React.Component {
    static navigationOptions = {
        header: null
    };
    state = {
        uri:
            "https://www.sparklabs.com/forum/styles/comboot/theme/images/default_avatar.jpg"
    };

    AnimatedScale = new Animated.Value(1);

    componentDidMount() {
        this.animate();
        if (Platform.OS === "android") {
            Linking.getInitialURL().then(url => {
                this.navigate(url);
            });
        } else {
            Linking.addEventListener("url", this.handleOpenURL);
        }
        NfcManager.start({
            onSessionClosedIOS: () => {}
        })
            .then(() => {})
            .catch(() => {
                this.setState({ supported: false });
            });
        NfcManager.getLaunchTagEvent()
            .then(tag => {
                const uri = this.parseUri(tag);
                if (uri) {
                    this.navigate(uri);
                }
            })
            .catch(() => {});
    }

    componentWillUnmount() {
        Linking.removeEventListener("url", this.handleOpenURL);
    }

    handleOpenURL = event => {
        this.navigate(event.url);
    };

    parseUri = tag => {
        if (
            Ndef.isType(tag.ndefMessage[0], Ndef.TNF_WELL_KNOWN, Ndef.RTD_URI)
        ) {
            return Ndef.uri.decodePayload(tag.ndefMessage[0].payload);
        }
        return null;
    };

    navigate = url => {
        // eslint-disable-next-line react/prop-types
        let { navigation } = this.props;

        const route = url.replace(/.*?:\/\//g, "");
        // eslint-disable-next-line no-useless-escape
        const id = route.match(/\/([^\/]+)\/?$/)[1];
        const routeName = route.split("/")[0];

        if (routeName === "tools") {
            navigation.navigate("Tools", { id, name: "printer" });
        }
    };

    logout() {
        // eslint-disable-next-line react/prop-types
        const { dispatchLogout } = this.props;

        Auth.signOut().then(() => {
            dispatchLogout();
        });
    }

    animate() {
        Animated.timing(this.AnimatedScale, {
            toValue: 0.8,
            duration: 1250,
            useNativeDriver: true
        }).start(() => {
            Animated.timing(this.AnimatedScale, {
                toValue: 1,
                duration: 1250,
                useNativeDriver: true
            }).start(() => this.animate());
        });
    }

    takePic() {
        imagePicker.showImagePicker({}, res => {
            console.warn(res);
            const file = {
                uri: res.uri,
                name: "avatar",
                type: "image/jpeg"
            };
            //const uri = RNS3.put(file, config)
            const config = {
                keyPrefix: "s3/",
                bucket: Config.aws_user_files_s3_bucket,
                region: Config.aws_user_files_s3_bucket_region,
                accessKey: "AKIAI2JQEUCOC4NOYAMQ",
                secretKey: "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",
                successAcctionStatus: 201
            };
            // RNS3.put(file, config).then(res => {
            //     console.warn(res);
            // });
            // RNS3.put(file, config).then(res => {
            //     console.warn(res);
            // });

            this.setState({ uri: res.uri });
        });

        // console.warn('uri value' + uri)
        // this.setState({ uri: uri.body.postResponse.location })
        // console.warn(this.state)
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.homeContainer}>
                    <Text style={styles.welcome}>Welcome</Text>
                    // <TouchableOpacity onPress={this.takePic.bind(this)}>
                    //     <Image
                    //         style={{
                    //             paddingVertical: 5,
                    //             width: 150,
                    //             height: 150,
                    //             borderRadius: 75
                    //         }}
                    //         resizeMode="cover"
                    //         source={{
                    //             uri: this.state.uri
                    //         }}
                    //     />
                    // </TouchableOpacity>
                    <Animated.Image
                        source={require("../assets/boomboxcropped.png")}
                        style={{
                            tintColor: colors.primary,
                            width: width / 2,
                            height: width / 2,
                            transform: [{ scale: this.AnimatedScale }]
                        }}
                        resizeMode="contain"
                    />
                    <Text
                        onPress={this.logout.bind(this)}
                        style={styles.welcome}
                    >
                        Logout
                    </Text>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "white",
        alignItems: "center",
        justifyContent: "center",
        flex: 1
    },
    homeContainer: {
        alignItems: "center"
    },
    welcome: {
        fontFamily: fonts.light,
        color: "rgba(0, 0, 0, .85)",
        marginBottom: 26,
        fontSize: 22,
        textAlign: "center"
    },
    registration: {
        fontFamily: fonts.base,
        color: "rgba(0, 0, 0, .5)",
        marginTop: 20,
        fontSize: 16,
        paddingHorizontal: 20,
        textAlign: "center"
    }
});

const mapStateToProps = state => ({
    auth: state.auth
});

const mapDispatchToProps = {
    dispatchLogout: () => logOut()
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Home);
