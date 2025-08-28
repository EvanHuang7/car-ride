import { SafeAreaView, Text } from "react-native";

import { useLocationStore } from "@/store";

const FindRide = () => {
  const {
    userAddress,
    destinationAddress,
    setDestinationLocation,
    setUserLocation,
  } = useLocationStore();

  return (
    <SafeAreaView className="flex-1 items-center justify-center bg-white">
      <Text className="text-xl font-bold text-blue-500">FindRide</Text>
      <Text className="text-xl font-bold text-blue-500">
        you are here: {userAddress}
      </Text>
      <Text className="text-xl font-bold text-blue-500">
        you are going to: {destinationAddress}
      </Text>
    </SafeAreaView>
  );
};

export default FindRide;
