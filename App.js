import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { Ionicons } from "@expo/vector-icons";

import LandingScreen from "./screens/LandingScreen";
import PhotosScreen from "./screens/PhotosScreen";
import FullScreenPhotoScreen from "./screens/FullScreenPhotoScreen";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function PhotosStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="PhotosList" component={PhotosScreen} />
      <Stack.Screen name="FullScreenPhoto" component={FullScreenPhotoScreen} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            if (route.name === "Start") {
              iconName = focused ? "home" : "home-outline";
            } else if (route.name === "Photos") {
              iconName = focused ? "images" : "images-outline";
            }
            // Fallback icon if needed
            if (!iconName) {
              iconName = "alert-circle-outline";
            }
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: "tomato",
          tabBarInactiveTintColor: "gray",
          headerShown: false,
        })}
      >
        <Tab.Screen name="Start" component={LandingScreen} />
        <Tab.Screen name="Photos" component={PhotosStack} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
