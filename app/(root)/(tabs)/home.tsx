import { SignedIn, SignedOut, useUser } from "@clerk/clerk-expo";
import { Link } from "expo-router";
import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import "../../global.css";

const Home = () => {
  const { user } = useUser();
  return (
    <SafeAreaView className="flex-1 items-center justify-center bg-white">
      <SignedIn>
        <Text className="text-xl font-bold text-blue-500">
          Hello 👋 {user?.emailAddresses[0].emailAddress}
        </Text>
      </SignedIn>
      <SignedOut>
        <Link href="/(auth)/sign-in">
          <Text>Sign in</Text>
        </Link>
        <Link href="/(auth)/sign-up">
          <Text>Sign up</Text>
        </Link>
      </SignedOut>
    </SafeAreaView>
  );
};

export default Home;
