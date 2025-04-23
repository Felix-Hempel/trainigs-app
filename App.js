import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Tabs from "./navigation/BottomTabs";
import ExerciseDetailScreen from "./screens/ExerciseDetailScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Tabs"
          component={Tabs}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ExerciseDetail"
          component={ExerciseDetailScreen}
          options={{ title: "Übung" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
