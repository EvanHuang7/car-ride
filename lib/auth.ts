import { fetchAPI } from "@/lib/fetch";
import * as AuthSession from "expo-auth-session";
import { router } from "expo-router";

export const googleOAuth = async (startSSOFlow: any) => {
  try {
    // Start the authentication process by calling `startSSOFlow()`
    const { createdSessionId, setActive, signIn, signUp } = await startSSOFlow({
      strategy: "oauth_google",
      // For native, you must pass a scheme, like AuthSession.makeRedirectUri({ scheme, path })
      // For more info, see https://docs.expo.dev/versions/latest/sdk/auth-session/#authsessionmakeredirecturioptions
      redirectUrl: AuthSession.makeRedirectUri({
        scheme: "carride",
        path: "/(root)/(tabs)/home",
      }),
    });

    // If sign in was successful, set the active session
    if (createdSessionId) {
      // set active session when active session exists.
      setActive!({
        session: createdSessionId,
        navigate: async ({ session }: any) => {
          if (session?.currentTask) {
            // Check for tasks and navigate to custom UI to help users resolve them
            // See https://clerk.com/docs/custom-flows/overview#session-tasks
            console.log(session?.currentTask);
            return;
          }

          router.push("/(root)/(tabs)/home");
        },
      });

      // If it is a sign up action for a new user, create a user record in DB
      if (signUp.createdUserId) {
        await fetchAPI("/(api)/user", {
          method: "POST",
          body: JSON.stringify({
            name: `${signUp.firstName} ${signUp.lastName}`,
            email: signUp.emailAddress,
            clerkId: signUp.createdUserId,
          }),
        });
      }

      return {
        success: true,
        code: "success",
        message: "You have successfully signed in with Google",
      };
    }

    // If there is no `createdSessionId`
    return {
      success: false,
      message: "An error occurred while signing in with Google",
    };
  } catch (err: any) {
    console.error(err);
    return {
      success: false,
      code: err.code,
      message: err?.errors[0]?.longMessage,
    };
  }
};
