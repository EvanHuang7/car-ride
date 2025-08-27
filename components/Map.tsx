import React from "react";
import { StyleSheet, Text } from "react-native";
import MapView, { PROVIDER_DEFAULT } from "react-native-maps";

const styles = StyleSheet.create({
  map: {
    flex: 1,
    width: "100%",
    height: "100%",
    borderRadius: 16, // rounded-2xl
  },
});

const Map = () => {
  return (
    <MapView
      provider={PROVIDER_DEFAULT}
      style={styles.map}
      tintColor="black"
      mapType="mutedStandard"
    >
      <Text>Map</Text>
    </MapView>
  );
};

export default Map;
