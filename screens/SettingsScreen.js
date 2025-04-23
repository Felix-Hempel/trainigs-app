import React from "react";
import { View, Text, Switch, StyleSheet } from "react-native";
import { useState } from "react";

export default function SettingsScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Einstellungen</Text>

      <View style={styles.setting}>
        <Text>Benachrichtigungen</Text>
        <Switch
          value={notificationsEnabled}
          onValueChange={setNotificationsEnabled}
        />
      </View>

      <View style={styles.setting}>
        <Text>Dark Mode</Text>
        <Switch value={darkMode} onValueChange={setDarkMode} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 40 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  setting: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 10,
  },
});
