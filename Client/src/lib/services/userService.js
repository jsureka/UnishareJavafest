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

  delete: (id) => {
    return api.deleteAsync(`/users/${id}`);
  },
};

export default UserService;
