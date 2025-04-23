import React, { useState } from "react";
import { View, ScrollView, Text, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import CalendarStrip from "../components/CalendarStrip";
import WorkoutCard from "../components/WorkoutCard";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function HomeScreen() {
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  });

  const [workout, setWorkout] = useState(null);
  const [exerciseData, setExerciseData] = useState({});

  // hole Übungen aus AsyncStorage (falls noch nicht geladen)
  React.useEffect(() => {
    AsyncStorage.getItem("exerciseData").then((raw) => {
      if (raw) setExerciseData(JSON.parse(raw));
    });
  }, []);

  return (
    <View style={[styles.container]}>
      <CalendarStrip
        selectedDate={selectedDate}
        onSelectDate={setSelectedDate}
        onWorkoutChange={setWorkout}
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>
          {selectedDate.toLocaleDateString("de-DE", {
            weekday: "long",
            day: "2-digit",
            month: "2-digit",
          })}{" "}
          – {workout?.name || "Ruhetag"}
        </Text>

        {workout?.exercises.map((ex, i) => {
          const data = exerciseData[ex.id];
          return data ? (
            <WorkoutCard
              exercise={exerciseData[ex.id]}
              sets={ex.sets}
              warmups={ex.warmups}
            />
          ) : null;
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 15,
    backgroundColor: "#F9F9F9",
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    marginVertical: 15,
    paddingHorizontal: 15,
  },
});
