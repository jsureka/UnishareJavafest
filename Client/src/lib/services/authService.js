import api from "../api";
const AuthService = {
  login: (user) => {
    return api.postAsync("/auth/login", user);
  },

  register: (user) => {
    return api.postAsync("/auth/register", user);
  },

  logout: () => {
    return api.postAsync("/auth/logout");
  },

  getMe: () => {
    return api.getAsync("/auth/me");
  },

  updateMe: (user) => {
    return api.putAsync("/auth/me", user);
  },

  deleteMe: () => {
    return api.deleteAsync("/auth/me");
  },
};

export default AuthService;
