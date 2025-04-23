import React from "react";
import { LineChart } from "react-native-chart-kit";
import { Dimensions, Text, View, StyleSheet } from "react-native";

const screenWidth = Dimensions.get("window").width;

const ProgressGraph = ({ title, data }) => {
  const chartData = {
    labels: data.map((d) => d.date.slice(5, 10)), // MM-TT
    datasets: [{ data: data.map((d) => (isFinite(d.value) ? d.value : 0)) }],
  };
  if (!data || data.length === 0) return null;

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <LineChart
        data={chartData}
        width={screenWidth - 64}
        height={180}
        yAxisSuffix=""
        chartConfig={{
          backgroundColor: "#fff",
          backgroundGradientFrom: "#fff",
          backgroundGradientTo: "#fff",
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(0,122,255,${opacity})`,
          labelColor: () => "#333",
          propsForDots: {
            r: "4",
            strokeWidth: "2",
            stroke: "#007AFF",
          },
        }}
        bezier
        style={{ borderRadius: 10 }}
      />
    </View>
  );
};

export default ProgressGraph;

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 14,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
});
