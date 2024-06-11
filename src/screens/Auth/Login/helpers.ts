import auth from "@react-native-firebase/auth";
import {
  GoogleSignin,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import ky from "ky";

/**
 * Configure Google Login.
 */
GoogleSignin.configure({
  scopes: [
    "email",
    "profile",
    "openid",
    "https://www.googleapis.com/auth/user.phonenumbers.read",
    "https://www.googleapis.com/auth/user.addresses.read",
    "https://www.googleapis.com/auth/user.birthday.read",
    "https://www.googleapis.com/auth/user.gender.read",
    "https://www.googleapis.com/auth/userinfo.profile",
    "https://www.googleapis.com/auth/userinfo.email",
  ],
  webClientId:
    "928425044171-625v9e8k57jjp1ruasr8cgml1uisv7md.apps.googleusercontent.com",
  offlineAccess: true,
});

export const SocialLogin = {
  //Google Sign-In method
  googleLogin: async (success: Function, failure: Function) => {
    try {
      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });

      const { idToken } = await GoogleSignin.signIn();
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      const result = await auth().signInWithCredential(googleCredential);
      const { accessToken } = await GoogleSignin.getTokens();

      const response = await ky
        .get(
          `https://people.googleapis.com/v1/people/me?personFields=phoneNumbers,birthdays,genders,names`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              Accept: "application/json",
            },
          }
        )
        .json();
      if (response) {
        console.log("Response from Google ", JSON.stringify(response));
      }
      success({ result, googleCredential, idToken, response });
      // } else {
      //   throw new Error("Something went wrong");
      // }
    } catch (error: any) {
      switch (error.code) {
        case statusCodes.SIGN_IN_CANCELLED:
          break;
        case statusCodes.IN_PROGRESS:
          failure();
          break;
        case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
          failure();
          break;
        default:
          failure();
          break;
      }
    }
  },
};
