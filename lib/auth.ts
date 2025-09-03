import { fetchAPI } from "@/lib/fetch";
import * as AuthSession from "expo-auth-session";

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
        // NOTE: We don't need to set `navigate` callback method optional field
        // becuase we don't requires further user action, such as, MFA, email/phone verification, etc, for this case.
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
