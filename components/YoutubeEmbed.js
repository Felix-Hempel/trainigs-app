import React from "react";
import { View, StyleSheet } from "react-native";
import { WebView } from "react-native-webview";

const YoutubeEmbed = ({ videoId }) => {
  const html = `
    <html>
      <body style="margin:0">
        <iframe
          width="100%"
          height="100%"
          src="https://www.youtube.com/embed/${videoId}?controls=1&modestbranding=1&rel=0"
          frameborder="0"
          allowfullscreen
        ></iframe>
      </body>
    </html>
  `;

  return (
    <View style={styles.container}>
      <WebView
        source={{ html }}
        style={styles.webview}
        javaScriptEnabled
        domStorageEnabled
        scrollEnabled={false}
      />
    </View>
  );
};

export default YoutubeEmbed;

const styles = StyleSheet.create({
  container: {
    height: 200,
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#000",
  },
  webview: {
    flex: 1,
  },
});
