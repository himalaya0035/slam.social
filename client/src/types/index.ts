// User types
export interface User {
  _id: string;
  name: string;
  uniqueId: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserWithPassword extends User {
  password: string;
}

export interface AuthResponse {
  _id: string;
  name: string;
  uniqueId: string;
  token: string;
  password?: string;
}

// Feedback types
export interface Ratings {
  reliability: number;
  trustworthiness: number;
  honesty: number;
  intelligence: number;
  funFactor: number;
  overall?: number;
}

export interface FeedbackSubmission {
  uniqueId: string;
  ratings: Ratings;
  comment: string;
}

export interface FeedbackResponse {
  averageRatings: Ratings;
  comments: string[];
  count: number;
}

// Context types
export interface AppState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  feedback: FeedbackResponse | null;
}

export interface AppContextType extends AppState {
  createNewUser: (name: string) => Promise<UserWithPassword | null>;
  authenticateWithPassword: (uniqueId: string, password: string) => Promise<boolean>;
  getUserProfile: (uniqueId: string) => Promise<User | null>;
  submitUserFeedback: (feedback: FeedbackSubmission) => Promise<boolean>;
  getUserFeedback: (userId: string) => Promise<FeedbackResponse | null>;
  logout: () => void;
  clearError: () => void;
} 