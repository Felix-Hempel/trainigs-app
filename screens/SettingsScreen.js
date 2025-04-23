import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Modal,
  FlatList,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Slider from "@react-native-community/slider";

const SHEET_ID = "1gsru00IrmVCAoYaP7poWXcrKKvb8GNWVoUZ0HQtAs2A";
const SHEET_WORKOUTS_URL = `https://opensheet.elk.sh/${SHEET_ID}/Workouts`;
const SHEET_EXERCISES_URL = `https://opensheet.elk.sh/${SHEET_ID}/Exercises`;
const SHEET_SPLITS_URL = `https://opensheet.elk.sh/${SHEET_ID}/SplitPlans`;

export default function SettingsScreen() {
  const [loading, setLoading] = useState(false);
  const [splitName, setSplitName] = useState("");
  const [allSplits, setAllSplits] = useState([]);
  const [offset, setOffset] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const [preview, setPreview] = useState([]);

  useEffect(() => {
    fetch(SHEET_SPLITS_URL)
      .then((res) => res.json())
      .then((splits) => setAllSplits(splits));
  }, []);

  useEffect(() => {
    const loadPreview = async () => {
      const planRaw = await AsyncStorage.getItem("splitPlan");
      if (!planRaw) return;

      const splitPlan = JSON.parse(planRaw).filter((w) => w.tag > 0);
      const result = [];
      const baseIndex = offset % splitPlan.length;
      for (let i = -2; i <= 2; i++) {
        const idx = (baseIndex + i + splitPlan.length) % splitPlan.length;
        result.push({
          label:
            i === 0
              ? "Heute"
              : i < 0
              ? `Letztes Training −${-i}`
              : `Nächstes Training +${i}`,
          ...splitPlan[idx],
        });
      }
      setPreview(result);
    };

    loadPreview();
  }, [offset]);

  const fetchAndStoreSplitPlan = async () => {
    if (!splitName)
      return Alert.alert("Fehler", "Bitte einen Splitnamen eingeben");

    try {
      setLoading(true);

      const splitsRes = await fetch(SHEET_SPLITS_URL);
      const workoutsRes = await fetch(SHEET_WORKOUTS_URL);
      const exercisesRes = await fetch(SHEET_EXERCISES_URL);

      const allSplits = await splitsRes.json();
      const allWorkouts = await workoutsRes.json();
      const allExercises = await exercisesRes.json();

      const cleanedName = splitName.trim();
      const split = allSplits.find((s) => s.Name.trim() === cleanedName);
      if (!split) throw new Error("Split nicht gefunden");

      const workoutNames = split.Trainingdays.split(",").map((w) =>
        w.trim().replace(/\s+/g, " ")
      );

      const cleanedWorkouts = allWorkouts.map((row) => {
        const fixed = {};
        Object.keys(row).forEach((key) => {
          const cleanKey = key.trim();
          fixed[cleanKey] = row[key];
        });
        return fixed;
      });

      const cleanedExercises = allExercises.map((ex) => {
        const fixed = {};
        Object.keys(ex).forEach((key) => {
          const cleanKey = key.trim();
          fixed[cleanKey] = ex[key];
        });
        return fixed;
      });

      const workouts = workoutNames.map((name) => {
        const wRows = cleanedWorkouts.filter((w) => w.Name === name);
        const tag = Number(wRows[0]?.Tag) || 0;

        const exercises = wRows.map((row) => ({
          id: row["Übung-ID"],
          sets: Number(row["Sätze"]),
          warmups: Number(row["Warmups"]),
        }));

        return { name, tag, exercises };
      });

      const allUsedExerciseIds = new Set(
        workouts.flatMap((w) => w.exercises.map((e) => e.id))
      );

      const filteredExercises = cleanedExercises.filter((e) =>
        allUsedExerciseIds.has(e.ID)
      );

      const formattedExercises = {};
      for (const ex of filteredExercises) {
        formattedExercises[ex.ID] = {
          id: ex.ID,
          name: ex.Name,
          sets: Number(ex.Sätze),
          warmups: Number(ex.Warmups),
          description: ex.Beschreibung,
          video: ex["Video-URL"],
          subs: ex.Subs?.split(",").map((s) => s.trim()) || [],
          muscleGroup: ex.Muskelgruppe,
        };
      }

      const schedule = {
        monday: split.Mondaytraining?.toLowerCase?.() === "true",
        tuesday: split.Tuesdaytraining?.toLowerCase?.() === "true",
        wednesday: split.Wednesdaytraining?.toLowerCase?.() === "true",
        thursday: split.Thursdaytraining?.toLowerCase?.() === "true",
        friday: split.Fridaytraining?.toLowerCase?.() === "true",
        saturday: split.Saturdaytraining?.toLowerCase?.() === "true",
        sunday: split.Sundaytraining?.toLowerCase?.() === "true",
      };

      await AsyncStorage.setItem(
        "activeSplit",
        JSON.stringify({ name: splitName, schedule, offset })
      );

      await AsyncStorage.setItem("workouts", JSON.stringify(workouts));
      await AsyncStorage.setItem("splitPlan", JSON.stringify(workouts));
      await AsyncStorage.setItem(
        "exerciseData",
        JSON.stringify(formattedExercises)
      );

      Alert.alert("Erfolg", "Split wurde geladen ✅");
    } catch (err) {
      console.error(err);
      Alert.alert("Fehler", "Split konnte nicht geladen werden");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.container}
    >
      <Text style={styles.title}>Split wählen</Text>

      <TouchableOpacity
        style={styles.dropdown}
        onPress={() => setShowDropdown(!showDropdown)}
      >
        <Text style={styles.dropdownText}>
          {splitName || "Split auswählen"}
        </Text>
      </TouchableOpacity>

      {showDropdown && (
        <Modal transparent animationType="fade">
          <TouchableOpacity
            style={styles.modalBackdrop}
            onPress={() => setShowDropdown(false)}
          >
            <View style={styles.dropdownList}>
              <FlatList
                data={allSplits}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.dropdownItem}
                    onPress={() => {
                      setSplitName(item.Name);
                      setShowDropdown(false);
                    }}
                  >
                    <Text>{item.Name}</Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          </TouchableOpacity>
        </Modal>
      )}

      <TouchableOpacity
        style={styles.button}
        onPress={fetchAndStoreSplitPlan}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Lade..." : "Split laden & speichern"}
        </Text>
      </TouchableOpacity>

      <Text style={styles.sliderLabel}>
        Trainingszyklus-Verschiebung: {offset}
      </Text>
      <Slider
        style={{ width: "100%" }}
        minimumValue={0}
        maximumValue={10}
        step={1}
        value={offset}
        onValueChange={setOffset}
        minimumTrackTintColor="#007AFF"
        maximumTrackTintColor="#ccc"
      />

      <View style={styles.previewContainer}>
        <Text style={styles.previewTitle}>
          Trainingsübersicht (ohne Ruhetage):
        </Text>
        {preview.map((item, i) => (
          <View key={i} style={styles.previewRow}>
            <Text style={styles.previewLabel}>{item.label}</Text>
            <Text style={styles.previewWorkout}>{item.name}</Text>
          </View>
        ))}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#f9f9f9",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 16,
  },
  dropdown: {
    padding: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    backgroundColor: "#fff",
    marginBottom: 20,
  },
  dropdownText: {
    fontSize: 16,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.2)",
    justifyContent: "center",
    padding: 20,
  },
  dropdownList: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
  },
  dropdownItem: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },
  sliderLabel: {
    marginTop: 30,
    marginBottom: 10,
    fontSize: 16,
  },
  previewContainer: {
    marginTop: 30,
    padding: 12,
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  previewTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
  },
  previewRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  previewLabel: {
    color: "#555",
  },
  previewWorkout: {
    fontWeight: "600",
    color: "#007AFF",
  },
});
