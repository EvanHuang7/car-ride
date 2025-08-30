import { GoogleInputProps } from "@/types/type";
import { View } from "react-native";
import GooglePlacesTextInput from "react-native-google-places-textinput";

const googlePlacesApiKey = process.env.EXPO_PUBLIC_GOOGLE_API_KEY;

const GoogleTextInput = ({
  icon,
  initialLocation,
  containerStyle,
  textInputBackgroundColor,
  handlePress,
}: GoogleInputProps) => {
  return (
    <View
      className={`flex flex-row items-center justify-center relative z-50 rounded-xl ${containerStyle}`}
    >
      <GooglePlacesTextInput
        fetchDetails={true}
        placeHolderText="Search"
        debounceDelay={200}
        onPlaceSelect={(place: any) => {
          handlePress({
            latitude: place.details?.location?.latitude!,
            longitude: place.details?.location?.longitude!,
            address: place.details?.formattedAddress,
          });
        }}
        apiKey={googlePlacesApiKey || "INVALID_KEY"}
      />
    </View>
  );
};

export default GoogleTextInput;
