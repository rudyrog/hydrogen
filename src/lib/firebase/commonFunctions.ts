import { db } from "../firebase.ts";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  setDoc,
  query,
  where,
  WhereFilterOp,
} from "firebase/firestore";

type WhereClause = {
  fieldPath: string;
  operator: WhereFilterOp;
  value: any;
};

export const fetchCollectionData = async (
  collectionName: string,
  whereClause?: WhereClause,
) => {
  try {
    let q;
    if (whereClause) {
      const { fieldPath, operator, value } = whereClause;
      q = query(
        collection(db, collectionName),
        where(fieldPath, operator, value),
      );
    } else {
      q = collection(db, collectionName);
    }

    const querySnapshot = await getDocs(q);
    const data: any[] = [];
    querySnapshot.forEach((doc) => {
      data.push({ id: doc.id, ...doc.data() });
    });

    return data;
  } catch (error) {
    console.error("Error fetching collection data:", error);
    throw new Error("Unable to fetch collection data.");
  }
};

export const writeData = async (
  collectionName: string,
  documentId: string,
  data: object,
) => {
  try {
    await setDoc(doc(collection(db, collectionName), documentId), data);
    return { success: true, message: "Data written successfully." };
  } catch (error) {
    console.error("Error writing data:", error);
    throw new Error("Unable to write data.");
  }
};

export const updateData = async (
  collectionName: string,
  documentId: string,
  updatedData: object,
) => {
  try {
    const docRef = doc(db, collectionName, documentId);
    await updateDoc(docRef, updatedData);
    return { success: true, message: "Data updated successfully." };
  } catch (error) {
    console.error("Error updating data:", error);
    throw new Error("Unable to update data.");
  }
};
