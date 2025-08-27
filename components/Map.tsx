import { calculateRegion } from "@/lib/map";
import { useLocationStore } from "@/store";
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
  const {
    userLongitude,
    userLatitude,
    destinationLatitude,
    destinationLongitude,
  } = useLocationStore();

  const region = calculateRegion({
    userLatitude,
    userLongitude,
    destinationLatitude,
    destinationLongitude,
  });

  return (
    <MapView
      provider={PROVIDER_DEFAULT}
      style={styles.map}
      tintColor="black"
      mapType="mutedStandard"
      showsPointsOfInterest={false}
      initialRegion={region}
      showsUserLocation={true}
      userInterfaceStyle="light"
    >
      <Text>Map</Text>
    </MapView>
  );
};

export default Map;
