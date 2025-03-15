import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import {
  AppState,
  AppContextType,
  User,
  UserWithPassword,
  FeedbackSubmission,
  FeedbackResponse,
} from '../types';
import {
  createUser,
  getUserByUniqueId,
  authenticateUser,
  submitFeedback,
  getFeedback,
  verifyAndGetFeedback,
} from '../services/api';

// Initial state
const initialState: AppState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  feedback: null,
};

// Action types
enum ActionType {
  SET_LOADING = 'SET_LOADING',
  SET_USER = 'SET_USER',
  SET_AUTHENTICATED = 'SET_AUTHENTICATED',
  SET_ERROR = 'SET_ERROR',
  CLEAR_ERROR = 'CLEAR_ERROR',
  SET_FEEDBACK = 'SET_FEEDBACK',
  LOGOUT = 'LOGOUT',
}

// Action interfaces
interface SetLoadingAction {
  type: ActionType.SET_LOADING;
  payload: boolean;
}

interface SetUserAction {
  type: ActionType.SET_USER;
  payload: User | null;
}

interface SetAuthenticatedAction {
  type: ActionType.SET_AUTHENTICATED;
  payload: boolean;
}

interface SetErrorAction {
  type: ActionType.SET_ERROR;
  payload: string;
}

interface ClearErrorAction {
  type: ActionType.CLEAR_ERROR;
}

interface SetFeedbackAction {
  type: ActionType.SET_FEEDBACK;
  payload: FeedbackResponse | null;
}

interface LogoutAction {
  type: ActionType.LOGOUT;
}

type AppAction =
  | SetLoadingAction
  | SetUserAction
  | SetAuthenticatedAction
  | SetErrorAction
  | ClearErrorAction
  | SetFeedbackAction
  | LogoutAction;

// Reducer
const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case ActionType.SET_LOADING:
      return {
        ...state,
        loading: action.payload,
      };
    case ActionType.SET_USER:
      return {
        ...state,
        user: action.payload,
      };
    case ActionType.SET_AUTHENTICATED:
      return {
        ...state,
        isAuthenticated: action.payload,
      };
    case ActionType.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false,
      };
    case ActionType.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };
    case ActionType.SET_FEEDBACK:
      return {
        ...state,
        feedback: action.payload,
      };
    case ActionType.LOGOUT:
      return {
        ...initialState,
      };
    default:
      return state;
  }
};

// Create context
const AppContext = createContext<AppContextType | undefined>(undefined);

