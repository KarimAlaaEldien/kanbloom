export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  photoURL?: string;
}

export interface Board {
  id: string;
  title: string;
  description: string;
  ownerId: string;
  memberIds: string[];
  createdAt: any; // Firestore Timestamp
}

export interface Column {
  id: string;
  title: string;
  order: number;
}

export interface Card {
  id: string;
  title: string;
  description: string;
  order: number;
  createdAt: any; // Firestore Timestamp
  createdBy: string;
}
