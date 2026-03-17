export const initialAuthState = {
  isAuthenticated: false,
  user: null,
  token: null,
  error: null,
};

export function authReducer(state, action) {
  switch (action.type) {
    case "SIGNUP":
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token,
        error: null,
      };

    case "LOGIN":
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token,
        error: null,
      };

    case "LOGOUT":
      return { ...state, isAuthenticated: false, user: null, token: null, error: null };

    case "SET_ERROR":
      return { ...state, error: action.payload };

    case "SET_ERROR":
      return { ...state, error: action.payload };

    default:
      return state;
  }
}
