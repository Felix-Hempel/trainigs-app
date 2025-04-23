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
export const deleteExerciseLogEntry = async (exerciseName, index) => {
  const raw = await AsyncStorage.getItem(`log_${exerciseName}`);
  if (!raw) return;
  const logs = JSON.parse(raw);
  logs.splice(index, 1);
  await AsyncStorage.setItem(`log_${exerciseName}`, JSON.stringify(logs));
};
