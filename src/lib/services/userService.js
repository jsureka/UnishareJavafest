import api from "../api";

const UserService = {
  getAll: () => {
    return api.getAsync("/users");
  },

  create: (user) => {
    return api.postAsync("/users", user);
  },

  update: (user) => {
    return api.putAsync(`/users/${user.id}`, user);
  },

  getOne: (id) => {
    return api.getAsync(`/users/${id}`);
  },

  getCurrentUser: () => {
    return api.getAsync("/users/me");
  },

  delete: (id) => {
    return api.deleteAsync(`/users/${id}`);
  },
  getPaginated: (page, size) => {
    return api.getAsync(`/users?page=${page}&size=${size}`);
  },
  block: (id) => {
    return api.putAsync(`/users/block-user/${id}`);
  },
  autoVerify: () => {
    return api.postAsync(`/auth/verify-me`);
  },
};

export default UserService;
