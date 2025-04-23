import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { getExerciseLog } from "../utils/saveLogEntry";
import { EXERCISES } from "../data/exercises";

export default function HistoryScreen() {
  const [allLogs, setAllLogs] = useState([]);

  useEffect(() => {
    const loadAllLogs = async () => {
      const logs = [];
      for (const [key, exercise] of Object.entries(EXERCISES)) {
        const data = await getExerciseLog(exercise.name);
        if (data.length > 0) {
          logs.push({ name: exercise.name, entries: data });
        }
      }
      setAllLogs(logs);
    };

    loadAllLogs();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Trainingsverlauf</Text>
      {allLogs.length === 0 && (
        <Text style={styles.empty}>Keine Einträge vorhanden.</Text>
      )}
      {allLogs.map((log, i) => (
        <View key={i} style={styles.exerciseBlock}>
          <Text style={styles.exerciseTitle}>{log.name}</Text>
          {log.entries
            .slice(-5)
            .reverse()
            .map((entry, j) => (
              <View key={j} style={styles.logCard}>
                <Text style={styles.date}>
                  {new Date(entry.date).toLocaleDateString("de-DE")}
                </Text>
                {entry.sets.map((s, index) => (
                  <Text key={index} style={styles.setLine}>
                    Satz {index + 1}: {s.weight || 0} kg × {s.reps || 0}
                  </Text>
                ))}
              </View>
            ))}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 20,
  },
  empty: {
    fontSize: 16,
    color: "#999",
  },
  exerciseBlock: {
    marginBottom: 30,
  },
  exerciseTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
  },
  logCard: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 1,
  },
  date: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 6,
    color: "#007AFF",
  },
  setLine: {
    fontSize: 14,
    color: "#333",
  },
});
