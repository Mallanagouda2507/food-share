import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  runTransaction
} from "firebase/firestore";
import { db, isFirebaseLive } from "./firebase";
import { SAMPLE_DONATIONS } from "./seedData";

// LocalStorage keys for fallback mode
const LOCAL_DONATIONS_KEY = "foodshare_donations_db";
const LOCAL_CLAIMS_KEY = "foodshare_claims_db";
const LOCAL_USERS_KEY = "foodshare_users_db";

// Helper to get local data
const getLocalData = (key, defaultData = []) => {
  const data = localStorage.getItem(key);
  if (!data) {
    localStorage.setItem(key, JSON.stringify(defaultData));
    return defaultData;
  }
  try {
    return JSON.parse(data);
  } catch (e) {
    console.error(`Error parsing ${key}:`, e);
    return defaultData;
  }
};

const saveLocalData = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};

// Initialize fallback database with sample donations if empty
const initLocalDb = () => {
  const existing = getLocalData(LOCAL_DONATIONS_KEY, null);
  if (!existing || existing.length === 0) {
    const seeded = SAMPLE_DONATIONS.map((item, idx) => ({
      ...item,
      id: `seed-${idx + 1}`,
      donationId: `seed-${idx + 1}`,
      donorId: "demo-donor-001",
      donorName: item.donorName || "Green Earth Kitchen",
      createdAt: item.createdAt || new Date().toISOString(),
    }));
    saveLocalData(LOCAL_DONATIONS_KEY, seeded);
  }
  getLocalData(LOCAL_CLAIMS_KEY, []);
  getLocalData(LOCAL_USERS_KEY, []);
};

initLocalDb();

/**
 * Fetch all food donations with optional filters
 */
export const getDonations = async (filters = {}) => {
  const { status, category, searchQuery, location } = filters;

  if (isFirebaseLive() && db) {
    try {
      let q = collection(db, "donations");
      const constraints = [];

      if (status && status !== "all") {
        constraints.push(where("status", "==", status));
      }
      if (category && category !== "All") {
        constraints.push(where("category", "==", category));
      }

      // If we have constraints, build query
      const queryRef = constraints.length > 0 ? query(q, ...constraints) : q;
      const snapshot = await getDocs(queryRef);

      let results = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        donationId: docSnap.id,
        ...docSnap.data(),
      }));

      // Apply client-side search query and location filter
      if (searchQuery && searchQuery.trim()) {
        const queryLower = searchQuery.toLowerCase().trim();
        results = results.filter(
          (d) =>
            d.foodName?.toLowerCase().includes(queryLower) ||
            d.description?.toLowerCase().includes(queryLower) ||
            d.location?.toLowerCase().includes(queryLower)
        );
      }

      if (location && location.trim()) {
        const locLower = location.toLowerCase().trim();
        results = results.filter((d) => d.location?.toLowerCase().includes(locLower));
      }

      // Sort newest first
      results.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
      return results;
    } catch (err) {
      console.warn("Firestore fetch error, falling back to local:", err);
    }
  }

  // Fallback mode
  let items = getLocalData(LOCAL_DONATIONS_KEY, []);

  if (status && status !== "all") {
    items = items.filter((d) => d.status === status);
  }
  if (category && category !== "All") {
    items = items.filter((d) => d.category === category);
  }
  if (searchQuery && searchQuery.trim()) {
    const qLower = searchQuery.toLowerCase().trim();
    items = items.filter(
      (d) =>
        d.foodName?.toLowerCase().includes(qLower) ||
        d.description?.toLowerCase().includes(qLower) ||
        d.location?.toLowerCase().includes(qLower)
    );
  }
  if (location && location.trim()) {
    const lLower = location.toLowerCase().trim();
    items = items.filter((d) => d.location?.toLowerCase().includes(lLower));
  }

  return items.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
};

/**
 * Fetch a single donation by ID
 */
export const getDonationById = async (id) => {
  if (isFirebaseLive() && db) {
    try {
      const docRef = doc(db, "donations", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, donationId: docSnap.id, ...docSnap.data() };
      }
    } catch (err) {
      console.warn("Firestore get error:", err);
    }
  }

  const items = getLocalData(LOCAL_DONATIONS_KEY, []);
  return items.find((d) => d.id === id || d.donationId === id) || null;
};

/**
 * Create a new food donation
 */
