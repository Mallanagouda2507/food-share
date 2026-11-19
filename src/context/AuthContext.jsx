import React, { createContext, useContext, useState, useEffect } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db, isFirebaseLive } from "../services/firebase";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

const LOCAL_AUTH_USER_KEY = "foodshare_auth_user";
const LOCAL_USERS_KEY = "foodshare_users_db";

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sync user profile from Firestore or local fallback
  const fetchUserProfile = async (uid, fallbackUser = null) => {
    if (isFirebaseLive() && db) {
      try {
        const userDocRef = doc(db, "users", uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          const data = userDocSnap.data();
          setUserProfile(data);
          return data;
        }
      } catch (err) {
        console.warn("Error fetching Firestore user profile:", err);
      }
    }

    // Fallback mode profile fetch
    const usersStr = localStorage.getItem(LOCAL_USERS_KEY);
    const users = usersStr ? JSON.parse(usersStr) : [];
    const localProfile = users.find((u) => u.uid === uid);

    if (localProfile) {
      setUserProfile(localProfile);
      return localProfile;
    }

    if (fallbackUser) {
      const defaultProfile = {
        uid,
        name: fallbackUser.displayName || fallbackUser.name || "FoodShare Member",
        email: fallbackUser.email,
        phone: fallbackUser.phone || "",
        role: fallbackUser.role || "Receiver",
        createdAt: new Date().toISOString(),
      };
      users.push(defaultProfile);
      localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(users));
      setUserProfile(defaultProfile);
      return defaultProfile;
    }

    return null;
  };

  useEffect(() => {
    if (isFirebaseLive() && auth) {
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        setCurrentUser(user);
        if (user) {
          await fetchUserProfile(user.uid, user);
        } else {
          setUserProfile(null);
        }
        setLoading(false);
      });
      return unsubscribe;
    } else {
      // Local fallback mode initial load
      const savedUser = localStorage.getItem(LOCAL_AUTH_USER_KEY);
      if (savedUser) {
        try {
          const parsed = JSON.parse(savedUser);
          setCurrentUser(parsed);
          fetchUserProfile(parsed.uid, parsed);
        } catch (e) {
          localStorage.removeItem(LOCAL_AUTH_USER_KEY);
        }
      }
      setLoading(false);
    }
  }, []);

  /**
   * Register new user with email, password, role, name, and phone
   */
  const register = async ({ email, password, name, phone, role }) => {
    if (isFirebaseLive() && auth && db) {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await updateProfile(user, { displayName: name });

      const profileData = {
        uid: user.uid,
        name,
        email,
        phone: phone || "",
        role: role || "Receiver",
        createdAt: new Date().toISOString(),
      };

      await setDoc(doc(db, "users", user.uid), profileData);
      setUserProfile(profileData);
      setCurrentUser(user);
      return user;
    }

    // Local fallback registration
    const dummyUid = `user-${Date.now()}`;
    const newUser = {
      uid: dummyUid,
      email,
      displayName: name,
      name,
      phone: phone || "",
      role: role || "Receiver",
      createdAt: new Date().toISOString(),
    };

    const usersStr = localStorage.getItem(LOCAL_USERS_KEY);
    const users = usersStr ? JSON.parse(usersStr) : [];
    users.push(newUser);
    localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(users));

    localStorage.setItem(LOCAL_AUTH_USER_KEY, JSON.stringify(newUser));
    setCurrentUser(newUser);
    setUserProfile(newUser);
    return newUser;
  };

  /**
   * Login user
   */
  const login = async (email, password) => {
    if (isFirebaseLive() && auth) {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      setCurrentUser(user);
      await fetchUserProfile(user.uid, user);
      return user;
    }

    // Local fallback login
    const usersStr = localStorage.getItem(LOCAL_USERS_KEY);
    const users = usersStr ? JSON.parse(usersStr) : [];
    const matched = users.find((u) => u.email.toLowerCase() === email.toLowerCase());

    const userObj = matched || {
      uid: `user-${Date.now()}`,
      email,
      displayName: email.split("@")[0],
      name: email.split("@")[0],
      role: email.includes("donor") ? "Donor" : email.includes("admin") ? "Admin" : "Receiver",
      phone: "+1 (555) 019-2831",
      createdAt: new Date().toISOString(),
    };

    localStorage.setItem(LOCAL_AUTH_USER_KEY, JSON.stringify(userObj));
    setCurrentUser(userObj);
    setUserProfile(userObj);
    return userObj;
  };

  /**
   * Demo one-click login for swift testing & evaluation
   */
  const loginAsDemo = (role = "Donor") => {
    const demoAccounts = {
      Donor: {
        uid: "demo-donor-001",
        email: "donor@foodshare.org",
        displayName: "Sarah Jenkins (Community Kitchen)",
        name: "Sarah Jenkins",
        phone: "+1 (555) 234-5678",
        role: "Donor",
      },
      Receiver: {
        uid: "demo-receiver-001",
        email: "receiver@foodshare.org",
        displayName: "Hope Valley Food Pantry",
        name: "Hope Valley Food Pantry",
        phone: "+1 (555) 876-5432",
        role: "Receiver",
      },
      Admin: {
        uid: "demo-admin-001",
        email: "admin@foodshare.org",
        displayName: "FoodShare Platform Admin",
        name: "Platform Admin",
        phone: "+1 (555) 999-0000",
        role: "Admin",
      },
    };

    const account = demoAccounts[role] || demoAccounts.Donor;
    localStorage.setItem(LOCAL_AUTH_USER_KEY, JSON.stringify(account));
    setCurrentUser(account);
    setUserProfile(account);
    return account;
  };

  /**
   * Logout user
   */
  const logout = async () => {
    if (isFirebaseLive() && auth) {
      await signOut(auth);
    }
    localStorage.removeItem(LOCAL_AUTH_USER_KEY);
    setCurrentUser(null);
    setUserProfile(null);
  };

  const value = {
    currentUser,
    userProfile,
    role: userProfile?.role || "Receiver",
    isDonor: userProfile?.role === "Donor" || userProfile?.role === "Admin",
    isReceiver: userProfile?.role === "Receiver" || userProfile?.role === "Admin",
    isAdmin: userProfile?.role === "Admin",
    loading,
    isFirebaseLive: isFirebaseLive(),
    login,
    register,
    logout,
    loginAsDemo,
    fetchUserProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
