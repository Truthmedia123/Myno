import { useState, useEffect } from "react";
import { db } from "../lib/firebase";
import { collection, query, where, getDocs, addDoc, updateDoc, doc, deleteDoc, orderBy, limit } from "firebase/firestore";
import { useAuth } from "../lib/AuthContext";

export function useFirebaseDatabase() {
  const { user } = useAuth();

  // ----- USER PROFILE LOGIC -----
  const getUserProfile = async () => {
    if (!user) return null;
    const q = query(collection(db, "userProfiles"), where("userId", "==", user.uid), limit(1));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const docSnap = querySnapshot.docs[0];
      return { id: docSnap.id, ...docSnap.data() };
    }
    return null;
  };

  const createUserProfile = async (profileData) => {
    if (!user) return null;
    const docRef = await addDoc(collection(db, "userProfiles"), {
      ...profileData,
      userId: user.uid,
      created_date: new Date().toISOString()
    });
    return { id: docRef.id, ...profileData, userId: user.uid };
  };

  const updateUserProfile = async (profileId, data) => {
    const profileRef = doc(db, "userProfiles", profileId);
    await updateDoc(profileRef, data);
  };

  // ----- SAVED WORDS LOGIC -----
  const getSavedWords = async () => {
    if (!user) return [];
    const q = query(
      collection(db, "savedWords"), 
      where("userId", "==", user.uid),
      orderBy("created_date", "desc")
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
  };

  const createSavedWord = async (wordData) => {
    if (!user) return null;
    const docRef = await addDoc(collection(db, "savedWords"), {
      ...wordData,
      userId: user.uid,
      created_date: new Date().toISOString()
    });
    return { id: docRef.id, ...wordData, userId: user.uid };
  };

  const deleteSavedWord = async (wordId) => {
    await deleteDoc(doc(db, "savedWords", wordId));
  };
  
  const updateSavedWord = async (wordId, data) => {
    await updateDoc(doc(db, "savedWords", wordId), data);
  };

  // ----- CHAT MESSAGES LOGIC -----
  const getChatMessages = async (sessionId) => {
    if (!user) return [];
    const q = query(
      collection(db, "chatMessages"), 
      where("sessionId", "==", sessionId),
      orderBy("created_date", "asc")
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
  };

  const createChatMessage = async (messageData) => {
    if (!user) return null;
    const docRef = await addDoc(collection(db, "chatMessages"), {
      ...messageData,
      userId: user.uid,
      created_date: new Date().toISOString()
    });
    return { id: docRef.id, ...messageData, userId: user.uid };
  };

  return {
    getUserProfile,
    createUserProfile,
    updateUserProfile,
    getSavedWords,
    createSavedWord,
    updateSavedWord,
    deleteSavedWord,
    getChatMessages,
    createChatMessage
  };
}
