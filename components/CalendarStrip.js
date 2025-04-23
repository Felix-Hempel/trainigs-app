import React, { useEffect, useRef, useState } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  Text,
  StyleSheet,
} from "react-native";
import { isSameDay } from "../utils/dateHelpers";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getWorkoutForDate } from "../utils/workoutHelpers";

export default function CalendarStrip({
  onSelectDate,
  selectedDate,
  onWorkoutChange,
}) {
  const [workoutDays, setWorkoutDays] = useState({});
  const scrollRef = useRef();
  const [splitPlan, setSplitPlan] = useState([]);
  const [schedule, setSchedule] = useState({});
  const [scrollReady, setScrollReady] = useState(false);
  useEffect(() => {
    const loadData = async () => {
      const planRaw = await AsyncStorage.getItem("splitPlan");
      const scheduleRaw = await AsyncStorage.getItem("activeSplit");

      console.log("🧠 planRaw:", planRaw);
      console.log("🧠 scheduleRaw:", scheduleRaw);

      if (planRaw && scheduleRaw) {
        const parsedPlan = JSON.parse(planRaw);
        const parsedSchedule = JSON.parse(scheduleRaw);

        console.log("✅ splitPlan:", parsedPlan);
        console.log("✅ schedule:", parsedSchedule.schedule);

        setSplitPlan(parsedPlan);
        setSchedule(parsedSchedule.schedule);
      }
    };

    loadData();
  }, []);
  useEffect(() => {
    const loadWorkoutDays = async () => {
      const results = await Promise.all(
        days.map(async (day) => {
          const workout = await getWorkoutForDate(day);
          return { key: day.toDateString(), hasWorkout: !!workout };
        })
      );

      const map = {};
      results.forEach((r) => {
        map[r.key] = r.hasWorkout;
      });

      setWorkoutDays(map);
    };

    loadWorkoutDays();
  }, [splitPlan, schedule]);

  const days = Array.from({ length: 14 }, (_, i) => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - 7 + i);
    return new Date(d);
  });
  useEffect(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const index = days.findIndex((d) => isSameDay(d, today));
    const itemWidth = 76;

    if (index !== -1) {
      const scrollToIndex = () => {
        if (scrollRef.current) {
          scrollRef.current.scrollTo({
            x: itemWidth * (index - 2),
            animated: false,
          });
        }
      };

      // Jetzt sicherstellen, dass ScrollView gerendert ist:
      requestAnimationFrame(scrollToIndex);
    }
  }, [scrollRef.current]);

  const getTrainingDayTag = (targetDate) => {
    const weekdayKeys = [
      "sunday",
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
    ];

    let trainingCount = 0;
    const firstOfMonth = new Date(
      targetDate.getFullYear(),
      targetDate.getMonth(),
      1
    );

    for (
      let d = new Date(firstOfMonth);
      d <= targetDate;
      d.setDate(d.getDate() + 1)
    ) {
      const key = weekdayKeys[(d.getDay() + 1) % 7];

      if (schedule[key]) {
        trainingCount++;
      }
    }

    return trainingCount;
  };

  useEffect(() => {
    if (!scrollReady) return;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const index = days.findIndex((d) => isSameDay(d, today));
    const itemWidth = 76;

    if (index !== -1 && scrollRef.current) {
      scrollRef.current.scrollTo({
        x: itemWidth * (index - 2),
        animated: false,
      });
    }
  }, [scrollReady]);

  useEffect(() => {
    const fetchWorkout = async () => {
      const workout = await getWorkoutForDate(selectedDate);
      onWorkoutChange(workout);
    };

    fetchWorkout();
  }, [selectedDate, splitPlan, schedule]);

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
          const hasWorkout = workoutDays[day.toDateString()] === true;

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
  stripWrapper: {
    paddingTop: 15,
  },
  strip: {
    flexDirection: "row",
    marginVertical: 0,
    paddingHorizontal: 10,
    paddingBottom: 15,
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
