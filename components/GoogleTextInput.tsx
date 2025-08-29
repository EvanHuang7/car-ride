import { GoogleInputProps } from "@/types/type";
import { View } from "react-native";
import "react-native-get-random-values";
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
        apiKey={googlePlacesApiKey || "INVALID_KEY"}
        onPlaceSelect={(place: any) => {
          console.log("Selected place:", place);
        }}
      />
    </View>
  );
};

export default GoogleTextInput;
