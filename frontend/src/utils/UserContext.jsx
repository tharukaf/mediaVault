import { createContext, useContext, useReducer, useEffect } from 'react'
import { baseURL } from './FetchData'

// Initial state
const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isGuest: true,
  isLoading: true,
  error: null
}

// Action types
const AUTH_ACTIONS = {
  LOGIN_START: 'LOGIN_START',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_FAILURE: 'LOGIN_FAILURE',
  LOGOUT: 'LOGOUT',
  REGISTER_START: 'REGISTER_START',
  REGISTER_SUCCESS: 'REGISTER_SUCCESS',
  REGISTER_FAILURE: 'REGISTER_FAILURE',
  SET_GUEST: 'SET_GUEST',
  CLEAR_ERROR: 'CLEAR_ERROR',
  SET_LOADING: 'SET_LOADING'
}

// Reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_ACTIONS.LOGIN_START:
    case AUTH_ACTIONS.REGISTER_START:
      return {
        ...state,
        isLoading: true,
        error: null
      }

    case AUTH_ACTIONS.LOGIN_SUCCESS:
    case AUTH_ACTIONS.REGISTER_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isGuest: false,
        isLoading: false,
        error: null
      }

    case AUTH_ACTIONS.LOGIN_FAILURE:
    case AUTH_ACTIONS.REGISTER_FAILURE:
      return {
        ...state,
        user: { name: 'Guest', email: null },
        token: null,
        isAuthenticated: false,
        isGuest: true,
        isLoading: false,
        error: action.payload
      }

    case AUTH_ACTIONS.LOGOUT:
    case AUTH_ACTIONS.SET_GUEST:
      return {
        ...state,
        user: { name: 'Guest', email: null },
        token: null,
        isAuthenticated: false,
        isGuest: true,
        isLoading: false,
        error: null
      }

    case AUTH_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null
      }

    case AUTH_ACTIONS.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload
      }

    default:
      return state
  }
}

// Create context
export const AuthContext = createContext()

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState)

  // Load user from localStorage on mount
  useEffect(() => {
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')

    if (token && userData) {
      try {
        const user = JSON.parse(userData)
        dispatch({
          type: AUTH_ACTIONS.LOGIN_SUCCESS,
          payload: { user, token }
        })
      } catch (error) {
        console.error('Error parsing stored user data:', error)
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        dispatch({ type: AUTH_ACTIONS.SET_GUEST })
      }
    } else {
      dispatch({ type: AUTH_ACTIONS.SET_GUEST })
    }

    dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false })
  }, [])

  // Login function
  const login = async (email, password) => {
    dispatch({ type: AUTH_ACTIONS.LOGIN_START })

    try {
      const response = await fetch(`${baseURL}api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        // Handle specific error cases
        let errorMessage = data.error || 'Login failed'

        if (response.status === 401) {
          errorMessage = 'Invalid email or password. Please check your credentials and try again.'
        } else if (response.status === 400) {
          errorMessage = data.error || 'Please check your input and try again.'
        } else if (response.status === 429) {
          errorMessage = 'Too many login attempts. Please wait a few minutes before trying again.'
        } else if (response.status >= 500) {
          errorMessage = 'Server error. Please try again later.'
        }

        throw new Error(errorMessage)
      }

      // Store in localStorage
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))

      dispatch({
        type: AUTH_ACTIONS.LOGIN_SUCCESS,
        payload: { user: data.user, token: data.token }
      })

      return { success: true }
    } catch (error) {
      dispatch({
        type: AUTH_ACTIONS.LOGIN_FAILURE,
        payload: error.message
      })
      return { success: false, error: error.message }
    }
  }

  // Register function
  const register = async (email, name, password) => {
    dispatch({ type: AUTH_ACTIONS.REGISTER_START })

    try {
      const response = await fetch(`${baseURL}api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, name, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        // Handle specific error cases
        let errorMessage = data.error || 'Registration failed'

        if (response.status === 409) {
          errorMessage = 'An account with this email already exists. Please try logging in instead.'
        } else if (response.status === 400) {
          errorMessage = data.error || 'Please check your input and try again.'
        } else if (response.status === 429) {
          errorMessage = 'Too many attempts. Please wait a few minutes before trying again.'
        } else if (response.status >= 500) {
          errorMessage = 'Server error. Please try again later.'
        }

        throw new Error(errorMessage)
      }

      // Store in localStorage
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))

      dispatch({
        type: AUTH_ACTIONS.REGISTER_SUCCESS,
        payload: { user: data.user, token: data.token }
      })

      return { success: true }
    } catch (error) {
      dispatch({
        type: AUTH_ACTIONS.REGISTER_FAILURE,
        payload: error.message
      })
      return { success: false, error: error.message }
    }
  }

  // Logout function
  const logout = async () => {
    try {
      // Call logout endpoint if authenticated
      if (state.token) {
        await fetch(`${baseURL}api/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${state.token}`,
          },
        })
      }
    } catch (error) {
      console.error('Logout request failed:', error)
    } finally {
      // Clear localStorage and set to guest mode
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      dispatch({ type: AUTH_ACTIONS.SET_GUEST })
    }
  }

  // Clear error function
  const clearError = () => {
    dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR })
  }

  // Get auth headers for API calls
  const getAuthHeaders = () => {
    if (state.token) {
      return {
        'Authorization': `Bearer ${state.token}`,
        'Content-Type': 'application/json',
      }
    }
    return {
      'Content-Type': 'application/json',
    }
  }

  // Get current user object (includes Guest)
  const currentUser = state.isGuest || !state.user
    ? { name: 'Guest', email: null, token: null }
    : state.user

  const value = {
    // Current state
    user: state.user,
    currentUser, // For backward compatibility
    token: state.token,
    isAuthenticated: state.isAuthenticated,
    isGuest: state.isGuest,
    isLoading: state.isLoading,
    error: state.error,

    // Actions
    login,
    loginUser: login, // Alias for compatibility
    register,
    registerUser: register, // Alias for compatibility
    logout,
    logoutUser: logout, // Alias for compatibility
    clearError,
    getAuthHeaders,

    // For backward compatibility
    setCurrentUser: (user) => {
      if (user.name === 'Guest') {
        dispatch({ type: AUTH_ACTIONS.SET_GUEST })
      } else {
        dispatch({
          type: AUTH_ACTIONS.LOGIN_SUCCESS,
          payload: { user, token: user.token }
        })
      }
    }
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
