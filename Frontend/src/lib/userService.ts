import { User } from "@/hooks/useAuth";

// Mock API service for user profile management
// In a real application, this would make HTTP requests to your backend API

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
  private baseUrl = '/api/users'; // This would be your actual backend API URL

  // Mock implementation - replace with actual API calls
  async getUserProfile(userId: string): Promise<UserProfileResponse> {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock user data - in real app, this would be fetched from backend
      const mockUser: User = {
        id: userId,
        email: 'user@example.com',
        firstName: 'John',
        lastName: 'Doe',
        phone: '+1 (555) 123-4567',
        dateOfBirth: '1990-01-01',
        address: '123 Main Street',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      };

      return {
        success: true,
        user: mockUser
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to fetch user profile'
      };
    }
  }

  async updateUserProfile(userId: string, profileData: UserProfileUpdate): Promise<UserProfileResponse> {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Mock validation
      if (!profileData.firstName || !profileData.lastName) {
        return {
          success: false,
          error: 'First name and last name are required'
        };
      }

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

      // Mock updated user data
      const updatedUser: User = {
        id: userId,
        email: profileData.email || 'user@example.com',
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        phone: profileData.phone || '+1 (555) 123-4567',
        dateOfBirth: profileData.dateOfBirth || '1990-01-01',
        address: profileData.address || '123 Main Street',
        city: profileData.city || 'New York',
        state: profileData.state || 'NY',
        zipCode: profileData.zipCode || '10001',
        profilePicture: profileData.profilePicture,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: new Date().toISOString()
      };

      return {
        success: true,
        user: updatedUser
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to update user profile'
      };
    }
  }

  async uploadProfilePicture(userId: string, file: File): Promise<{ success: boolean; url?: string; error?: string }> {
    try {
      // Simulate file upload delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock file validation
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

      // Mock successful upload - return a mock URL
      const mockUrl = `https://api.trackwise.com/uploads/profiles/${userId}-${Date.now()}.jpg`;
      
      return {
        success: true,
        url: mockUrl
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to upload profile picture'
      };
    }
  }

  async deleteUserAccount(userId: string): Promise<{ success: boolean; error?: string }> {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock account deletion
      return {
        success: true
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to delete account'
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
}

export const userService = new UserService();
