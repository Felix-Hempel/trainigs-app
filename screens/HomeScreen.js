import React, { useState } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import CalendarStrip from "../components/CalendarStrip";
import WorkoutCard from "../components/WorkoutCard";
import { getWorkoutForDate } from "../data/workouts";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { EXERCISES } from "../data/exercises";

const HomeScreen = () => {
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  });

  const workout = getWorkoutForDate(selectedDate);
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container]}>
      <CalendarStrip
        onSelectDate={setSelectedDate}
        selectedDate={selectedDate}
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

        {workout?.exercises.map((id, i) => {
          const exercise = EXERCISES[id];
          return <WorkoutCard key={id} exercise={exercise} />;
        })}
      </ScrollView>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    backgroundColor: "#F9F9F9",
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    marginVertical: 15,
    paddingHorizontal: 15,
  },
});
