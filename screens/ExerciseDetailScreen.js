import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { saveExerciseLog, getExerciseLog } from "../utils/saveLogEntry";
import ProgressGraph from "../components/ProgressGraph";
import YoutubeEmbed from "../components/YoutubeEmbed";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ExerciseDetailScreen({ route }) {
  const { exerciseId } = route.params;
  const [selectedSubId, setSelectedSubId] = useState(null);
  const [exerciseData, setExerciseData] = useState({});
  const [inputs, setInputs] = useState([]);
  const [logData, setLogData] = useState([]);
  const [lastLog, setLastLog] = useState(null);
  const [numSets, setNumSets] = useState(0);
  const [numWarmups, setNumWarmups] = useState(0);

  const activeExercise = selectedSubId
    ? exerciseData[selectedSubId]
    : exerciseData[exerciseId];

  useEffect(() => {
    const loadExerciseData = async () => {
      const [exRaw, workoutRaw] = await Promise.all([
        AsyncStorage.getItem("exerciseData"),
        AsyncStorage.getItem("splitPlan"),
      ]);
      if (!exRaw || !workoutRaw) return;

      const parsedExercises = JSON.parse(exRaw);
      const parsedWorkouts = JSON.parse(workoutRaw);

      setExerciseData(parsedExercises);

      const activeId = selectedSubId || exerciseId;
      const activeExercise = parsedExercises[activeId];

      // Hole Sätze und Warmups aus dem Workout (nicht aus der Übung!)
      let sets = 0;
      let warmups = 0;

      for (const workout of parsedWorkouts) {
        const found = workout.exercises.find((ex) => ex.id === activeId);
        if (found) {
          sets = found.sets;
          warmups = found.warmups;
          setNumSets(sets);
          setNumWarmups(warmups);
          break;
        }
      }

      setInputs(
        Array.from({ length: sets }, () => ({
          weight: "",
          reps: "",
        }))
      );
    };

    loadExerciseData();
  }, [exerciseId, selectedSubId]);

  useEffect(() => {
    const loadLogs = async () => {
      if (!activeExercise?.name) return;
      const logs = await getExerciseLog(activeExercise.name);
      setLogData(logs);
      if (logs.length > 0) {
        const last = logs[logs.length - 1];
        setLastLog(last);
      }
    };
    loadLogs();
  }, [activeExercise]);

  const handleChange = (i, field, value) => {
    const updated = [...inputs];
    updated[i][field] = value;
    setInputs(updated);
    const entry = {
      sets: updated,
      substitution: selectedSubId || null,
    };
    saveExerciseLog(activeExercise.name, entry);
  };

  const extractYoutubeId = (url) => {
    const match = url.match(/(?:\?v=|\/embed\/|\.be\/)([a-zA-Z0-9_-]{11})/);
    return match ? match[1] : null;
  };

  const averageGraph = (type) =>
    logData
      .slice(-7)
      .filter((log) => Array.isArray(log.sets) && log.sets.length > 0)
      .map((log) => {
        const values = log.sets
          .map((s) => parseFloat(s?.[type] || 0))
          .filter((v) => !isNaN(v));
        const avg =
          values.length > 0
            ? values.reduce((a, b) => a + b, 0) / values.length
            : 0;

        return {
          date: log.date.slice(0, 10),
          value: isFinite(avg) ? Math.round(avg * 10) / 10 : 0,
        };
      });

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Text style={styles.exerciseName}>{activeExercise?.name}</Text>
        <Text style={styles.secondary}>
          Sätze: {numSets} · Aufwärm: {numWarmups}
        </Text>

        {activeExercise?.description && (
          <View style={{ marginTop: 12 }}>
            <Text style={styles.subTitle}>Beschreibung</Text>
            <Text style={styles.descriptionText}>
              {activeExercise.description}
            </Text>
          </View>
        )}

        {activeExercise?.video && (
          <View style={{ marginTop: 12 }}>
            <Text style={styles.subTitle}>Video</Text>
            <YoutubeEmbed videoId={extractYoutubeId(activeExercise.video)} />
          </View>
        )}
      </View>

      {lastLog && (
        <View style={styles.lastEntryBox}>
          <Text style={styles.sectionTitle}>Letztes Training</Text>
          {lastLog.sets?.map((set, i) => (
            <Text key={i} style={styles.secondary}>
              Satz {i + 1}: {set.weight || 0} kg × {set.reps || 0}
            </Text>
          ))}
        </View>
      )}

      {/* Logging */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Satz-Logging</Text>
        {inputs.map((val, i) => (
          <View key={i} style={styles.inputRow}>
            <Text style={styles.setLabel}>Satz {i + 1}</Text>
            <View style={styles.inputField}>
              <TextInput
                placeholder="Gewicht"
                keyboardType="numeric"
                style={styles.input}
                value={val.weight}
                onChangeText={(text) => handleChange(i, "weight", text)}
              />
              <Text style={styles.unit}>kg</Text>
            </View>
            <Text style={styles.x}>x</Text>
            <View style={styles.inputField}>
              <TextInput
                placeholder="Wdh"
                keyboardType="numeric"
                style={styles.input}
                value={val.reps}
                onChangeText={(text) => handleChange(i, "reps", text)}
              />
            </View>
          </View>
        ))}
      </View>

      {/* Graphen */}
      <ProgressGraph title="Ø Gewicht (kg)" data={averageGraph("weight")} />
      <ProgressGraph title="Ø Wiederholungen" data={averageGraph("reps")} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  lastEntryBox: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 14,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
    gap: 6,
  },
  container: {
    padding: 20,
    paddingBottom: 40,
    gap: 20,
  },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 14,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  exerciseName: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 6,
  },
  secondary: {
    fontSize: 14,
    color: "#555",
  },
  subTitle: {
    fontWeight: "600",
    fontSize: 15,
    marginBottom: 6,
  },
  descriptionText: {
    fontSize: 14,
    color: "#444",
    lineHeight: 20,
  },
  section: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 14,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  setLabel: {
    width: 60,
    fontWeight: "500",
  },
  inputField: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    marginHorizontal: 5,
  },
  input: {
    flex: 1,
    paddingVertical: 4,
    fontSize: 15,
  },
  unit: {
    fontSize: 13,
    color: "#555",
    marginLeft: 4,
    marginBottom: 2,
  },
  x: {
    marginHorizontal: 6,
    fontWeight: "bold",
    fontSize: 16,
  },
});