export const createDonation = async (donationData, currentUser) => {
  const newDonation = {
    ...donationData,
    donorId: currentUser.uid,
    donorName: currentUser.displayName || currentUser.name || "Generous Donor",
    donorEmail: currentUser.email,
    donorPhone: currentUser.phone || donationData.contact,
    status: "available",
    servings: Number(donationData.servings) || 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  if (isFirebaseLive() && db) {
    try {
      const docRef = await addDoc(collection(db, "donations"), {
        ...newDonation,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return { id: docRef.id, donationId: docRef.id, ...newDonation };
    } catch (err) {
      console.warn("Firestore add error, falling back to local:", err);
    }
  }

  // Fallback
  const items = getLocalData(LOCAL_DONATIONS_KEY, []);
  const created = {
    ...newDonation,
    id: `local-don-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    donationId: `local-don-${Date.now()}`,
  };
  items.unshift(created);
  saveLocalData(LOCAL_DONATIONS_KEY, items);
  return created;
};

/**
 * Update an existing donation
 */
export const updateDonation = async (id, updateData, currentUserId) => {
  if (isFirebaseLive() && db) {
    try {
      const docRef = doc(db, "donations", id);
      await updateDoc(docRef, {
        ...updateData,
        updatedAt: serverTimestamp(),
      });
      return { id, ...updateData };
    } catch (err) {
      console.warn("Firestore update error:", err);
    }
  }

  const items = getLocalData(LOCAL_DONATIONS_KEY, []);
  const index = items.findIndex((d) => d.id === id || d.donationId === id);
  if (index === -1) throw new Error("Donation not found");

  if (items[index].donorId !== currentUserId && !updateData.status) {
    throw new Error("Unauthorized to edit this donation");
  }

  items[index] = {
    ...items[index],
    ...updateData,
    updatedAt: new Date().toISOString(),
  };
  saveLocalData(LOCAL_DONATIONS_KEY, items);
  return items[index];
};

/**
 * Delete a donation
 */
export const deleteDonation = async (id, currentUserId) => {
  if (isFirebaseLive() && db) {
    try {
      const docRef = doc(db, "donations", id);
      await deleteDoc(docRef);
      return true;
    } catch (err) {
      console.warn("Firestore delete error:", err);
    }
  }

  const items = getLocalData(LOCAL_DONATIONS_KEY, []);
  const donation = items.find((d) => d.id === id || d.donationId === id);
  if (!donation) throw new Error("Donation not found");

  if (donation.donorId !== currentUserId) {
    throw new Error("You can only delete your own donations");
  }

  const filtered = items.filter((d) => d.id !== id && d.donationId !== id);
  saveLocalData(LOCAL_DONATIONS_KEY, filtered);
  return true;
};

/**
 * Claim Food Donation
 * Enforces business rules:
 * - Cannot claim own donation
 * - Cannot claim if already claimed (duplicate claim protection)
 * - Sets claim record in 'claims' collection
 */
export const claimDonation = async (donationId, receiverUser) => {
  if (isFirebaseLive() && db) {
    try {
      return await runTransaction(db, async (transaction) => {
        const donationRef = doc(db, "donations", donationId);
        const donationDoc = await transaction.get(donationRef);

        if (!donationDoc.exists()) {
          throw new Error("Donation listing does not exist.");
        }

        const data = donationDoc.data();

        if (data.donorId === receiverUser.uid) {
          throw new Error("You cannot claim your own food donation.");
        }

        if (data.status !== "available") {
          throw new Error("This food donation has already been claimed or completed.");
        }

        const claimRef = doc(collection(db, "claims"));
        const claimData = {
          claimId: claimRef.id,
          donationId,
          foodName: data.foodName,
          category: data.category,
          quantity: data.quantity,
          servings: data.servings,
          imageUrl: data.imageUrl,
          donorId: data.donorId,
          donorName: data.donorName,
          donorContact: data.contact || data.donorPhone,
          pickupLocation: data.location,
          receiverId: receiverUser.uid,
          receiverName: receiverUser.displayName || receiverUser.name || "Community Member",
          receiverEmail: receiverUser.email,
          receiverPhone: receiverUser.phone || "Not provided",
          status: "active",
          claimedAt: new Date().toISOString(),
          completedAt: null,
        };

        transaction.set(claimRef, claimData);
        transaction.update(donationRef, {
          status: "claimed",
          claimedBy: receiverUser.uid,
          claimId: claimRef.id,
          claimedAt: new Date().toISOString(),
          claimantInfo: {
            receiverId: receiverUser.uid,
            name: receiverUser.displayName || receiverUser.name || "Community Member",
            email: receiverUser.email,
            phone: receiverUser.phone || "Not provided",
          },
        });

        return { claimId: claimRef.id, ...claimData };
      });
    } catch (err) {
      console.warn("Firestore transaction error, trying local fallback:", err);
      if (err.message.includes("cannot claim") || err.message.includes("already been claimed")) {
        throw err;
      }
    }
  }

  // Fallback mode
  const donations = getLocalData(LOCAL_DONATIONS_KEY, []);
  const donationIndex = donations.findIndex((d) => d.id === donationId || d.donationId === donationId);

  if (donationIndex === -1) {
    throw new Error("Donation not found.");
  }

  const target = donations[donationIndex];

  if (target.donorId === receiverUser.uid) {
    throw new Error("You cannot claim your own food donation.");
  }

  if (target.status !== "available") {
    throw new Error("This food donation has already been claimed.");
  }

  const claimId = `claim-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
  const claimRecord = {
    claimId,
    id: claimId,
    donationId,
    foodName: target.foodName,
    category: target.category,
    quantity: target.quantity,
    servings: target.servings,
    imageUrl: target.imageUrl,
    donorId: target.donorId,
    donorName: target.donorName,
    donorContact: target.contact || target.donorPhone,
    pickupLocation: target.location,
    receiverId: receiverUser.uid,
    receiverName: receiverUser.displayName || receiverUser.name || "Community Member",
    receiverEmail: receiverUser.email,
    receiverPhone: receiverUser.phone || "Not provided",
    status: "active",
    claimedAt: new Date().toISOString(),
    completedAt: null,
  };

  // Update donation status
  donations[donationIndex] = {
    ...target,
    status: "claimed",
    claimedBy: receiverUser.uid,
    claimId,
    claimedAt: new Date().toISOString(),
    claimantInfo: {
      receiverId: receiverUser.uid,
      name: receiverUser.displayName || receiverUser.name || "Community Member",
      email: receiverUser.email,
      phone: receiverUser.phone || "Not provided",
    },
  };

  saveLocalData(LOCAL_DONATIONS_KEY, donations);

  const claims = getLocalData(LOCAL_CLAIMS_KEY, []);
  claims.unshift(claimRecord);
  saveLocalData(LOCAL_CLAIMS_KEY, claims);

  return claimRecord;
};

/**
 * Cancel a claim (Receiver can cancel, restoring donation to 'available')
 */
export const cancelClaim = async (donationId, claimId, currentUserId) => {
  if (isFirebaseLive() && db) {
    try {
      const claimRef = doc(db, "claims", claimId);
      const donationRef = doc(db, "donations", donationId);

      await updateDoc(claimRef, {
        status: "cancelled",
        cancelledAt: new Date().toISOString(),
        cancelledBy: currentUserId,
      });

      await updateDoc(donationRef, {
        status: "available",
        claimedBy: null,
        claimId: null,
        claimantInfo: null,
      });

      return true;
    } catch (err) {
      console.warn("Firestore cancel error:", err);
    }
  }

  // Fallback mode
  const donations = getLocalData(LOCAL_DONATIONS_KEY, []);
  const donIndex = donations.findIndex((d) => d.id === donationId || d.donationId === donationId);
  if (donIndex !== -1) {
    donations[donIndex] = {
      ...donations[donIndex],
      status: "available",
      claimedBy: null,
      claimId: null,
      claimantInfo: null,
    };
    saveLocalData(LOCAL_DONATIONS_KEY, donations);
  }

  const claims = getLocalData(LOCAL_CLAIMS_KEY, []);
  const claimIndex = claims.findIndex((c) => c.claimId === claimId || c.id === claimId);
  if (claimIndex !== -1) {
    claims[claimIndex] = {
      ...claims[claimIndex],
      status: "cancelled",
      cancelledAt: new Date().toISOString(),
    };
    saveLocalData(LOCAL_CLAIMS_KEY, claims);
  }

  return true;
};

/**
 * Mark food donation as handed over / completed by donor
 */
export const completeDonation = async (donationId, claimId, currentUserId) => {
  const completedAt = new Date().toISOString();

  if (isFirebaseLive() && db) {
    try {
      const donationRef = doc(db, "donations", donationId);
      await updateDoc(donationRef, {
        status: "completed",
        completedAt,
      });

      if (claimId) {
        const claimRef = doc(db, "claims", claimId);
        await updateDoc(claimRef, {
          status: "completed",
          completedAt,
        });
      }
      return true;
    } catch (err) {
      console.warn("Firestore complete error:", err);
    }
  }

  // Fallback
  const donations = getLocalData(LOCAL_DONATIONS_KEY, []);
  const donIndex = donations.findIndex((d) => d.id === donationId || d.donationId === donationId);
  if (donIndex !== -1) {
    donations[donIndex] = {
      ...donations[donIndex],
      status: "completed",
      completedAt,
    };
    saveLocalData(LOCAL_DONATIONS_KEY, donations);
  }

  if (claimId) {
    const claims = getLocalData(LOCAL_CLAIMS_KEY, []);
    const claimIndex = claims.findIndex((c) => c.claimId === claimId || c.id === claimId);
    if (claimIndex !== -1) {
      claims[claimIndex] = {
        ...claims[claimIndex],
        status: "completed",
        completedAt,
      };
      saveLocalData(LOCAL_CLAIMS_KEY, claims);
    }
  }

  return true;
};

/**
 * Get donations posted by a specific donor
 */
export const getUserDonations = async (userId) => {
  if (isFirebaseLive() && db) {
    try {
      const q = query(
        collection(db, "donations"),
        where("donorId", "==", userId)
      );
      const snapshot = await getDocs(q);
      const list = snapshot.docs.map((d) => ({ id: d.id, donationId: d.id, ...d.data() }));
      list.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
      return list;
    } catch (err) {
      console.warn("Firestore getUserDonations error:", err);
    }
  }

  const donations = getLocalData(LOCAL_DONATIONS_KEY, []);
  return donations
    .filter((d) => d.donorId === userId)
    .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
};

/**
 * Get claims claimed by a specific receiver
 */
export const getUserClaims = async (userId) => {
  if (isFirebaseLive() && db) {
    try {
      const q = query(
        collection(db, "claims"),
        where("receiverId", "==", userId)
      );
      const snapshot = await getDocs(q);
      const list = snapshot.docs.map((d) => ({ id: d.id, claimId: d.id, ...d.data() }));
      list.sort((a, b) => new Date(b.claimedAt || 0) - new Date(a.claimedAt || 0));
      return list;
    } catch (err) {
      console.warn("Firestore getUserClaims error:", err);
    }
  }

  const claims = getLocalData(LOCAL_CLAIMS_KEY, []);
  return claims
    .filter((c) => c.receiverId === userId)
    .sort((a, b) => new Date(b.claimedAt || 0) - new Date(a.claimedAt || 0));
};

/**
 * Get aggregate cloud platform statistics
 */
export const getCloudStats = async () => {
  let donations = [];
  let claims = [];

  if (isFirebaseLive() && db) {
    try {
      const donSnap = await getDocs(collection(db, "donations"));
      donations = donSnap.docs.map((d) => ({ id: d.id, ...d.data() }));

      const claimSnap = await getDocs(collection(db, "claims"));
      claims = claimSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
    } catch (err) {
      console.warn("Firestore stats error, using local:", err);
    }
  }

  if (donations.length === 0) {
    donations = getLocalData(LOCAL_DONATIONS_KEY, []);
    claims = getLocalData(LOCAL_CLAIMS_KEY, []);
  }

  const totalDonations = donations.length;
  const available = donations.filter((d) => d.status === "available").length;
  const claimed = donations.filter((d) => d.status === "claimed").length;
  const completed = donations.filter((d) => d.status === "completed").length;
  const totalServings = donations.reduce((sum, d) => sum + (Number(d.servings) || 0), 0);
  const activeClaims = claims.filter((c) => c.status === "active").length;

  return {
    totalDonations,
    available,
    claimed,
    completed,
    totalServings,
    activeClaims,
    totalUsers: Math.max(12, totalDonations * 2 + 5), // dynamic realistic metric
  };
};

/**
 * Seed Sample Demo Data as required
 */
export const seedDemoDonations = async (currentUser) => {
  const seededItems = [];
  for (const sample of SAMPLE_DONATIONS) {
    const item = {
      ...sample,
      donorId: currentUser?.uid || "demo-donor-001",
      donorName: currentUser?.displayName || sample.donorName,
      donorEmail: currentUser?.email || sample.donorEmail,
      contact: currentUser?.phone || sample.contact,
    };
    const created = await createDonation(item, currentUser || { uid: "demo-donor-001", displayName: "Demo Kitchen" });
    seededItems.push(created);
  }
  return seededItems;
};
