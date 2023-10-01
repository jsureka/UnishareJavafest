import api from "../api";
const AuthService = {
  login: (user) => {
    return api.postAsync("/auth/authenticate", user);
  },

  register: (user) => {
    return api.postFormAsync("/auth/register", user);
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
  autoVerify: (data) => {
    return api.postAsync(`/ML/auto-verification`, data);
  },
  imageUpload: (data) => {
    return api.postAsync(`/upload/image`, data);
  },

  forgetPassword: (data) => {
    return api.postAsync(`/auth/send-password-reset-token`, data);
  },

  resetPassword: (data) => {
    return api.postAsync(`/auth/password-reset`, data);
  },
  sendVerificationEmail: () => {
    return api.postAsync(`/auth/email-verification-otp`);
  },
  verifyEmail: (data) => {
    return api.postAsync(`/auth/email-verification`, data);
  },
};

export default AuthService;
