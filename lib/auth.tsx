"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "./firebase";
import { UserProfile } from "../types";

interface AuthContextType {
  user: FirebaseUser | null;
  userProfile: UserProfile | null;
  loading: boolean;
  signUpWithEmail: (email: string, password: string, name: string) => Promise<FirebaseUser>;
  logInWithEmail: (email: string, password: string) => Promise<FirebaseUser>;
  signInWithGoogle: () => Promise<FirebaseUser>;
  logOut: () => Promise<void>;
  updateProfileData: (name: string, photoURL: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Sync user profile to Firestore
  const syncUserProfile = async (firebaseUser: FirebaseUser, customName?: string) => {
    const userDocRef = doc(db, "users", firebaseUser.uid);
    const profileData: UserProfile = {
      uid: firebaseUser.uid,
      displayName: customName || firebaseUser.displayName || firebaseUser.email?.split("@")[0] || "Gardener",
      email: firebaseUser.email || "",
      photoURL: firebaseUser.photoURL || `https://api.dicebear.com/7.x/adventurer/svg?seed=${firebaseUser.uid}`,
    };

    await setDoc(userDocRef, profileData, { merge: true });
    setUserProfile(profileData);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        // Fetch existing profile or sync
        const userDocRef = doc(db, "users", firebaseUser.uid);
        const userSnap = await getDoc(userDocRef);
        if (userSnap.exists()) {
          setUserProfile(userSnap.data() as UserProfile);
        } else {
          await syncUserProfile(firebaseUser);
        }
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signUpWithEmail = async (email: string, password: string, name: string) => {
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      
      // Update profile in Auth
      await updateProfile(firebaseUser, { displayName: name });
      
      // Sync to Firestore
      await syncUserProfile(firebaseUser, name);
      return firebaseUser;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logInWithEmail = async (email: string, password: string) => {
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      
      // Sync profile
      await syncUserProfile(firebaseUser);
      return firebaseUser;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      const firebaseUser = userCredential.user;
      
      // Sync profile
      await syncUserProfile(firebaseUser);
      return firebaseUser;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logOut = async () => {
    setLoading(true);
    await signOut(auth);
    setUser(null);
    setUserProfile(null);
    setLoading(false);
  };

  const updateProfileData = async (name: string, photoURL: string) => {
    if (!user) throw new Error("No authenticated user");
    
    await updateProfile(user, {
      displayName: name.trim(),
      photoURL: photoURL.trim(),
    });

    const userDocRef = doc(db, "users", user.uid);
    const updatedProfile: UserProfile = {
      uid: user.uid,
      displayName: name.trim(),
      email: user.email || "",
      photoURL: photoURL.trim(),
    };
    await setDoc(userDocRef, updatedProfile, { merge: true });
    setUserProfile(updatedProfile);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userProfile,
        loading,
        signUpWithEmail,
        logInWithEmail,
        signInWithGoogle,
        logOut,
        updateProfileData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
