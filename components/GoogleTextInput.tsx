import { GoogleInputProps } from "@/types/type";
import { View } from "react-native";
import GooglePlacesTextInput from "react-native-google-places-textinput";

const googlePlacesApiKey = process.env.EXPO_PUBLIC_GOOGLE_API_KEY;

const GoogleTextInput = ({
  initialLocation,
  containerStyle,
  textInputBackgroundColor,
  handlePress,
}: GoogleInputProps) => {
  return (
    <View
      className={`flex flex-row items-center justify-center relative z-50 rounded-xl truncate ${containerStyle}`}
    >
      <GooglePlacesTextInput
        apiKey={googlePlacesApiKey || "INVALID_GOOGLE_API_KEY"}
        fetchDetails={true}
        placeHolderText="Where do you want to go?"
        value={initialLocation}
        debounceDelay={200}
        onPlaceSelect={(place: any) => {
          handlePress({
            latitude: place.details?.location?.latitude!,
            longitude: place.details?.location?.longitude!,
            address: place.text?.text,
          });
        }}
        style={{
          container: {
            width: "100%",
            marginHorizontal: 0,
          },
          input: {
            height: 45,
            borderColor: "#ccc",
            borderRadius: 8,
            backgroundColor: textInputBackgroundColor,
          },
          suggestionsContainer: {
            backgroundColor: "#ffffff",
            maxHeight: 250,
          },
          suggestionItem: {
            padding: 15,
          },
          suggestionText: {
            main: {
              fontSize: 16,
              color: "#333",
            },
            secondary: {
              fontSize: 14,
              color: "#666",
            },
          },
          loadingIndicator: {
            color: "#999",
          },
          placeholder: {
            color: "#999",
          },
        }}
      />
    </View>
  );
};

export default GoogleTextInput;
