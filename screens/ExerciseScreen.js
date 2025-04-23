import React, { useState } from "react";
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  TextInput,
  FlatList,
} from "react-native";
import { EXERCISES } from "../data/exercises";
import { useNavigation } from "@react-navigation/native";
import ExerciseDetailScreen from "./ExerciseDetailScreen";
export default function ExerciseScreen() {
  const navigation = useNavigation();
  const [search, setSearch] = useState("");
  const [sorted, setSorted] = useState(false);
  const [muscleFilter, setMuscleFilter] = useState(null);
  const [favorites, setFavorites] = useState([]);

  const allExercises = Object.values(EXERCISES);
  const muscleGroups = [
    ...new Set(allExercises.map((ex) => ex.muscleGroup).filter(Boolean)),
  ];

  const toggleFavorite = (id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  const filteredExercises = allExercises
    .filter((exercise) =>
      exercise.name.toLowerCase().includes(search.toLowerCase())
    )
    .filter((exercise) =>
      muscleFilter ? exercise.muscleGroup === muscleFilter : true
    )
    .sort((a, b) => {
      if (sorted) return a.name.localeCompare(b.name);
      if (favorites.includes(a.id) && !favorites.includes(b.id)) return -1;
      if (!favorites.includes(a.id) && favorites.includes(b.id)) return 1;
      return 0;
    });

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Alle Übungen</Text>

      <View style={styles.searchRow}>
        <TextInput
          placeholder="Suche Übung"
          value={search}
          onChangeText={setSearch}
          style={styles.searchInput}
        />
        <TouchableOpacity
          style={styles.sortButton}
          onPress={() => setSorted(!sorted)}
        >
          <Text style={styles.sortText}>{sorted ? "Zurück" : "Sortieren"}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterScroll}
      >
        <TouchableOpacity
          style={[styles.filterBtn, !muscleFilter && styles.filterBtnActive]}
          onPress={() => setMuscleFilter(null)}
        >
          <Text
            style={
              !muscleFilter ? styles.filterBtnTextActive : styles.filterBtnText
            }
          >
            Alle
          </Text>
        </TouchableOpacity>
        {muscleGroups.map((group, i) => (
          <TouchableOpacity
            key={i}
            style={[
              styles.filterBtn,
              muscleFilter === group && styles.filterBtnActive,
            ]}
            onPress={() => setMuscleFilter(group)}
          >
            <Text
              style={
                muscleFilter === group
                  ? styles.filterBtnTextActive
                  : styles.filterBtnText
              }
            >
              {group}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {filteredExercises.map((exercise) => (
        <TouchableOpacity
          key={exercise.id}
          style={styles.card}
          onPress={() =>
            navigation.navigate("ExerciseDetail", { exerciseId: exercise.id })
          }
          onLongPress={() => toggleFavorite(exercise.id)}
        >
          <View style={styles.cardHeader}>
            <Text style={styles.name}>{exercise.name}</Text>
            {favorites.includes(exercise.id) && (
              <Text style={styles.fav}>❤️</Text>
            )}
          </View>
          <Text style={styles.info}>
            {exercise.sets} Sätze · {exercise.warmups} Aufwärm
          </Text>
          {exercise.muscleGroup && (
            <Text style={styles.muscle}>{exercise.muscleGroup}</Text>
          )}
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#F9F9F9",
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 20,
  },
  searchRow: {
    flexDirection: "row",
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    marginRight: 10,
    borderColor: "#ccc",
    borderWidth: 1,
  },
  sortButton: {
    backgroundColor: "#007AFF",
    borderRadius: 10,
    paddingHorizontal: 12,
    justifyContent: "center",
  },
  sortText: {
    color: "#fff",
    fontWeight: "600",
  },
  filterScroll: {
    marginBottom: 16,
  },
  filterBtn: {
    backgroundColor: "#eee",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    marginRight: 8,
  },
  filterBtnActive: {
    backgroundColor: "#007AFF",
  },
  filterBtnText: {
    color: "#333",
  },
  filterBtnTextActive: {
    color: "#fff",
    fontWeight: "600",
  },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 14,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  name: {
    fontSize: 17,
    fontWeight: "600",
    marginBottom: 4,
  },
  fav: {
    fontSize: 18,
  },
  info: {
    color: "#555",
  },
  muscle: {
    marginTop: 4,
    fontSize: 12,
    color: "#999",
    fontStyle: "italic",
  },
});
