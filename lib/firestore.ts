import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
  writeBatch,
  serverTimestamp,
  arrayUnion,
  collectionGroup,
} from "firebase/firestore";
import { db } from "./firebase";
import { Board, Column, Card, UserProfile } from "../types";

// ==========================================
// Board Operations
// ==========================================

export const createBoard = async (title: string, description: string, ownerId: string): Promise<string> => {
  const boardsRef = collection(db, "boards");
  const docRef = await addDoc(boardsRef, {
    title,
    description,
    ownerId,
    memberIds: [ownerId],
    createdAt: serverTimestamp(),
  });

  // Create default columns: "To Do 🌱", "In Progress 🌿", "Blooming 🌸"
  await createColumn(docRef.id, "To Do 🌱", 1);
  await createColumn(docRef.id, "In Progress 🌿", 2);
  await createColumn(docRef.id, "Blooming 🌸", 3);

  return docRef.id;
};

export const updateBoard = async (boardId: string, updates: Partial<Board>) => {
  const boardRef = doc(db, "boards", boardId);
  await updateDoc(boardRef, updates);
};

export const deleteBoard = async (boardId: string) => {
  // First delete the board document
  const boardRef = doc(db, "boards", boardId);
  await deleteDoc(boardRef);
  
  // Note: Firestore subcollections (columns/cards) aren't automatically deleted 
  // on the client without deleting each document. In this app, we will let orphans be
  // or write a clean-up when accessing or deleting if required. Deleting the board document
  // is sufficient for board deletion and security rules will restrict orphan access.
};

// ==========================================
// Column Operations
// ==========================================

export const createColumn = async (boardId: string, title: string, order: number): Promise<string> => {
  const columnsRef = collection(db, "boards", boardId, "columns");
  const docRef = await addDoc(columnsRef, {
    title,
    order,
  });
  return docRef.id;
};

export const updateColumn = async (boardId: string, columnId: string, title: string) => {
  const colRef = doc(db, "boards", boardId, "columns", columnId);
  await updateDoc(colRef, { title });
};

export const deleteColumn = async (boardId: string, columnId: string) => {
  // Delete the column doc
  const colRef = doc(db, "boards", boardId, "columns", columnId);
  await deleteDoc(colRef);
  
  // Also delete cards inside this column
  const cardsRef = collection(db, "boards", boardId, "columns", columnId, "cards");
  const cardsSnap = await getDocs(cardsRef);
  const batch = writeBatch(db);
  cardsSnap.docs.forEach((cardDoc) => {
    batch.delete(cardDoc.ref);
  });
  await batch.commit();
};

// ==========================================
// Card Operations
// ==========================================

export const createCard = async (
  boardId: string,
  columnId: string,
  title: string,
  description: string,
  order: number,
  createdBy: string
): Promise<string> => {
  const cardsRef = collection(db, "boards", boardId, "columns", columnId, "cards");
  const docRef = await addDoc(cardsRef, {
    title,
    description,
    order,
    createdAt: serverTimestamp(),
    createdBy,
  });
  return docRef.id;
};

export const updateCard = async (
  boardId: string,
  columnId: string,
  cardId: string,
  updates: Partial<Card>
) => {
  const cardRef = doc(db, "boards", boardId, "columns", columnId, "cards", cardId);
  await updateDoc(cardRef, updates);
};

export const deleteCard = async (boardId: string, columnId: string, cardId: string) => {
  const cardRef = doc(db, "boards", boardId, "columns", columnId, "cards", cardId);
  await deleteDoc(cardRef);
};

// Batch update orders for cards within a column
export const updateCardOrders = async (
  boardId: string,
  columnId: string,
  orderedCards: { id: string; order: number }[]
) => {
  const batch = writeBatch(db);
  orderedCards.forEach((c) => {
    const cardRef = doc(db, "boards", boardId, "columns", columnId, "cards", c.id);
    batch.update(cardRef, { order: c.order });
  });
  await batch.commit();
};

// Move card to another column and update orders
export const moveCardToColumn = async (
  boardId: string,
  sourceColumnId: string,
  destColumnId: string,
  cardId: string,
  cardData: Omit<Card, "id">,
  newOrder: number
) => {
  const batch = writeBatch(db);

  // 1. Delete from source column
  const sourceRef = doc(db, "boards", boardId, "columns", sourceColumnId, "cards", cardId);
  batch.delete(sourceRef);

  // 2. Create in destination column (with same ID to preserve document reference)
  const destRef = doc(db, "boards", boardId, "columns", destColumnId, "cards", cardId);
  batch.set(destRef, {
    ...cardData,
    order: newOrder,
    createdAt: cardData.createdAt || serverTimestamp(),
  });

  await batch.commit();
};

// ==========================================
// Collaboration Operations
// ==========================================

export const inviteUserByEmail = async (boardId: string, email: string): Promise<{ success: boolean; message: string; isNew?: boolean }> => {
  try {
    const cleanEmail = email.trim().toLowerCase();
    
    // Find user with this email
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("email", "==", cleanEmail));
    const querySnapshot = await getDocs(q);
    
    // If the user already exists:
    if (!querySnapshot.empty) {
      const targetUserId = querySnapshot.docs[0].id;
      
      // Check if already in members
      const boardRef = doc(db, "boards", boardId);
      const boardSnap = await getDoc(boardRef);
      
      if (!boardSnap.exists()) {
        return { success: false, message: "Board not found" };
      }
      
      const boardData = boardSnap.data() as Board;
      if (boardData.memberIds.includes(targetUserId)) {
        return { success: true, isNew: false, message: `${email} is already working in this garden! 🌿` };
      }
      
      // Add to members
      await updateDoc(boardRef, {
        memberIds: arrayUnion(targetUserId)
      });
      
      return { success: true, isNew: false, message: `Successfully added ${email} to this board! 🌸` };
    }
    
    // If the user does NOT exist yet, create a pending invitation
    const invitesRef = collection(db, "pending_invitations");
    const inviteQuery = query(invitesRef, where("boardId", "==", boardId), where("email", "==", cleanEmail));
    const inviteSnap = await getDocs(inviteQuery);
    
    if (!inviteSnap.empty) {
      return { success: true, isNew: true, message: `An invitation is already pending for ${email} on this board! 🌿` };
    }
    
    // Create new pending invitation
    await addDoc(invitesRef, {
      boardId,
      email: cleanEmail,
      createdAt: serverTimestamp()
    });
    
    return { 
      success: true, 
      isNew: true,
      message: `Invitation planted! Once ${email} registers, they will be added to the board automatically. 🌱` 
    };
  } catch (error: any) {
    console.error("Invite error: ", error);
    return { success: false, message: error.message || "An error occurred while inviting." };
  }
};
