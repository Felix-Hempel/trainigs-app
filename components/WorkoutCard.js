import React from "react";
import { TouchableOpacity, Text, StyleSheet, View } from "react-native";
import { useNavigation } from "@react-navigation/native";

const WorkoutCard = ({ exercise }) => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        navigation.navigate("ExerciseDetail", { exerciseId: exercise.id })
      }
    >
      <Text style={styles.name}>{exercise.name}</Text>
      <Text style={styles.info}>
        {exercise.sets} Sätze · {exercise.warmups} Aufwärm
      </Text>
    </TouchableOpacity>
  );
};

export default WorkoutCard;

const styles = StyleSheet.create({
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
  name: {
    fontSize: 17,
    fontWeight: "600",
    marginBottom: 6,
  },
  info: {
    color: "#555",
  },
});
