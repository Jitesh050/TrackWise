import { User } from "@/hooks/useAuth";
import { db, storage, auth } from "@/lib/firebase";
import {
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  Timestamp,
  DocumentSnapshot
} from "firebase/firestore";
import {
  ref,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { deleteUser } from "firebase/auth";

// User profile service using Firebase Firestore and Storage

export interface UserProfileUpdate {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  dateOfBirth?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  profilePicture?: string;
}

export interface UserProfileResponse {
  success: boolean;
  user?: User;
  error?: string;
}

class UserService {
  // Implementation using Firebase
  async getUserProfile(userId: string): Promise<UserProfileResponse> {
    try {
      // Try 'users' collection first
      const userRef = doc(db, 'users', userId);
      let userSnap = await getDoc(userRef);
      let role: 'user' | 'admin' = 'user';

      if (!userSnap.exists()) {
        // Try 'admins' collection
        const adminRef = doc(db, 'admins', userId);
        userSnap = await getDoc(adminRef);
        role = 'admin';
      }

      if (!userSnap.exists()) {
        return {
          success: false,
          error: 'User not found'
        };
      }

      const user = this.convertDocToUser(userSnap, role);

      return {
        success: true,
        user: user
      };
    } catch (error) {
      console.error("Error fetching user profile:", error);
      return {
        success: false,
        error: 'Failed to fetch user profile'
      };
    }
  }

  async updateUserProfile(userId: string, profileData: UserProfileUpdate): Promise<UserProfileResponse> {
    try {
      // Validate inputs
      if (profileData.email && !this.isValidEmail(profileData.email)) {
        return {
          success: false,
          error: 'Invalid email format'
        };
      }

      if (profileData.phone && !this.isValidPhone(profileData.phone)) {
        return {
          success: false,
          error: 'Invalid phone number format'
        };
      }

      // Check which collection the user is in
      let collectionName = 'users';
      let userRef = doc(db, 'users', userId);
      let userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        userRef = doc(db, 'admins', userId);
        userSnap = await getDoc(userRef);
        collectionName = 'admins';
      }

      if (!userSnap.exists()) {
        return {
          success: false,
          error: 'User not found'
        };
      }

      // Update the document
      await updateDoc(userRef, {
        ...profileData,
        updatedAt: serverTimestamp()
      });

      // Fetch the updated data to return
      const updatedSnap = await getDoc(userRef);
      const user = this.convertDocToUser(updatedSnap, collectionName === 'admins' ? 'admin' : 'user');

      return {
        success: true,
        user: user
      };

    } catch (error) {
      console.error("Error updating user profile:", error);
      return {
        success: false,
        error: 'Failed to update user profile'
      };
    }
  }

  async uploadProfilePicture(userId: string, file: File): Promise<{ success: boolean; url?: string; error?: string }> {
    try {
      // File validation
      if (!file.type.startsWith('image/')) {
        return {
          success: false,
          error: 'File must be an image'
        };
      }

      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        return {
          success: false,
          error: 'File size must be less than 5MB'
        };
      }

      // Create a reference to the file location
      // Using a timestamp to avoid caching issues if re-uploaded
      const storageRef = ref(storage, `profile-pictures/${userId}/${Date.now()}_${file.name}`);

      // Upload the file
      await uploadBytes(storageRef, file);

      // Get the download URL
      const url = await getDownloadURL(storageRef);
      
      return {
        success: true,
        url: url
      };
    } catch (error) {
      console.error("Error uploading profile picture:", error);
      return {
        success: false,
        error: 'Failed to upload profile picture'
      };
    }
  }

  async deleteUserAccount(userId: string): Promise<{ success: boolean; error?: string }> {
    try {
      // Delete Firestore document
      // Check 'users' first
      let userRef = doc(db, 'users', userId);
      let userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        await deleteDoc(userRef);
      } else {
        // Check 'admins'
        userRef = doc(db, 'admins', userId);
        userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          await deleteDoc(userRef);
        }
        // If neither exists, we can still proceed to delete Auth user if it matches
      }

      // Delete Auth user if it matches the current user
      const currentUser = auth.currentUser;
      if (currentUser && currentUser.uid === userId) {
        await deleteUser(currentUser);
      } else {
        // If the user being deleted is not the current user, we can't delete the Auth account from the client SDK
        // (unless we are admin using Admin SDK, which is not available in client)
        // We just return success for the data deletion part, or warn
        if (!currentUser || currentUser.uid !== userId) {
            console.warn("Deleted user data, but could not delete Auth account (requires current user login or admin SDK)");
        }
      }
      
      return {
        success: true
      };
    } catch (error: any) {
      console.error("Error deleting user account:", error);
      // If it's an auth error (e.g. requires-recent-login), pass it through
      return {
        success: false,
        error: error.message || 'Failed to delete account'
      };
    }
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private isValidPhone(phone: string): boolean {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
  }

  private convertDocToUser(docSnap: DocumentSnapshot, role: 'user' | 'admin'): User {
    const data = docSnap.data();
    if (!data) return { id: docSnap.id, role } as User; // Should ideally throw or return null if data is missing but calling context checks exists()

    const user: any = { ...data, id: docSnap.id, role };

    // Convert Timestamps to ISO strings
    if (user.createdAt instanceof Timestamp) {
      user.createdAt = user.createdAt.toDate().toISOString();
    }
    if (user.updatedAt instanceof Timestamp) {
      user.updatedAt = user.updatedAt.toDate().toISOString();
    }
    if (user.dateOfBirth instanceof Timestamp) {
      user.dateOfBirth = user.dateOfBirth.toDate().toISOString();
    }

    return user as User;
  }
}

export const userService = new UserService();
