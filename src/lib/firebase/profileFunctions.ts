import {
  addDoc,
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../firebase";

import { Level } from "@/types/levels";
import { fetchCollectionData } from "./commonFunctions";

export async function getUserProfile(email: string) {
  try {
    const profile = await fetchCollectionData("profile", {
      fieldPath: "email",
      operator: "==",
      value: email,
    });
    return profile.length > 0 ? profile[0] : null;
  } catch (err) {
    console.error("[FIREBASE]: ", err);
    throw new Error("Error fetching user profile.");
  }
}

export async function initializeUserProfile(email: string) {
  try {
    const existingProfile = await getUserProfile(email);

    if (!existingProfile) {
      const newProfile = {
        email,
        classicQuizCompleted: 0,
        guessTheLocationCompleted: 0,
        elementsAlikeCompleted: 0,
        timeSpent: 0,
        points: 0,
        easy: 0,
        medium: 0,
        hard: 0,
        nickname: "",
        rank: "New",
      };

      await addDoc(collection(db, "profile"), newProfile);
      console.log("User profile initialized:", newProfile);
    } else {
      console.log("User profile already exists.");
    }
  } catch (err) {
    console.error("[FIREBASE]: Error initializing user profile:", err);
    throw new Error("Unable to initialize user profile.");
  }
}

export async function incrementClassicQuizCompleted(
  email: string,
  level: Level
) {
  try {
    const profileQuery = query(
      collection(db, "profile"),
      where("email", "==", email)
    );
    const querySnapshot = await getDocs(profileQuery);

    if (querySnapshot.empty) {
      console.error("Profile not found for email:", email);
      throw new Error("Profile not found");
    }

    const docRef = querySnapshot.docs[0].ref;
    const data = querySnapshot.docs[0].data();

    const commonLevelField = `${level.toLowerCase()}`;

    await updateDoc(docRef, {
      classicQuizCompleted: (data.classicQuizCompleted || 0) + 1,
      [commonLevelField.toLowerCase()]: (data[commonLevelField] || 0) + 1,
      points:
        (data.points || 0) +
        10 * (level === "Easy" ? 1 : level === "Medium" ? 2 : 3),
    });

    console.log(
      `Classic quiz completion incremented for ${email} (Level: ${level})`
    );
  } catch (error) {
    console.error(
      "[FIREBASE]: Error incrementing classic quiz completion:",
      error
    );
    throw new Error("Unable to increment classic quiz completion");
  }
}

export async function incrementGuessTheLocationCompleted(
  email: string,
  level: Level
) {
  try {
    const profileQuery = query(
      collection(db, "profile"),
      where("email", "==", email)
    );
    const querySnapshot = await getDocs(profileQuery);

    if (querySnapshot.empty) {
      console.error("Profile not found for email:", email);
      throw new Error("Profile not found");
    }

    const docRef = querySnapshot.docs[0].ref;
    const data = querySnapshot.docs[0].data();

    const commonLevelField = `${level.toLowerCase()}`;

    await updateDoc(docRef, {
      guessTheLocationCompleted: (data.guessTheLocationCompleted || 0) + 1,
      [commonLevelField.toLowerCase()]: (data[commonLevelField] || 0) + 1,
      points:
        (data.points || 0) +
        10 * (level === "Easy" ? 1 : level === "Medium" ? 2 : 3),
    });

    console.log(
      `Guess the location completion incremented for ${email} (Level: ${level})`
    );
  } catch (error) {
    console.error(
      "[FIREBASE]: Error incrementing guess the location completion:",
      error
    );
    throw new Error("Unable to increment guess the location completion");
  }
}
export async function incrementElementsAlikeCompleted(
  email: string,
  level: Level
) {
  try {
    const profileQuery = query(
      collection(db, "profile"),
      where("email", "==", email)
    );
    const querySnapshot = await getDocs(profileQuery);

    if (querySnapshot.empty) {
      console.error("Profile not found for email:", email);
      throw new Error("Profile not found");
    }

    const docRef = querySnapshot.docs[0].ref;
    const data = querySnapshot.docs[0].data();

    const commonLevelField = `${level.toLowerCase()}`;

    await updateDoc(docRef, {
      elementsAlikeCompleted: (data.elementsAlikeCompleted || 0) + 1,
      [commonLevelField.toLowerCase()]: (data[commonLevelField] || 0) + 1,
      points:
        (data.points || 0) +
        10 * (level === "Easy" ? 1 : level === "Medium" ? 2 : 3),
    });

    console.log(
      `ElementsAlike completion incremented for ${email} (Level: ${level})`
    );
  } catch (error) {
    console.error(
      "[FIREBASE]: Error incrementing elementsAlikeCompleted completion:",
      error
    );
    throw new Error("Unable to increment elementsAlikeCompleted completion");
  }
}

export async function incrementTimeSpent(email: string, timeInMinutes: number) {
  try {
    console.log(timeInMinutes);
    const profileQuery = query(
      collection(db, "profile"),
      where("email", "==", email)
    );
    const querySnapshot = await getDocs(profileQuery);

    if (querySnapshot.empty) {
      console.error("Profile not found for email:", email);
      throw new Error("Profile not found");
    }

    const docRef = querySnapshot.docs[0].ref;

    await updateDoc(docRef, {
      timeSpent: (querySnapshot.docs[0].data().timeSpent || 0) + timeInMinutes,
    });

    console.log(
      `Time spent incremented by ${timeInMinutes} minutes for ${email}`
    );
  } catch (error) {
    console.error("[FIREBASE]: Error incrementing time spent:", error);
    throw new Error("Unable to increment time spent");
  }
}

export async function getLeaderboard() {
  try {
    const profilesQuery = query(
      collection(db, "profile"),
      orderBy("points", "desc"),
      limit(50)
    );

    const querySnapshot = await getDocs(profilesQuery);

    if (querySnapshot.empty) {
      console.log("[FIREBASE]: No profiles found.");
      return [];
    }

    const leaderboard = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        email: data.email || "Unknown",
        classicQuizCompleted: data.classicQuizCompleted || 0,
        guessTheLocationCompleted: data.guessTheLocationCompleted || 0,
        points: data.points,
        nickname: data.nickname || "Unknown",
        totalScore:
          (data.classicQuizCompleted || 0) +
          (data.guessTheLocationCompleted || 0),
      };
    });

    leaderboard.sort((a, b) => b.points - a.points);

    console.log("[FIREBASE]: Leaderboard generated successfully.");
    return leaderboard;
  } catch (error) {
    console.error("[FIREBASE]: Error fetching leaderboard:", error);
    throw new Error("Unable to fetch leaderboard");
  }
}

