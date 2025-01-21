"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { getUserProfile } from "@/lib/firebase/profileFunctions";
import { Profile } from "@/types/profile";

interface AuthContextValue {
  user: {
    name: string;
    email: string;
  } | null;
  profile: Profile | null;
  setProfile: (profile: Profile | null) => void;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  profile: null,
  setProfile: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<AuthContextValue["user"]>(null);
  const [profile, setProfile] = useState<AuthContextValue["profile"]>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      if (currentUser) {
        const userDetails = {
          name: currentUser.displayName || "User",
          email: currentUser.email || "Unknown",
        };
        setUser(userDetails);

        try {
          const userProfile = await getUserProfile(userDetails.email);
          setProfile(userProfile);
        } catch (error) {
          console.error("Error fetching user profile:", error);
          setProfile(null);
        }
      } else {
        setUser(null);
        setProfile(null);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, profile, setProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
