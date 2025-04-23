import AsyncStorage from "@react-native-async-storage/async-storage";

export const loadSplitPlan = async () => {
  const workoutsRaw = await AsyncStorage.getItem("splitPlan");
  const exercisesRaw = await AsyncStorage.getItem("exerciseData");

  if (!workoutsRaw || !exercisesRaw) return null;

  return {
    workouts: JSON.parse(workoutsRaw),
    exercises: JSON.parse(exercisesRaw),
  };
};
