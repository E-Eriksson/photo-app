import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  Button,
  Platform,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";

const numColumns = 2;
const screenWidth = Dimensions.get("window").width;
const totalSpacing = 10 * (numColumns + 1);
const itemWidth = (screenWidth - totalSpacing) / numColumns;

const PhotosScreen = ({ navigation }) => {
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    (async () => {
      if (Platform.OS !== "web") {
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          Alert.alert(
            "Permission Denied",
            "Sorry, we need camera roll permissions to make this work!"
          );
        }
      }
    })();
  }, []);

  const pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        quality: 1,
        exif: true,
      });

      if (!result.canceled && result.assets) {
        const newPhotos = result.assets.map((asset) => ({
          id: asset.uri,
          uri: asset.uri,
          metadata: asset.exif || {},
          width: asset.width,
          height: asset.height,
        }));
        setPhotos((prevPhotos) => [...prevPhotos, ...newPhotos]);
      }
    } catch (error) {
      console.error("Error picking image: ", error);
      Alert.alert("Error", "Could not load images from library.");
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[
        stylesPhotos.itemContainer,
        { width: itemWidth, height: itemWidth },
      ]}
      onPress={() => navigation.navigate("FullScreenPhoto", { photo: item })}
      activeOpacity={0.7}
    >
      <Image source={{ uri: item.uri }} style={stylesPhotos.imageThumbnail} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={stylesPhotos.safeArea}>
      <View style={stylesPhotos.container}>
        <View style={stylesPhotos.headerContainer}>
          <Text style={stylesPhotos.header}>Gallery</Text>
          <Button title="Add Photos" onPress={pickImage} color="#007AFF" />
        </View>
        {photos.length === 0 ? (
          <View style={stylesPhotos.emptyContainer}>
            <Text style={stylesPhotos.emptyText}>Your gallery is empty.</Text>
            <Text style={stylesPhotos.emptySubText}>
              Tap "Add Photos" to select images from your library.
            </Text>
          </View>
        ) : (
          <FlatList
            data={photos}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            numColumns={numColumns}
            contentContainerStyle={stylesPhotos.listContent}
            columnWrapperStyle={stylesPhotos.row}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const stylesPhotos = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  container: {
    flex: 1,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#343a40",
  },
  listContent: {
    paddingHorizontal: 5,
  },
  row: {
    justifyContent: "flex-start",
    marginBottom: 10,
  },
  itemContainer: {
    marginHorizontal: 5,
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#e9ecef",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  imageThumbnail: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    color: "#6c757d",
    marginBottom: 10,
    textAlign: "center",
  },
  emptySubText: {
    fontSize: 14,
    color: "#adb5bd",
    textAlign: "center",
  },
});

export default PhotosScreen;
