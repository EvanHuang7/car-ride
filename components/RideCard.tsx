import { Ride } from "@/types/type";
import { Text, View } from "react-native";

const RideCard = ({ ride }: { ride: Ride }) => {
  return (
    <View>
      <Text className="text-md font-JakartaBold">
        {ride.driver.first_name} {ride.driver.last_name}
      </Text>
    </View>
  );
};

export default RideCard;
