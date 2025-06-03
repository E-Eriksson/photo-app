import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  Animated,
  PanResponder,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  StatusBar,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");
const METADATA_PANEL_WIDTH = screenWidth * 0.75;

const FullScreenPhotoScreen = ({ route, navigation }) => {
  const { photo } = route.params;

  const [metadataActuallyVisible, setMetadataActuallyVisible] = useState(false);
  const pan = useRef(
    new Animated.ValueXY({ x: -METADATA_PANEL_WIDTH, y: 0 })
  ).current;

  useEffect(() => {
    StatusBar.setHidden(true, "slide");
    return () => {
      StatusBar.setHidden(false, "slide");
    };
  }, []);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) =>
        Math.abs(gestureState.dx) > Math.abs(gestureState.dy) &&
        Math.abs(gestureState.dx) > 5,
      onPanResponderGrant: () => {
        pan.setOffset({ x: pan.x._value, y: 0 });
        pan.setValue({ x: 0, y: 0 });
      },
      onPanResponderMove: (evt, gestureState) => {
        let newX = gestureState.dx;
        if (!metadataActuallyVisible && newX < 0) newX = 0;
        if (metadataActuallyVisible && newX > 0) newX = 0;
        const combinedX = pan.x._offset + newX;
        const clampedX = Math.min(
          0,
          Math.max(-METADATA_PANEL_WIDTH, combinedX)
        );
        pan.setValue({ x: clampedX - pan.x._offset, y: 0 });
      },
      onPanResponderRelease: (evt, gestureState) => {
        pan.flattenOffset();
        const currentX = pan.x._value;
        if (gestureState.vx > 0.3 && gestureState.dx > 0) openPanel();
        else if (gestureState.vx < -0.3 && gestureState.dx < 0) closePanel();
        else if (currentX > -METADATA_PANEL_WIDTH / 2) openPanel();
        else closePanel();
      },
    })
  ).current;

  const openPanel = () => {
    Animated.spring(pan, {
      toValue: { x: 0, y: 0 },
      useNativeDriver: true,
      friction: 7,
      tension: 40,
    }).start(() => setMetadataActuallyVisible(true));
  };

  const closePanel = () => {
    Animated.spring(pan, {
      toValue: { x: -METADATA_PANEL_WIDTH, y: 0 },
      useNativeDriver: true,
      friction: 7,
      tension: 40,
    }).start(() => setMetadataActuallyVisible(false));
  };

  // Helper to format EXIF data
  const formatExifValue = (key, value) => {
    if (value === undefined || value === null) return "N/A";
    if (typeof value === "object") return JSON.stringify(value);

    // Specific formatting for known keys
    if (key === "FNumber") return `f/${value}`; // Aperture
    if (key === "ExposureTime" && typeof value === "number") {
      // Shutter Speed
      if (value < 1) return `1/${Math.round(1 / value)}s`;
      return `${value}s`;
    }
    if (key === "ISOSpeedRatings" && Array.isArray(value))
      return value.join(", ");
    if (key === "FocalLengthIn35mmFilm") return `${value}mm (35mm equiv.)`;
    if (key === "FocalLength") return `${value}mm`;

    return String(value);
  };

  const exif = photo.metadata || {};

  if (!photo || !photo.uri) {
    return (
      <SafeAreaView style={stylesFull.safeAreaError}>
        <View style={stylesFull.container}>
          <Text style={stylesFull.errorText}>Photo data is missing.</Text>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={stylesFull.backButtonFixed}
          >
            <Ionicons name="arrow-back" size={28} color="white" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View style={stylesFull.container}>
      <Animated.View
        style={StyleSheet.absoluteFill}
        {...panResponder.panHandlers}
      >
        <Image
          source={{ uri: photo.uri }}
          style={stylesFull.fullImage}
          resizeMode="contain"
        />
      </Animated.View>

      <Animated.View
        style={[
          stylesFull.metadataPanel,
          { transform: [{ translateX: pan.x }] },
        ]}
      >
        <ScrollView
          style={stylesFull.metadataScrollView}
          contentContainerStyle={stylesFull.metadataContent}
        >
          <Text style={stylesFull.metadataTitle}>Details</Text>

          <Text style={stylesFull.metadataText}>
            Camera Make: {formatExifValue("Make", exif.Make || exif.TIFF?.Make)}
          </Text>
          <Text style={stylesFull.metadataText}>
            Camera Model:{" "}
            {formatExifValue("Model", exif.Model || exif.TIFF?.Model)}
          </Text>
          <Text style={stylesFull.metadataText}>
            Lens Model:{" "}
            {formatExifValue(
              "LensModel",
              exif.LensModel || exif.Exif?.LensModel
            )}
          </Text>
          <Text style={stylesFull.metadataText}>
            Aperture:{" "}
            {formatExifValue("FNumber", exif.FNumber || exif.Exif?.FNumber)}
          </Text>
          <Text style={stylesFull.metadataText}>
            Shutter Speed:{" "}
            {formatExifValue(
              "ExposureTime",
              exif.ExposureTime || exif.Exif?.ExposureTime
            )}
          </Text>
          <Text style={stylesFull.metadataText}>
            ISO:{" "}
            {formatExifValue(
              "ISOSpeedRatings",
              exif.ISOSpeedRatings || exif.Exif?.ISOSpeedRatings
            )}
          </Text>
          <Text style={stylesFull.metadataText}>
            Focal Length:{" "}
            {formatExifValue(
              "FocalLength",
              exif.FocalLength || exif.Exif?.FocalLength
            )}
          </Text>
          <Text style={stylesFull.metadataText}>
            Date Taken:{" "}
            {formatExifValue(
              "DateTimeOriginal",
              exif.DateTimeOriginal || exif.Exif?.DateTimeOriginal
            )}
          </Text>
          <Text style={stylesFull.metadataText}>
            Dimensions:{" "}
            {photo.width && photo.height
              ? `${photo.width} x ${photo.height}`
              : "N/A"}
          </Text>

          {/* You can add more EXIF fields here if needed */}
          {/* For a more comprehensive list, you might want to iterate over Object.keys(exif) but that could be very long */}
        </ScrollView>
        <View style={stylesFull.dragHandleContainer}>
          <View style={stylesFull.dragHandle} />
        </View>
      </Animated.View>

      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={[
          stylesFull.backButtonFixed,
          { top: Platform.OS === "ios" ? 50 : 20 },
        ]}
      >
        <Ionicons
          name="close"
          size={30}
          color="white"
          style={stylesFull.backButtonIcon}
        />
      </TouchableOpacity>
    </View>
  );
};

const stylesFull = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  safeAreaError: {
    flex: 1,
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "white",
    fontSize: 18,
  },
  fullImage: {
    width: screenWidth,
    height: screenHeight,
  },
  metadataPanel: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: METADATA_PANEL_WIDTH,
    backgroundColor: "rgba(20, 20, 20, 0.92)",
    zIndex: 10,
    flexDirection: "row",
    borderTopRightRadius: 15,
    borderBottomRightRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 10,
  },
  metadataScrollView: {
    flex: 1,
  },
  metadataContent: {
    paddingTop: (Platform.OS === "ios" ? 50 : 20) + 20,
    paddingBottom: 20,
    paddingLeft: 20,
    paddingRight: 10,
  },
  dragHandleContainer: {
    width: 30,
    justifyContent: "center",
    alignItems: "center",
    paddingLeft: 5,
  },
  dragHandle: {
    width: 6,
    height: 60,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 3,
  },
  metadataTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 25,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.2)",
  },
  metadataText: {
    fontSize: 15,
    color: "#FFFFFF",
    marginBottom: 10,
    lineHeight: 22,
  },
  backButtonFixed: {
    position: "absolute",
    right: 20,
    zIndex: 20,
    padding: 8,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
});

export default FullScreenPhotoScreen;
