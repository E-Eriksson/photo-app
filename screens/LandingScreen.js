import {
  View,
  Text,
  StyleSheet,
  Button,
  ImageBackground,
  SafeAreaView,
} from "react-native";

const LandingScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={stylesLanding.safeArea}>
      <View style={stylesLanding.container}>
        <Text style={stylesLanding.title}>Photo Inspector</Text>
        <Text style={stylesLanding.subtitle}>Discover hidden data!</Text>
        <View style={stylesLanding.buttonContainer}>
          <Button
            title="Explore Gallery"
            onPress={() => navigation.navigate("Photos")}
            color="#3498db"
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const stylesLanding = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#ffffff",
    textAlign: "center",
    marginBottom: 15,
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  subtitle: {
    fontSize: 18,
    color: "#ecf0f1",
    textAlign: "center",
    marginBottom: 40,
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 5,
  },
  buttonContainer: {
    borderRadius: 8,
    overflow: "hidden",
    elevation: 3,
    backgroundColor: "#3498db",
  },
});

export default LandingScreen;
