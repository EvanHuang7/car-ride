import { icons } from "@/constants";
import { useFetch } from "@/lib/fetch";
import {
  calculateDriverTimes,
  calculateRegion,
  generateMarkersFromData,
} from "@/lib/map";
import {
  useDriverStore,
  useGoogleApiResultCacheStore,
  useLocationStore,
} from "@/store";
import { Driver, MarkerData } from "@/types/type";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import MapView, { Marker, Polyline, PROVIDER_DEFAULT } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";

const styles = StyleSheet.create({
  map: {
    flex: 1,
    width: "100%",
    height: "100%",
    borderRadius: 16, // rounded-2xl
  },
});

const directionsAPI = process.env.EXPO_PUBLIC_GOOGLE_API_KEY;

const Map = () => {
  const {
    userLongitude,
    userLatitude,
    destinationLatitude,
    destinationLongitude,
  } = useLocationStore();
  // Get drivers data from DB
  const { data: drivers, loading, error } = useFetch<Driver[]>("/(api)/driver");

  const { selectedDriver, setDrivers } = useDriverStore();
  // Car icons
  const [markers, setMarkers] = useState<MarkerData[]>([]);

  // Cache the Google Direction API call result
  const { directionPathCoords, setDirectionPathCoords } =
    useGoogleApiResultCacheStore();

  const region = calculateRegion({
    userLatitude,
    userLongitude,
    destinationLatitude,
    destinationLongitude,
  });

  const handleReady = (result) => {
    // TODO: remove test log
    console.log(
      "handleReady in MapViewDirections component with Google Directions API call"
    );

    setDirectionPathCoords(result.coordinates);
  };

  // TODO: remove test log function
  const logStart = (result) => {
    console.log(
      "logStart in MapViewDirections component with Google Directions API call"
    );
  };

  // Set the markers (car icons) based on db drivers
  useEffect(() => {
    if (Array.isArray(drivers)) {
      if (!userLatitude || !userLongitude) return;

      // Generate random position of car icons around user location
      const newMarkers = generateMarkersFromData({
        data: drivers,
        userLatitude,
        userLongitude,
      });

      setMarkers(newMarkers);
    }
  }, [drivers, userLatitude, userLongitude]);

  // Create a path between user location and destination and set drivers
  useEffect(() => {
    if (markers.length > 0 && !!destinationLatitude && !!destinationLongitude) {
      // TODO: remove test log function
      console.log(
        "call calculateDriverTimes() function with Google Directions API call: destinationLatitude, destinationLongitude,",
        destinationLatitude,
        destinationLongitude
      );
      // TODO: Cache the result to to global store
      calculateDriverTimes({
        markers,
        userLatitude,
        userLongitude,
        destinationLatitude,
        destinationLongitude,
      }).then((drivers) => {
        setDrivers(drivers as MarkerData[]);
      });
    }
  }, [markers, destinationLatitude, destinationLongitude]);

  if (loading || (!userLatitude && !userLongitude))
    return (
      <View className="flex justify-between items-center w-full">
        <ActivityIndicator size="small" color="#000" />
      </View>
    );

  if (error)
    return (
      <View className="flex justify-between items-center w-full">
        <Text>Error: {error}</Text>
      </View>
    );

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
      {markers.map((marker, index) => (
        <Marker
          key={marker.id}
          coordinate={{
            latitude: marker.latitude,
            longitude: marker.longitude,
          }}
          title={marker.title}
          image={
            selectedDriver === +marker.id ? icons.selectedMarker : icons.marker
          }
        />
      ))}

      {destinationLatitude && destinationLongitude && (
        <>
          <Marker
            key="destination"
            coordinate={{
              latitude: destinationLatitude,
              longitude: destinationLongitude,
            }}
            title="Destination"
            image={icons.pin}
          />

          {directionPathCoords.length > 0 ? (
            <Polyline
              coordinates={directionPathCoords}
              strokeColor="#0286FF"
              strokeWidth={6}
            />
          ) : (
            <MapViewDirections
              origin={{
                latitude: userLatitude!,
                longitude: userLongitude!,
              }}
              destination={{
                latitude: destinationLatitude,
                longitude: destinationLongitude,
              }}
              apikey={directionsAPI!}
              strokeColor="#0286FF"
              strokeWidth={2}
              onReady={handleReady}
              onStart={logStart}
            />
          )}
        </>
      )}
    </MapView>
  );
};

export default Map;
