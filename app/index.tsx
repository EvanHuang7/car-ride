import { useAuth } from "@clerk/clerk-expo";
import { Redirect } from "expo-router";

import "./global.css";

const IndexPage = () => {
  const { isSignedIn, isLoaded } = useAuth();

  // Make sure 'isSignedIn' is loaded before redirecting the user
  if (!isLoaded) {
    return null;
  }

  if (isSignedIn) {
    return <Redirect href={"/(root)/(tabs)/home"} />;
  }

  return <Redirect href="/(auth)/welcome" />;
};

export default IndexPage;
