import { View } from "react-native";

import RideLayout from "@/components/RideLayout";

const ConfirmRide = () => {
  return (
    <RideLayout title={"Choose a Rider"} snapPoints={["65%", "85%"]}>
      <View>ConfirmRide page</View>
    </RideLayout>
  );
};

export default ConfirmRide;
