import React, { useEffect, useRef } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  Text,
  StyleSheet,
} from "react-native";
import { getWorkoutForDate } from "../data/workouts";
import { isSameDay } from "../utils/dateHelpers";

export default function CalendarStrip({ onSelectDate, selectedDate }) {
  const scrollRef = useRef();

  // 👇 Erstelle 14 Tage mit Zeit = 0:00:00
  const days = Array.from({ length: 14 }, (_, i) => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - 7 + i);
    return new Date(d); // neue Kopie mit nullter Zeit
  });

  // 👇 Scrolle zum heutigen Tag beim Mount
  useEffect(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const index = days.findIndex((d) => isSameDay(d, today));
    const itemWidth = 76;

    if (index !== -1 && scrollRef.current) {
      setTimeout(() => {
        scrollRef.current.scrollTo({
          x: itemWidth * (index - 2),
          animated: false,
        });
      }, 10); // kleiner Delay, damit ScrollView ready ist
    }
  }, []);

  return (
    <View style={styles.stripWrapper}>
      <ScrollView
        ref={scrollRef}
        horizontal
        style={styles.strip}
        showsHorizontalScrollIndicator={false}
      >
        {days.map((day, i) => {
          const isSelected = isSameDay(selectedDate, day);
          const hasWorkout = !!getWorkoutForDate(day);

          return (
            <TouchableOpacity
              key={i}
              onPress={() => onSelectDate(day)}
              style={[styles.day, isSelected && styles.selectedDay]}
            >
              <Text
                style={[styles.dayLabel, isSelected && styles.selectedText]}
              >
                {day.toDateString().slice(0, 3)}
              </Text>
              <Text
                style={[styles.dayNumber, isSelected && styles.selectedText]}
              >
                {day.getDate()}
              </Text>
              {hasWorkout ? (
                <View style={styles.dotBlue} />
              ) : (
                <View style={styles.dotGray} />
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  strip: {
    flexDirection: "row",
    marginVertical: 10,
    paddingHorizontal: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },
  day: {
    marginRight: 8,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: "#eee",
    minWidth: 60,
    height: 65,
  },
  selectedDay: {
    backgroundColor: "#007AFF",
  },
  dayLabel: {
    fontSize: 13,
    color: "#555",
  },
  dayNumber: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
  selectedText: {
    color: "#fff",
  },
  dotBlue: {
    width: 6,
    height: 6,
    backgroundColor: "#007AFF",
    borderRadius: 3,
    marginTop: 4,
  },
  dotGray: {
    width: 6,
    height: 6,
    backgroundColor: "#bbb",
    borderRadius: 3,
    marginTop: 4,
  },
});