export async function updateNickname(email: string, nickname: string) {
  try {
    const profileQuery = query(
      collection(db, "profile"),
      where("email", "==", email)
    );
    const querySnapshot = await getDocs(profileQuery);

    if (querySnapshot.empty) {
      console.error("Profile not found for email:", email);
      throw new Error("Profile not found");
    }

    const docRef = querySnapshot.docs[0].ref;
    await updateDoc(docRef, {
      nickname: nickname,
    });

    console.log(`Nickname updated to ${nickname} for ${email}`);
    return true;
  } catch (error) {
    console.error("[FIREBASE]: Error updating nickname:", error);
    throw new Error("Unable to update nickname");
  }
}
export async function updateRank(email: string, points?: number) {
  try {
    const profileQuery = query(
      collection(db, "profile"),
      where("email", "==", email)
    );
    const querySnapshot = await getDocs(profileQuery);

    if (querySnapshot.empty) {
      console.error("Profile not found for email:", email);
      throw new Error("Profile not found");
    }

    const docRef = querySnapshot.docs[0].ref;
    const data = querySnapshot.docs[0].data();
    const profilePoints = points ?? data.points ?? 0;

    let newRank = "Bronze";

    if (profilePoints > 500) {
      newRank = "Platinum";
    } else if (profilePoints <= 400 && profilePoints > 200) {
      newRank = "Gold";
    } else if (profilePoints <= 200 && profilePoints > 100) {
      newRank = "Silver";
    } else if (profilePoints <= 100) {
      newRank = "Bronze";
    }

    await updateDoc(docRef, {
      rank: newRank,
    });

    console.log(`Rank updated to ${newRank} for ${email}`);
    return newRank;
  } catch (error) {
    console.error("[FIREBASE]: Error updating rank:", error);
    throw new Error("Unable to update rank");
  }
}

export async function incrementPoints(email: string, points: number) {
  try {
    console.log(points);
    const profileQuery = query(
      collection(db, "profile"),
      where("email", "==", email)
    );
    const querySnapshot = await getDocs(profileQuery);
    if (querySnapshot.empty) {
      console.error("Profile not found for email:", email);
      throw new Error("Profile not found");
    }
    const docRef = querySnapshot.docs[0].ref;
    await updateDoc(docRef, {
      points: (querySnapshot.docs[0].data().points || 0) + points,
    });
    console.log(`Points incremented by ${points} for ${email}`);
  } catch (error) {
    console.error("[FIREBASE]: Error incrementing points:", error);
    throw new Error("Unable to increment points");
  }
}
