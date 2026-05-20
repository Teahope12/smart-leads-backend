export const Messages = {
  AUTH: {
    REGISTER_SUCCESS: 'User registered successfully',
    LOGIN_SUCCESS: 'Login successful',
    LOGOUT_SUCCESS: 'Logout successful',
    INVALID_CREDENTIALS: 'Invalid email or password',
    USER_EXISTS: 'User already exists with this email',
    UNAUTHORIZED: 'Authentication required',
    INVALID_TOKEN: 'Invalid token',
    TOKEN_EXPIRED: 'Token expired'
  },
  COMMON: {
    SERVER_ERROR: 'Something went wrong',
    NOT_FOUND: 'Resource not found'
  }
} as const;