// Provider component
export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Check for token on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    const uniqueId = localStorage.getItem('uniqueId');
    const name = localStorage.getItem('name');

    if (token && userId && uniqueId && name) {
      dispatch({ type: ActionType.SET_USER, payload: { _id: userId, name, uniqueId, createdAt: '', updatedAt: '' } });
      dispatch({ type: ActionType.SET_AUTHENTICATED, payload: true });
    }
  }, []);

  // Get user profile
  const getUserProfile = useCallback(async (uniqueId: string): Promise<User | null> => {
    try {
      dispatch({ type: ActionType.SET_LOADING, payload: true });
      const userData = await getUserByUniqueId(uniqueId);
      dispatch({ type: ActionType.SET_LOADING, payload: false });
      return userData;
    } catch (error: any) {
      dispatch({ type: ActionType.SET_ERROR, payload: error.response?.data?.message || 'Failed to get user profile' });
      return null;
    }
  }, []);

  // Create a new user
  const createNewUser = useCallback(async (name: string, password: string): Promise<UserWithPassword | null> => {
    try {
      dispatch({ type: ActionType.SET_LOADING, payload: true });
      const userData = await createUser(name, password);
      
      // Save to localStorage
      localStorage.setItem('token', userData.token);
      localStorage.setItem('userId', userData._id);
      localStorage.setItem('uniqueId', userData.uniqueId);
      localStorage.setItem('name', userData.name);
      
      dispatch({ type: ActionType.SET_USER, payload: userData });
      dispatch({ type: ActionType.SET_AUTHENTICATED, payload: true });
      dispatch({ type: ActionType.SET_LOADING, payload: false });
      
      return userData;
    } catch (error: any) {
      dispatch({ type: ActionType.SET_ERROR, payload: error.response?.data?.message || 'Failed to create user' });
      return null;
    }
  }, []);

  // Authenticate user with password
  const authenticateWithPassword = useCallback(async (uniqueId: string, password: string): Promise<boolean> => {
    try {
      dispatch({ type: ActionType.SET_LOADING, payload: true });
      const userData = await authenticateUser(uniqueId, password);
      
      // Save to localStorage
      localStorage.setItem('token', userData.token);
      localStorage.setItem('userId', userData._id);
      localStorage.setItem('uniqueId', userData.uniqueId);
      localStorage.setItem('name', userData.name);
      
      dispatch({ type: ActionType.SET_USER, payload: userData });
      dispatch({ type: ActionType.SET_AUTHENTICATED, payload: true });
      dispatch({ type: ActionType.SET_LOADING, payload: false });
      
      return true;
    } catch (error: any) {
      dispatch({ type: ActionType.SET_ERROR, payload: error.response?.data?.message || 'Authentication failed' });
      return false;
    }
  }, []);

  // Submit feedback
  const submitUserFeedback = useCallback(async (feedbackData: FeedbackSubmission): Promise<boolean> => {
    try {
      dispatch({ type: ActionType.SET_LOADING, payload: true });
      await submitFeedback(feedbackData.uniqueId, feedbackData.ratings, feedbackData.comment);
      dispatch({ type: ActionType.SET_LOADING, payload: false });
      return true;
    } catch (error: any) {
      dispatch({ type: ActionType.SET_ERROR, payload: error.response?.data?.message || 'Failed to submit feedback' });
      return false;
    }
  }, []);

  // Get user feedback
  const getUserFeedback = useCallback(async (userId: string): Promise<FeedbackResponse | null> => {
    try {
      dispatch({ type: ActionType.SET_LOADING, payload: true });
      const feedbackData = await getFeedback(userId);
      dispatch({ type: ActionType.SET_FEEDBACK, payload: feedbackData });
      dispatch({ type: ActionType.SET_LOADING, payload: false });
      return feedbackData;
    } catch (error: any) {
      if (error.response?.status === 403) {
        // Not enough feedback yet
        dispatch({ 
          type: ActionType.SET_ERROR, 
          payload: `Not enough feedback yet. You have ${error.response.data.count} out of ${error.response.data.required} required responses.` 
        });
      } else {
        dispatch({ type: ActionType.SET_ERROR, payload: error.response?.data?.message || 'Failed to get feedback' });
      }
      return null;
    }
  }, []);

  // Verify password and get feedback
  const verifyPasswordAndGetFeedback = useCallback(async (uniqueId: string, password: string): Promise<FeedbackResponse | null> => {
    try {
      dispatch({ type: ActionType.SET_LOADING, payload: true });
      const feedbackData = await verifyAndGetFeedback(uniqueId, password);
      dispatch({ type: ActionType.SET_FEEDBACK, payload: feedbackData });
      dispatch({ type: ActionType.SET_LOADING, payload: false });
      return feedbackData;
    } catch (error: any) {
      if (error.response?.status === 403) {
        // Not enough feedback yet
        dispatch({ 
          type: ActionType.SET_ERROR, 
          payload: `Not enough feedback yet. You have ${error.response.data.count} out of ${error.response.data.required} required responses.` 
        });
      } else if (error.response?.status === 401) {
        dispatch({ type: ActionType.SET_ERROR, payload: 'Invalid password. Please try again.' });
      } else {
        dispatch({ type: ActionType.SET_ERROR, payload: error.response?.data?.message || 'Failed to get feedback' });
      }
      dispatch({ type: ActionType.SET_LOADING, payload: false });
      return null;
    }
  }, []);

  // Logout
  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('uniqueId');
    localStorage.removeItem('name');
    dispatch({ type: ActionType.LOGOUT });
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    dispatch({ type: ActionType.CLEAR_ERROR });
  }, []);

  return (
    <AppContext.Provider
      value={{
        ...state,
        createNewUser,
        authenticateWithPassword,
        getUserProfile,
        submitUserFeedback,
        getUserFeedback,
        verifyPasswordAndGetFeedback,
        logout,
        clearError,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to use the context
export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}; 