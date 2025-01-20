import { auth, provider, signInWithPopup } from "../lib/firebase";
import { initializeUserProfile } from "../lib/firebase/profileFunctions";

const SignInButton: React.FC = () => {
  const handleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      if (user.email) {
        console.log("User Info:", user);

        await initializeUserProfile(user.email);
      } else {
        console.error("User email not available.");
      }
    } catch (error) {
      console.error("Error signing in:", error);
    }
  };

  return <button onClick={handleSignIn}>Sign in with Google</button>;
};

export default SignInButton;
