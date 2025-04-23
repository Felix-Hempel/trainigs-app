import AsyncStorage from "@react-native-async-storage/async-storage";

export const saveExerciseLog = async (exerciseName, entry) => {
  const key = `log_${exerciseName}`;
  try {
    const existing = await AsyncStorage.getItem(key);
    const logs = existing ? JSON.parse(existing) : [];
    logs.push({ date: new Date().toISOString(), ...entry });
    await AsyncStorage.setItem(key, JSON.stringify(logs));
  } catch (e) {
    console.error("Fehler beim Speichern des Logs", e);
  }
};

export const getExerciseLog = async (exerciseName) => {
  const key = `log_${exerciseName}`;
  try {
    const data = await AsyncStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
};
