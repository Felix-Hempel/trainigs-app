import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { getExerciseLog, deleteExerciseLogEntry } from "../utils/saveLogEntry";
import { EXERCISES } from "../data/exercises";
import Feather from "react-native-vector-icons/Feather";

export default function HistoryScreen() {
  const [allLogs, setAllLogs] = useState([]);

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

  useEffect(() => {
    loadAllLogs();
  }, []);

  const deleteEntry = async (exerciseName, indexToDelete) => {
    await deleteExerciseLogEntry(exerciseName, indexToDelete);
    loadAllLogs(); // Refresh
  };

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
            .map((entry, j) => {
              const actualIndex = log.entries.length - 1 - j; // original Index
              return (
                <View key={j} style={styles.logCard}>
                  <View style={styles.cardHeader}>
                    <Text style={styles.date}>
                      {new Date(entry.date).toLocaleDateString("de-DE")}
                    </Text>
                    <TouchableOpacity
                      onPress={() =>
                        Alert.alert(
                          "Eintrag löschen",
                          "Willst du diesen Eintrag wirklich löschen?",
                          [
                            { text: "Abbrechen", style: "cancel" },
                            {
                              text: "Löschen",
                              style: "destructive",
                              onPress: () => deleteEntry(log.name, actualIndex),
                            },
                          ]
                        )
                      }
                    >
                      <Feather name="trash-2" size={20} color="#888" />
                    </TouchableOpacity>
                  </View>
                  {entry.sets.map((s, index) => (
                    <Text key={index} style={styles.setLine}>
                      Satz {index + 1}: {s.weight || 0} kg × {s.reps || 0}
                    </Text>
                  ))}
                </View>
              );
            })}
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
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  date: {
    fontSize: 14,
    fontWeight: "600",
    color: "#007AFF",
  },
  setLine: {
    fontSize: 14,
    color: "#333",
  },
});
